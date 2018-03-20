import * as React from "react";
import * as Colors from "../Colors";
import * as Sizes from "../Sizes";

interface IProps {
  onClick: () => void;
  title: string;
  type: "close" | "open";
}

class MenuBar extends React.Component<IProps> {
  private getIcon = () =>
    this.props.type === "close" ? "X" : "M";
  render() {
    return (
      <div
        style={{
          height: Sizes.BarHeight - Sizes.BorderWidth * 2,
          backgroundColor: Colors.Background,
          flexDirection: "row",
          display: "flex",
          borderWidth: Sizes.BorderWidth,
          borderStyle: "solid",
          borderColor: Colors.Borders
        }}
      >
        <div
          style={{
            borderRightWidth: Sizes.BorderWidth,
            borderStyle: "solid",
            borderColor: Colors.Borders,
            borderLeftWidth: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0
          }}
        >
          <button
            onClick={this.props.onClick}
            style={{
              height:
                Sizes.BarHeight -
                Sizes.ButtonMargin * 2 -
                Sizes.BorderWidth * 2,
              width:
                Sizes.BarHeight -
                Sizes.ButtonMargin * 2 -
                Sizes.BorderWidth * 2,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              margin: Sizes.ButtonMargin,
              padding: 0,
              borderWidth: 0
            }}
          >
            {this.getIcon()}
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.props.title}
        </div>
      </div>
    );
  }
}

export default MenuBar;
