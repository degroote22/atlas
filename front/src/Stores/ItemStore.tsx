import {
  StoreBase,
  AutoSubscribeStore,
  autoSubscribe
} from "resub";
import { IItemToCreate } from "../Interfaces";
import Firebase from "../Database/firebase";
import RouterStore from "./RouterStore";

@AutoSubscribeStore
class CreateItemStore extends StoreBase {
  private uploading = false;

  @autoSubscribe
  public getUploading() {
    return this.uploading;
  }

  private uploadingText = "";

  @autoSubscribe
  public getUploadingText() {
    return this.uploadingText;
  }

  private uploadingGroupId = "";

  @autoSubscribe
  public getUploadingGroupId() {
    return this.uploadingGroupId;
  }

  private setProgress = (x: number, extra?: string) => {
    const t = extra ? extra : "";
    const n = x > 99 ? 99 : x;

    this.uploading = true;
    this.uploadingText = n + "% concluído. " + t;
    this.trigger();
  };

  private onProgress = (snapshot: any) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = Math.floor(
      snapshot.bytesTransferred / snapshot.totalBytes * 100
    );

    switch (snapshot.state) {
      case Firebase.storage.TaskState.PAUSED: // or 'paused'
        this.setProgress(progress, "Upload pausado");
        break;
      // case Firebase.storage.TaskState.RUNNING: // or 'running'
      //   this.setProgress(progress);
      //   // setProgress(progress, 'Upload em andamento')
      //   break;
      default:
        this.setProgress(progress);
        break;
    }
  };

  private onSuccess = ({
    extension,
    groupid,
    key,
    item
  }: {
    extension: string;
    groupid: string;
    key: string;
    item: IItemToCreate;
  }) => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    // var downloadURL = uploadTask.snapshot.downloadURL;
    return Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .child(key)
      .set({
        title: item.title,
        width: item.width,
        height: item.height,
        extension
      });
    // .then(() => {
    //   that.uploading = false;
    //   rs();
    // });
  };

  public create = async (
    groupid: string,
    item: IItemToCreate
  ): Promise<void> => {
    this.uploadingGroupId = groupid;
    this.setProgress(0);

    try {
      const nameSplit = item.file.name.split(".");
      const extension = nameSplit[nameSplit.length - 1];

      const reference = await Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .push();

      const key = reference.key;

      const filename = key + "." + extension;
      const storageRef = Firebase.storage()
        .ref()
        .child("images");

      const imageRef = storageRef.child(filename);

      const task = imageRef.put(item.file);

      const that = this;

      return new Promise((rs, rj) => {
        task.on(
          "state_changed",
          this.onProgress,
          error => {
            this.uploadingText =
              "Houve um erro no upload da imagem";
            that.uploading = false;

            this.trigger();
            rj();
          },
          () =>
            this.onSuccess({
              key,
              item,
              extension,
              groupid
            }).then(() => {
              that.uploading = false;
              that.uploadingText = "Enviado com sucesso!";
              that.trigger();
              rs();
            })
        );
      }) as Promise<void>;
    } catch (err) {
      this.uploadingText = "Houve um erro na criação";
      this.uploading = false;
      this.trigger();
      console.error(err);
      return Promise.reject("");
    }
  };

  public delete = async (groupid: string, id: string) => {
    const ok = confirm("Excluir item?");

    if (ok) {
      RouterStore.reset();
      Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .child(id)
        .set(null);
    }
  };
}

const store = new CreateItemStore();

export default store;
