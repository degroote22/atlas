import * as React from "react";
import GroupStore from "../Stores/GroupStore";

interface IProps {
  GroupStore?: typeof GroupStore;
}

const initialState = {
  newTitle: "",
  error: false
};

type IState = Readonly<typeof initialState>;

class CreateGroup extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    GroupStore: GroupStore
  };

  readonly state: IState = initialState;

  private GroupStore() {
    if (!this.props.GroupStore) {
      throw Error(
        "Group Store não definida em Create Group"
      );
    }
    return this.props.GroupStore;
  }

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
    this.GroupStore()
      .create(this.state.newTitle)
      .then(() => {
        this.setState(initialState);
      })
      .catch(() => {
        this.setState({ error: true });
      });
  };

  private renderError() {
    return (
      this.state.error && (
        <div className="_error field has-addons">
          <p className="subtitle">
            Houve um erro no upload!
          </p>
        </div>
      )
    );
  }

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
                  className="input _input"
                  type="text"
                  placeholder="Digite o nome"
                />
              </div>
              <div className="control">
                <button
                  disabled={this.isDisabled()}
                  className="button is-dark _create"
                  onClick={this.onCreate}
                >
                  Criar
                </button>
              </div>
            </div>
            {this.renderError()}
          </div>
        </div>
      </section>
    );
  }
}

export default CreateGroup;
