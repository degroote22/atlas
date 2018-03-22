import * as React from "react";
import {
  IMenuItem,
  IMenuItemContent,
  IPolygonToCreate,
  IPolygon
} from "./Interfaces";
import PhotoItem from "./Viewer/PhotoItem";
import Login from "./Pages/Login";
import About from "./Pages/About";

interface IProps {
  canEdit: boolean;
  openItem: IMenuItem;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  onSignout: () => void;
  onCreatePolygon: (polygon: IPolygonToCreate) => void;
  onDeletePolygon: (id: string) => void;
  onEditPolygon: (polygon: IPolygon) => void;
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
      <PhotoItem
        item={item}
        canEdit={this.props.canEdit}
        onCreatePolygon={this.props.onCreatePolygon}
        onDeletePolygon={this.props.onDeletePolygon}
        onEditPolygon={this.props.onEditPolygon}
      />
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
