import * as React from "react";
import { IItemToCreate } from "../Interfaces";

interface IProps {
  loading: boolean;
  onCreateItem: (
    groupid: string,
    item: IItemToCreate
  ) => Promise<void>;
  groupid: string;
  grouptitle: string;
  uploading: boolean;
  uploadPercent: string;
  uploadingGroupid: string;
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

class CreateItem extends React.Component<IProps, IState> {
  readonly state = initialState;

  private onChangeTitle = (e: any) => {
    this.setState({ newTitle: e.target.value });
  };

  private thisInstanceUploading = () => {
    return (
      this.props.uploading &&
      this.props.uploadingGroupid === this.props.groupid
    );
  };

  private isDisabled = () => {
    return (
      this.thisInstanceUploading() ||
      this.state.file == null ||
      this.state.newTitle.length === 0
    );
  };

  private onCreate = () => {
    this.setState({ error: false });
    if (this.isDisabled()) {
      // Já tá criando um
      // Não selecionou arquivo
      // Não tem texto
      return;
    }

    this.props
      .onCreateItem(this.props.groupid, {
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
    const loading = this.thisInstanceUploading()
      ? "is-loading"
      : "";
    return (
      <>
        <h2 className="subtitle">
          Cadastrar nova foto em {this.props.grouptitle}
        </h2>
        <div className="field is-grouped">
          <div className="control">
            <div className="file is-dark">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  name="resume"
                  onChange={this.onChangePhoto}
                />
                <span className="file-cta">
                  <span className="file-label">
                    Escolha a foto
                  </span>
                </span>
              </label>
            </div>
          </div>
          {this.state.fileName !== "" && (
            <span
              className="file-name"
              style={{ marginRight: 16, borderWidth: 2 }}
            >
              {this.state.fileName}
            </span>
          )}
          <div className="control">
            <input
              onChange={this.onChangeTitle}
              value={this.state.newTitle}
              className="input"
              type="text"
              placeholder="Digite o título"
            />
          </div>
          <div className="control">
            <button
              disabled={this.isDisabled()}
              className={"button is-dark " + loading}
              onClick={this.onCreate}
            >
              Criar
            </button>
          </div>
        </div>

        {this.thisInstanceUploading() && (
          <div className="field">
            {this.state.error && "Erro na criação."}
            <br />
            {this.props.uploadPercent}
          </div>
        )}
      </>
    );
  }
}

export default CreateItem;
