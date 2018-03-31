import * as React from "react";

interface IProps {
  loading: boolean;
  onLogin: (email: string, password: string) => void;
  isLogged: boolean;
  onSignout: () => void;
}

interface IState {
  email: string;
  password: string;
}
export const cn = (ns: string[]) => ns.join(" ");

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
    this.props.onLogin(
      this.state.email,
      this.state.password
    );
  };

  render() {
    if (this.props.isLogged) {
      return (
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container">
              <div style={{ padding: 32, maxWidth: 512 }}>
                <div className="field">
                  <button
                    className={cn([
                      "button",
                      "is-fullwidth",
                      "is-danger",
                      this.props.loading ? "is-loading" : ""
                    ])}
                    onClick={this.props.onSignout}
                    disabled={this.props.loading}
                  >
                    Sair
                  </button>
                </div>
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

export default LoginPage;
