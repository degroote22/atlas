import * as React from "react";
import { IMenuItem, IPhotoItem } from "./Interfaces";
import Editor from "./Editor";

interface IProps {
  canEdit: boolean;
  openItem: IMenuItem;
}

class Router extends React.Component<IProps> {
  private renderAbout = () => {
    return "about";
  };

  private renderLogin = () => {
    return "renderLogin";
  };

  private renderPhotoItem = (item: IPhotoItem[]) => {
    return (
      <Editor
        polygons={[
          {
            path: [
              { x: 200, y: 10 },
              { x: 250, y: 190 },
              { x: 160, y: 210 }
            ],
            fill: { r: 0, g: 255, b: 0 },
            id: "qualquer"
          }
        ]}
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
      return this.renderPhotoItem(
        this.props.openItem.payload
      );
    }
    throw Error("Tipo de item não reconhecido");
  }
}

export default Router;
