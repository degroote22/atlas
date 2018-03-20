import * as React from "react";
import MenuBar from "./MenuBar";
import MenuGroup from "./MenuGroup";
import MenuItem from "./MenuItem";
import { IMenuGroup, IMenuItem } from "../Interfaces";

interface IProps {
  closeMenu: () => void;
  hidden: boolean;
  groups: IMenuGroup[];
  onMenuClick: (item: IMenuItem) => void;
  canEdit: boolean;
}

const groupsDefault: IMenuGroup[] = [
  {
    title: "Outros",
    editable: false,
    items: [
      {
        title: "Fazer Login",
        type: "default",
        payload: "login"
      },
      {
        title: "Sobre",
        type: "default",
        payload: "about"
      }
    ]
  }
];

class Menu extends React.Component<IProps> {
  private onMenuClick = (item: IMenuItem) => {
    this.props.onMenuClick(item);
  };

  private renderGroups = () => {
    return [...this.props.groups, ...groupsDefault].map(
      group => (
        <MenuGroup
          key={group.title}
          title={group.title}
          editable={group.editable}
          canEdit={this.props.canEdit}
        >
          {group.items.map(item => (
            <MenuItem
              item={item}
              key={item.title}
              onClick={this.onMenuClick}
            />
          ))}
        </MenuGroup>
      )
    );
  };

  private renderCreateGroup = () => "createGroup";

  render() {
    if (this.props.hidden) {
      return null;
    }
    return (
      <div
        style={{
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%"
        }}
      >
        <MenuBar
          onClick={this.props.closeMenu}
          title={"Menu"}
          type="close"
        />
        {this.renderGroups()}
        {this.props.canEdit && this.renderCreateGroup()}
      </div>
    );
  }
}

export default Menu;
