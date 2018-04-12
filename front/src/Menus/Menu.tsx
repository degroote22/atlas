import * as React from "react";
import MenuBar from "./MenuBar";
import MenuGroup from "./MenuGroup";
import { IMenuGroup } from "../Interfaces";
import CreateGroup from "./CreateGroup";
import RouterStore from "../Stores/RouterStore";
import { ComponentBase } from "resub";
import AuthStore from "../Stores/AuthStore";
import * as Strings from "../Strings";
import DataStore from "../Stores/DataStore";

interface IState {
  canEdit: boolean;
  hidden: boolean;
  groups: IMenuGroup[];
}

interface IProps extends React.Props<{}> {}

class Menu extends ComponentBase<IProps, IState> {
  protected _buildState(
    props: IProps,
    initialBuild: boolean
  ): IState {
    return {
      hidden: RouterStore.getMenuHidden(),
      canEdit: AuthStore.getAdminLogged(),
      groups: DataStore.getMenuGroups()
    };
  }

  render() {
    if (this.state.hidden) {
      return (
        <MenuBar
          onClick={RouterStore.openMenu}
          title={Strings.Title}
          type="open"
        />
      );
    }

    return (
      <div
        style={{
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          backgroundColor: "whitesmoke",
          zIndex: 555
        }}
      >
        <MenuBar
          onClick={RouterStore.closeMenu}
          title={"Menu"}
          type="close"
        />
        {this.state.canEdit && <CreateGroup />}
        {this.state.groups.map((group, index) => (
          <MenuGroup
            key={group.title}
            id={group.id}
            title={group.title}
            editable={group.editable}
            canEdit={this.state.canEdit}
            dark={index % 2 !== 0}
            items={group.items}
          />
        ))}
      </div>
    );
  }
}

export default Menu;
