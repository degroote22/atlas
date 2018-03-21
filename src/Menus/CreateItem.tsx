import * as React from "react";
import { IItemToCreate } from "../Interfaces";

interface IProps {
  loading: boolean;
  onCreateItem: (
    groupid: string,
    item: IItemToCreate
  ) => void;
  groupid: string;
  grouptitle: string;
}

interface IState {
  newTitle: string;
  fileName: string;
  width: number;
  height: number;
  file: File | null;
}

class CreateItem extends React.Component<IProps, IState> {
  state = {
    newTitle: "",
    fileName: "",
    width: 0,
    height: 0,
    file: null
  };

  private onChangeTitle = (e: any) => {
    this.setState({ newTitle: e.target.value });
  };

  private onCreate = () => {
    if (this.state.file !== null) {
      this.props.onCreateItem(this.props.groupid, {
        title: this.state.newTitle,
        width: this.state.width,
        height: this.state.height,
        file: this.state.file as any
      });
    }
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
            <a
              className="button is-dark"
              onClick={this.onCreate}
            >
              Criar
            </a>
          </div>
        </div>
      </>
    );
  }
}

export default CreateItem;
