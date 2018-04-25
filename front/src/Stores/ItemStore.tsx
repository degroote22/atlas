import { AutoSubscribeStore, autoSubscribe } from "resub";
import { IItemToCreate } from "../Interfaces";
// import Firebase from "../Database/firebase";
import DbStoreInject from "./DbStoreInject";

export const getProgressText = (
  x: number,
  extra?: string
) => {
  const t = extra ? extra : "";
  const n = x > 99 ? 99 : x;

  return n + "% concluído. " + t;
};

@AutoSubscribeStore
export class ItemStore extends DbStoreInject {
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
    this.uploading = true;
    this.uploadingText = getProgressText(x, extra);
    this.trigger();
  };

  private onProgress = (snapshot: any) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = Math.floor(
      snapshot.bytesTransferred / snapshot.totalBytes * 100
    );

    switch (snapshot.state) {
      case "paused": // or 'paused'
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
    const newItem = {
      title: item.title,
      width: item.width,
      height: item.height,
      extension
    };
    return this.db().Item.Set(groupid, key, newItem);
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

      const reference = await this.db().Item.Push(groupid);
      const key = reference.key;
      const filename = key + "." + extension;
      const imageRef = this.db().Storage.CreateImageRef(
        filename
      );

      const task = imageRef.put(item.file);

      // const that = this;

      return new Promise((rs, rj) => {
        task.on(
          "state_changed",
          this.onProgress,
          error => {
            this.uploadingText =
              "Houve um erro no upload da imagem. " +
              JSON.stringify(error);
            this.uploading = false;
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
              this.uploading = false;
              this.uploadingText = "Enviado com sucesso!";
              this.trigger();
              rs();
            })
        );
      }) as Promise<void>;
    } catch (err) {
      this.uploadingText =
        "Houve um erro na criação. " + JSON.stringify(err);
      this.uploading = false;
      this.trigger();
      return Promise.reject("");
    }
  };

  public delete = async (groupid: string, id: string) => {
    const ok = confirm("Excluir item?");
    if (ok) {
      this.st().RouterStore.reset();
      this.db().Item.Delete(groupid, id);
    }
  };
}

const store = new ItemStore();

export default store;
