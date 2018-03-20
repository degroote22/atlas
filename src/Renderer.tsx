import * as React from "react";
import Polygon from "./Polygon";
import { IPolygon } from "./Interfaces";

class Renderer extends React.Component<
  {
    polygons: IPolygon[];
    width: number;
    editing: boolean;
    height: number;
    onClickCreating?: (x: number, y: number) => void;
    onChangeFocus?: (id: string) => void;
  },
  { showing: string; clicked: string }
> {
  state = {
    showing: "",
    clicked: ""
  };

  private onChangeFocus = () => {
    if (!this.props.onChangeFocus) {
      return;
    }
    let id = "";
    if (this.state.clicked !== "") {
      id = this.state.clicked;
    }
    // O showing tem precedencia sobre o clicked
    if (this.state.showing !== "") {
      id = this.state.showing;
    }
    this.props.onChangeFocus(id);
  };

  private onMouseEnter = (id: string) => {
    this.setState({ showing: id }, this.onChangeFocus);
  };

  private onClick = (id: string) => {
    this.setState(state => {
      if (state.clicked === id) {
        return { showing: id, clicked: "" };
      }
      return { showing: id, clicked: id };
    }, this.onChangeFocus);
  };

  private onMouseLeave = (id: string) => {
    this.setState({ showing: "" }, this.onChangeFocus);
  };

  private onClickAnywhere = (
    ev: React.MouseEvent<SVGSVGElement>
  ) => {
    if (this.props.onClickCreating) {
      this.props.onClickCreating(ev.pageX, ev.pageY);
    }
  };

  private getHidden = (id: string) => {
    if (this.props.editing) {
      return false;
    }

    return (
      this.state.showing !== id && this.state.clicked !== id
    );
  };

  render() {
    return (
      <svg
        style={{ backgroundColor: "white" }}
        onClick={this.onClickAnywhere}
        height={this.props.height}
        width={this.props.width}
      >
        {this.props.polygons.map(polygon => (
          <Polygon
            key={polygon.id}
            {...polygon}
            editing={this.props.editing}
            hidden={this.getHidden(polygon.id)}
            onMouseEnter={this.onMouseEnter}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
          />
        ))}
      </svg>
    );
  }
}

export default Renderer;
