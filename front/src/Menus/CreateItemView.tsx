import * as React from "react";

interface IProps {
  loading: boolean;
  grouptitle: string;
  fileName: string;
  newTitle: string;
  disabled: boolean;
  uploadingText: string;
  error: boolean;
  uploading: boolean;
  onChangePhoto: (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onCreate: () => void;
  onChangeTitle: (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => any;
}

class CreateItemView extends React.Component<IProps> {
  render() {
    const loading = this.props.loading ? "is-loading" : "";
    return (
      <div className="hero is-info">
        <div className="hero-body">
          <div className="container">
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
                      onChange={this.props.onChangePhoto}
                    />
                    <span className="file-cta">
                      <span className="file-label">
                        Escolha a foto
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              {this.props.fileName !== "" && (
                <span
                  className="file-name"
                  style={{
                    marginRight: 16,
                    borderWidth: 2
                  }}
                >
                  {this.props.fileName}
                </span>
              )}
              <div className="control">
                <input
                  onChange={this.props.onChangeTitle}
                  value={this.props.newTitle}
                  className="input"
                  type="text"
                  placeholder="Digite o título"
                />
              </div>
              <div className="control">
                <button
                  disabled={this.props.disabled}
                  className={"button is-dark " + loading}
                  onClick={this.props.onCreate}
                >
                  Criar
                </button>
              </div>
            </div>

            {this.props.uploading && (
              <div className="field">
                {this.props.error && "Erro na criação!"}
                <br />
                {this.props.uploadingText}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateItemView;
