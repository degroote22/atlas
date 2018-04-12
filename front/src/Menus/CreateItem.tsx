import * as React from "react";
import ItemStore from "../Stores/ItemStore";
import { ComponentBase } from "resub";
import CreateItemView from "./CreateItemView";
interface IConnectState {
  readonly uploading: boolean;
  readonly uploadingId: string;
  readonly uploadingText: string;
}

interface IConnectProps extends React.Props<{}> {
  groupid: string;
  grouptitle: string;
}

class CreateItemConnector extends ComponentBase<
  IConnectProps,
  IConnectState
> {
  protected _buildState(
    p: IConnectProps,
    i: boolean
  ): IConnectState {
    return {
      uploading: ItemStore.getUploading(),
      uploadingId: ItemStore.getUploadingGroupId(),
      uploadingText: ItemStore.getUploadingText()
    };
  }

  render() {
    return <CreateItem {...this.props} {...this.state} />;
  }
}

interface IState {
  readonly newTitle: string;
  readonly fileName: string;
  readonly width: number;
  readonly height: number;
  readonly file: File | null;
  readonly error: boolean;
}

const initialState: IState = {
  newTitle: "",
  fileName: "",
  width: 0,
  height: 0,
  file: null,
  error: false
};

interface IProps extends IConnectState, IConnectProps {}

class CreateItem extends ComponentBase<IProps, IState> {
  readonly state = initialState;

  private onChangeTitle = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newTitle: ev.target.value });
  };

  private isThisInstanceUploading = () => {
    return this.props.uploadingId === this.props.groupid;
  };

  private isDisabled = () => {
    return (
      this.isThisInstanceUploading() ||
      this.state.file == null ||
      this.state.newTitle.length === 0
    );
  };

  private isLoading() {
    return (
      this.props.uploading && this.isThisInstanceUploading()
    );
  }

  private onCreate = () => {
    this.setState({ error: false });
    if (this.isDisabled()) {
      // Já tá criando um
      // Não selecionou arquivo
      // Não tem texto
      return;
    }

    ItemStore.create(this.props.groupid, {
      title: this.state.newTitle,
      width: this.state.width,
      height: this.state.height,
      file: this.state.file as any
    })
      .then(() => {
        this.setState(initialState);
      })
      .catch(() => {
        // Vai vir com a mensagem de erro do upload...
        this.setState({ error: true });
        // this.setState(initialState);
      });
  };

  private onChangePhoto = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = ev.target.files;
    if (!files) {
      throw Error("Nenhum arquivo selecionado");
    }
    let file = files[0];

    var url = URL.createObjectURL(file);
    var img = new Image();
    const that = this;
    img.onload = function() {
      that.setState({
        fileName: file.name,
        file,
        width: img.width,
        height: img.height
      });
    };

    img.src = url;
  };

  render() {
    return (
      <CreateItemView
        uploading={this.isThisInstanceUploading()}
        loading={this.isLoading()}
        disabled={this.isDisabled()}
        grouptitle={this.props.grouptitle}
        fileName={this.state.fileName}
        uploadingText={this.props.uploadingText}
        newTitle={this.state.newTitle}
        error={this.state.error}
        onChangePhoto={this.onChangePhoto}
        onCreate={this.onCreate}
        onChangeTitle={this.onChangeTitle}
      />
    );
  }
}

export default CreateItemConnector;
