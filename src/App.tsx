import * as React from "react";
import MenuBar from "./Menus/MenuBar";
import Menu from "./Menus/Menu";
import * as Strings from "./Strings";
import { IMenuItem, IItemToCreate } from "./Interfaces";
import Router from "./Router";
import Store from "./Store";
interface IState {
  // width: number;
  // height: number;
  menuHidden: boolean;
  openItem: IMenuItem;
}

class App extends React.Component<{}, IState> {
  private update = () => {
    this.setState((s: any) => {
      if (s.openItem.type === "content") {
        return {
          openItem: this.store.getItem(
            s.openItem.id,
            s.openItem.groupid
          )
        };
      }
      return s;
    });
    this.forceUpdate();
  };

  store = new Store(this.update);

  state = {
    // width: 0,
    // height: 0,
    menuHidden: false,
    openItem: {
      title: "Sobre",
      type: "default",
      payload: "about"
    } as IMenuItem
  };

  private openMenu = () => {
    this.setState({ menuHidden: false });
  };

  private closeMenu = () => {
    this.setState({ menuHidden: true });
  };

  private getMenuGroups = () => {
    return this.store.getMenuGroups();
  };

  private onMenuClick = (item: IMenuItem) => {
    this.setState({ menuHidden: true, openItem: item });
  };

  private onLogin = (email: string, password: string) => {
    this.store.onLogin(email, password);
  };

  private onSignout = () => {
    this.store.onSignout();
  };

  private getLoading = () => {
    return this.store.getLoading();
  };

  private onCreateGroup = (title: string) => {
    this.store.onCreateGroup(title);
  };

  private onCreateItem = (
    groupid: string,
    payload: IItemToCreate
  ) => {
    this.store.onCreateItem(groupid, payload);
  };

  private getCanEdit = () => {
    return this.store.getCanEdit();
  };

  render() {
    return (
      <>
        <Menu
          hidden={this.state.menuHidden}
          closeMenu={this.closeMenu}
          groups={this.getMenuGroups()}
          onMenuClick={this.onMenuClick}
          canEdit={this.getCanEdit()}
          loading={this.getLoading()}
          onCreateGroup={this.onCreateGroup}
          onCreateItem={this.onCreateItem}
        />
        <MenuBar
          onClick={this.openMenu}
          title={Strings.Title}
          type="open"
        />
        <Router
          onSignout={this.onSignout}
          canEdit={this.getCanEdit()}
          openItem={this.state.openItem}
          onLogin={this.onLogin}
          loading={this.getLoading()}
        />
      </>
    );
  }
}

export default App;
