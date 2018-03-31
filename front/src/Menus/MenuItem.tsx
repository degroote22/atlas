import * as React from "react";
import { IMenuItem } from "../Interfaces";

interface IProps {
  item: IMenuItem;
  onClick: (item: IMenuItem) => void;
  dark: boolean;
}

class MenuItem extends React.Component<IProps> {
  private onClick = () =>
    this.props.onClick(this.props.item);
  render() {
    const cn = this.props.dark
      ? "button is-white"
      : "button is-dark";
    return (
      <p className="field">
        <a className={cn} onClick={this.onClick}>
          {this.props.item.title}
        </a>
      </p>
    );
  }
}

export default MenuItem;
