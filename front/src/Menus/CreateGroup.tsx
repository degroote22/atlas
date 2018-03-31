import * as React from "react";
interface IProps {
  loading: boolean;
  onCreateGroup: (title: string) => Promise<void>;
}

const initialState = {
  newTitle: "",
  error: false
};

type IState = Readonly<typeof initialState>;

class CreateGroup extends React.Component<IProps, IState> {
  readonly state: IState = initialState;

  private onChangeTitle = (event: any) => {
    this.setState({ newTitle: event.target.value });
  };

  private onCreate = () => {
    if (this.isDisabled()) {
      return;
    }
    this.setState({
      error: false
    });
    this.props
      .onCreateGroup(this.state.newTitle)
      .then(() => {
        this.setState(initialState);
      })
      .catch(() => {
        this.setState({ error: true });
      });
  };

  private isDisabled = () =>
    this.state.newTitle.length === 0;

  render() {
    return (
      <section className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Criar nova seção</h1>
            <div className="field has-addons">
              <div className="control">
                <input
                  onChange={this.onChangeTitle}
                  value={this.state.newTitle}
                  className="input"
                  type="text"
                  placeholder="Digite o nome"
                />
              </div>
              <div className="control">
                <button
                  disabled={this.isDisabled()}
                  className="button is-dark"
                  onClick={this.onCreate}
                >
                  Criar
                </button>
              </div>
            </div>
            {this.state.error && (
              <div className="field has-addons">
                <p className="subtitle">
                  Houve um erro no upload!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default CreateGroup;
