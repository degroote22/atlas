import * as React from "react";
import MenuBar from "./Menus/MenuBar";
import Menu from "./Menus/Menu";
import * as Strings from "./Strings";
import { IMenuItem } from "./Interfaces";
import Router from "./Router";

interface IState {
  width: number;
  height: number;
  menuHidden: boolean;
  canEdit: boolean;
  openItem: IMenuItem;
}

class App extends React.Component<{}, IState> {
  state = {
    width: 0,
    height: 0,
    menuHidden: false,
    canEdit: false,
    openItem: {
      title: "Sobre",
      type: "default",
      payload: "about"
    } as IMenuItem
  };

  private openMenu = () =>
    this.setState({ menuHidden: false });
  private closeMenu = () =>
    this.setState({ menuHidden: true });

  private getMenuGroups = () => {
    return [];
  };

  private onMenuClick = (item: IMenuItem) => {
    this.setState({ menuHidden: true, openItem: item });
  };

  render() {
    return (
      <>
        <Menu
          hidden={this.state.menuHidden}
          closeMenu={this.closeMenu}
          groups={this.getMenuGroups()}
          onMenuClick={this.onMenuClick}
          canEdit={this.state.canEdit}
        />
        <MenuBar
          onClick={this.openMenu}
          title={Strings.Title}
          type="open"
        />
        <Router
          canEdit={this.state.canEdit}
          openItem={this.state.openItem}
        />
      </>
    );
  }
}

export default App;
