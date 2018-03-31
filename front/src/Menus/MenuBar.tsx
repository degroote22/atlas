import * as React from "react";
// import * as Sizes from "../Sizes";

interface IProps {
  onClick: () => void;
  title: string;
  type: "close" | "open";
}

class MenuBar extends React.Component<IProps> {
  private getIcon = () =>
    this.props.type === "close" ? (
      <span className="icon is-small">
        <svg
          width="24"
          height="24"
          fill="#363636"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z" />
        </svg>
      </span>
    ) : (
      <span className="icon is-small">
        <svg
          width="24"
          height="24"
          fill="#363636"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z" />
        </svg>
      </span>
    );
  render() {
    const cn =
      this.props.type === "close"
        ? "hero is-dark is-bold"
        : "hero is-dark";
    return (
      <div className={cn}>
        <div className="hero-body">
          <div className="container">
            <nav className="media">
              <p className="media-left">
                <a
                  onClick={this.props.onClick}
                  className="button is-light"
                >
                  {this.getIcon()}
                </a>
              </p>
              <p className="media-content title">
                {this.props.title}
              </p>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default MenuBar;
