/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
"use strict";

const functions = require("firebase-functions");
const mkdirp = require("mkdirp-promise");
// Include a Service Account Key to use a Signed URL
// const gcs = require('@google-cloud/storage')({keyFilename: 'service-account-credentials.json'});
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 1200;
const THUMB_MAX_WIDTH = 1200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = "thumb_";

// File extension for the created JPEG files.
const JPEG_EXTENSION = ".jpg";

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */

exports.deletePhotos = functions.database
  .ref("/groups/{groupid}/items/{itemid}")
  .onDelete(event => {
    // Grab the current value of what was written to the Realtime Database.
    const oldData = event.data.previous.val();

    const key = event.data.key;

    const filename = key + "." + oldData.extension;

    const thumbname =
      THUMB_PREFIX + key + "." + JPEG_EXTENSION;

    return Promise.all([
      admin
        .storage()
        .bucket()
        .file("images/" + thumbname)
        .delete(),
      admin
        .storage()
        .bucket()
        .file("images/" + filename)
        .delete()
    ]);

    // console.log('Uppercasing', event.params.pushId, original);
    // const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    // return event.data.ref.parent.child('uppercase').set(uppercase);
  });

exports.generateThumbnail = functions.storage
  .object()
  .onChange(event => {
    // File and directory paths.
    const filePath = event.data.name;
    const contentType = event.data.contentType; // This is the image MIME type
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    // const thumbFilePath = path.normalize(
    //   path.join(fileDir, `${THUMB_PREFIX}${fileName}`)
    // );
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);

    // const tempLocalThumbFile = path.join(
    //   os.tmpdir(),
    //   thumbFilePath
    // );

    const baseFileName = path.basename(
      filePath,
      path.extname(filePath)
    );

    const JPEGFilePath = path.normalize(
      path.format({
        dir: fileDir,
        name: `${THUMB_PREFIX}${baseFileName}`,
        ext: JPEG_EXTENSION
      })
    );

    const tempLocalJPEGFile = path.join(
      os.tmpdir(),
      JPEGFilePath
    );

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith("image/")) {
      console.log("This is not an image.");
      return null;
    }

    // Exit if the image is already a thumbnail.
    if (fileName.startsWith(THUMB_PREFIX)) {
      console.log("Already a Thumbnail.");
      return null;
    }

    // Exit if this is a move or deletion event.
    if (event.data.resourceState === "not_exists") {
      console.log("This is a deletion event.");
      return null;
    }

    // Cloud Storage files.
    // const bucket = gcs.bucket(event.data.bucket);
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    // const thumbFile = bucket.file(thumbFilePath);
    const metadata = { contentType: "image/jpeg" };

    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir)
      .then(() => {
        // Download file from bucket.
        return file.download({
          destination: tempLocalFile
        });
      })
      .then(() => {
        console.log(
          "The file has been downloaded to",
          tempLocalFile
        );
        // Generate a thumbnail using ImageMagick.
        return spawn(
          "convert",
          [
            tempLocalFile,
            "-thumbnail",
            `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
            tempLocalJPEGFile
          ],
          { capture: ["stdout", "stderr"] }
        );
      })
      .then(() => {
        console.log(
          "Thumbnail created at",
          tempLocalJPEGFile
        );
        // Uploading the Thumbnail.
        return bucket.upload(tempLocalJPEGFile, {
          destination: JPEGFilePath,
          metadata: metadata
        });
      })
      .then(() => {
        console.log(
          "Thumbnail uploaded to Storage at",
          JPEGFilePath
        );
        // Once the image has been uploaded delete the local files to free up disk space.
        fs.unlinkSync(tempLocalFile);
        fs.unlinkSync(tempLocalJPEGFile);
        console.log("Thumbnail URLs saved to database.");
      })
      .catch(err => {
        console.error("Erro fatal", err);
        throw err;
      });
  });
