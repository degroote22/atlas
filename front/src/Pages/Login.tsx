import * as React from "react";
import { ComponentBase } from "resub";
import AuthStore from "../Stores/AuthStore";

interface IConnectProps extends React.Props<{}> {}

interface IConnectState {
  loading: boolean;
  isLogged: boolean;
}

class ConnectLoginPage extends ComponentBase<
  IConnectProps,
  IConnectState
> {
  protected _buildState(
    p: IConnectProps,
    i: boolean
  ): IConnectState {
    return {
      loading: AuthStore.getLoading(),
      isLogged: AuthStore.getAdminLogged()
    };
  }
  render() {
    return <LoginPage {...this.props} {...this.state} />;
  }
}

interface IState {
  email: string;
  password: string;
}

interface IProps extends IConnectProps, IConnectState {}

const cn = (ns: string[]) => ns.join(" ");

const colorModifier = "is-dark";

class LoginPage extends React.Component<IProps, IState> {
  state = {
    email: "",
    password: ""
  };

  onPasswordChange = (event: any) => {
    if (this.props.loading) {
      return;
    }
    this.setState({ password: event.target.value });
  };

  onEmailChange = (event: any) => {
    if (this.props.loading) {
      return;
    }
    this.setState({ email: event.target.value });
  };

  onLoginClick = () => {
    AuthStore.signIn(this.state.email, this.state.password);
  };

  render() {
    if (this.props.isLogged) {
      return (
        <section className="hero is-light">
          <div className="hero-body">
            <div
              className="container"
              style={{ padding: 32, maxWidth: 512 }}
            >
              <div className="field">
                <button
                  className={cn([
                    "button",
                    "is-fullwidth",
                    "is-danger",
                    this.props.loading ? "is-loading" : ""
                  ])}
                  onClick={AuthStore.signOff}
                  disabled={this.props.loading}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className="hero is-light">
        <div className="hero-body">
          <div
            className="container"
            style={{ maxWidth: 512 }}
          >
            <form
              onSubmit={e => {
                e.preventDefault();
              }}
            >
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    className={cn(["input", colorModifier])}
                    type="email"
                    placeholder="Digite seu e-mail"
                    autoComplete="email"
                    value={this.state.email}
                    disabled={this.props.loading}
                    onChange={this.onEmailChange}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Senha</label>
                <div className="control">
                  <input
                    className={cn(["input", colorModifier])}
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={this.state.password}
                    disabled={this.props.loading}
                    onChange={this.onPasswordChange}
                  />
                </div>
              </div>
              <div className="field">
                <button
                  className={cn([
                    "button",
                    "is-fullwidth",
                    colorModifier,
                    this.props.loading ? "is-loading" : ""
                  ])}
                  onClick={this.onLoginClick}
                  disabled={this.props.loading}
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default ConnectLoginPage;
