import * as React from "react";
import MenuBar from "./Menus/MenuBar";
import Menu from "./Menus/Menu";
import * as Strings from "./Strings";
import {
  IMenuItem,
  IItemToCreate,
  IPolygonToCreate,
  IPolygon,
  IMenuItemContent
} from "./Interfaces";
import Router from "./Router";
import Store from "./Store";
interface IState {
  // width: number;
  // height: number;
  menuHidden: boolean;
  openItem: IMenuItem;
  uploading: boolean;
  uploadingPercent: string;
  uploadingGroupid: string;
}

const DEFAULT_OPEN = {
  title: "Sobre",
  type: "default",
  payload: "about"
};

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
    openItem: DEFAULT_OPEN as IMenuItem,
    uploading: false,
    uploadingPercent: "",
    uploadingGroupid: ""
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
    return this.store.onCreateGroup(title);
  };

  private onCreateItem = (
    groupid: string,
    payload: IItemToCreate
  ) => {
    return this.store.onCreateItem(
      groupid,
      payload,
      this.setState.bind(this)
    );
  };

  private getCanEdit = () => {
    return this.store.getCanEdit();
  };

  private onCreatePolygon = (polygon: IPolygonToCreate) => {
    if (this.state.openItem.type === "content") {
      const groupid = this.state.openItem.groupid;
      const itemid = this.state.openItem.id;
      this.store.onCreatePolygon(polygon, groupid, itemid);
    }
  };

  private onDeletePolygon = (id: string) => {
    if (this.state.openItem.type === "content") {
      const groupid = this.state.openItem.groupid;
      const itemid = this.state.openItem.id;
      this.store.onDeletePolygon(id, groupid, itemid);
    }
  };

  private onEditPolygon = (polygon: IPolygon) => {
    if (this.state.openItem.type === "content") {
      const groupid = this.state.openItem.groupid;
      const itemid = this.state.openItem.id;
      this.store.onEditPolygon(polygon, groupid, itemid);
    }
  };

  private onDeleteItem = (
    groupid: string,
    itemid: string
  ) => {
    this.setState(
      {
        openItem: DEFAULT_OPEN as IMenuItem,
        menuHidden: false
      },
      () => {
        this.store.onDeleteItem(groupid, itemid);
      }
    );
  };

  private onUrlError = (item: IMenuItemContent) => {
    this.store.onUrlError(item);
  };

  private onDeleteGroup = (groupid: string) => {
    this.setState(
      {
        openItem: DEFAULT_OPEN as IMenuItem,
        menuHidden: false
      },
      () => {
        this.store.onDeleteGroup(groupid);
      }
    );
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
          onDeleteGroup={this.onDeleteGroup}
          uploading={this.state.uploading}
          uploadPercent={this.state.uploadingPercent}
          uploadingGroupid={this.state.uploadingGroupid}
        />
        <MenuBar
          onClick={this.openMenu}
          title={Strings.Title}
          type="open"
        />
        {this.state.menuHidden && (
          <Router
            onSignout={this.onSignout}
            canEdit={this.getCanEdit()}
            openItem={this.state.openItem}
            onLogin={this.onLogin}
            loading={this.getLoading()}
            onCreatePolygon={this.onCreatePolygon}
            onDeletePolygon={this.onDeletePolygon}
            onEditPolygon={this.onEditPolygon}
            onDeleteItem={this.onDeleteItem}
            onUrlError={this.onUrlError}
          />
        )}
      </>
    );
  }
}

export default App;