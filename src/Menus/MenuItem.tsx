import * as React from "react";
import * as Sizes from "../Sizes";
import { IMenuItem } from "../Interfaces";

interface IProps {
  item: IMenuItem;
  onClick: (item: IMenuItem) => void;
}

class MenuItem extends React.Component<IProps> {
  private onClick = () =>
    this.props.onClick(this.props.item);
  render() {
    return (
      <div
        style={{
          height:
            Sizes.BarHeight / 2 - Sizes.BorderWidth * 2
        }}
      >
        <button
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)"
          }}
          onClick={this.onClick}
        >
          {this.props.item.title}
        </button>
      </div>
    );
  }
}

export default MenuItem;
