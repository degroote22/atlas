import * as React from "react";
import { IMenuItem, IMenuItemContent } from "./Interfaces";
import PhotoItem from "./Viewer/PhotoItem";
import Login from "./Pages/Login";
import About from "./Pages/About";

interface IProps {
  canEdit: boolean;
  openItem: IMenuItem;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  onSignout: () => void;
}

class Router extends React.Component<IProps> {
  private renderAbout = () => {
    return <About />;
  };

  private renderLogin = () => {
    return (
      <Login
        isLogged={this.props.canEdit}
        loading={this.props.loading}
        onLogin={this.props.onLogin}
        onSignout={this.props.onSignout}
      />
    );
  };

  private renderPhotoItem = (item: IMenuItemContent) => {
    return (
      <PhotoItem item={item} canEdit={this.props.canEdit} />
    );
  };

  render() {
    if (this.props.openItem.type === "default") {
      if (this.props.openItem.payload === "about") {
        return this.renderAbout();
      }
      if (this.props.openItem.payload === "login") {
        return this.renderLogin();
      }
    }
    if (this.props.openItem.type === "content") {
      return this.renderPhotoItem(this.props.openItem);
    }
    throw Error("Tipo de item não reconhecido");
  }
}

export default Router;
