import * as React from "react";
interface IProps {
  loading: boolean;
  onCreateGroup: (title: string) => void;
}

interface IState {
  newTitle: string;
}

class CreateGroup extends React.Component<IProps, IState> {
  state = {
    newTitle: ""
  };

  private onChangeTitle = (event: any) => {
    this.setState({ newTitle: event.target.value });
  };

  private onCreate = () => {
    this.props.onCreateGroup(this.state.newTitle);
  };

  render() {
    return (
      <section className="hero is-success">
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
                <a
                  className="button is-dark"
                  onClick={this.onCreate}
                >
                  Criar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CreateGroup;
