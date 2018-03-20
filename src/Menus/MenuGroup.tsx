import * as React from "react";
import * as Colors from "../Colors";
import * as Sizes from "../Sizes";

interface IProps {
  title: string;
  editable: boolean;
  canEdit: boolean;
}

class MenuGroup extends React.Component<IProps> {
  private renderCreateItem = () => {
    return "createItem";
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: Colors.Background,
          borderWidth: Sizes.BorderWidth,
          borderStyle: "solid",
          borderColor: Colors.Borders,
          borderTopWidth: 0
        }}
      >
        <div
          style={{
            height: Sizes.BarHeight - Sizes.BorderWidth * 2,
            flexDirection: "row",
            display: "flex"
          }}
        >
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
        {this.props.children}
        {this.props.canEdit && this.renderCreateItem()}
      </div>
    );
  }
}

export default MenuGroup;
