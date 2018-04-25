import * as React from "react";
import { IMenuItem, IMenuItemContent } from "./Interfaces";
import PhotoItem from "./Viewer/PhotoItem";
import Login from "./Pages/Login";
import About from "./Pages/About";
import * as Strings from "./Strings";
import { ComponentBase } from "resub";
import RouterStore from "./Stores/RouterStore";

interface IState {
  showing: IMenuItem;
}

interface IProps extends React.Props<{}> {}

class Router extends ComponentBase<IProps, IState> {
  protected _buildState(p: IProps, i: boolean): IState {
    return {
      showing: RouterStore.getShowing()
    };
  }

  private renderAbout = () => {
    return <About Strings={Strings} />;
  };

  private renderLogin = () => {
    return <Login />;
  };

  private renderPhotoItem = (item: IMenuItemContent) => {
    return <PhotoItem item={item} />;
  };

  render() {
    if (this.state.showing.type === "default") {
      if (this.state.showing.payload === "about") {
        return this.renderAbout();
      }
      if (this.state.showing.payload === "login") {
        return this.renderLogin();
      }
    }
    if (this.state.showing.type === "content") {
      return this.renderPhotoItem(this.state.showing);
    }
    throw Error("Tipo de item não reconhecido");
  }
}

export default Router;
