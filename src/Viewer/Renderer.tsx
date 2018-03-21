import * as React from "react";
import Polygon from "./Polygon";
import { IPolygon } from "../Interfaces";
import { HERO_SIZE, EDITBAR_SIZE } from "./Constants";

class Renderer extends React.Component<
  {
    polygons: IPolygon[];
    width: number;
    outerWidth: number;
    outerHeight: number;
    editing: boolean;
    height: number;
    onClickCreating?: (x: number, y: number) => void;
    onChangeFocus?: (id: string) => void;
    vbw: number;
    vbh: number;
    src: string;
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
      const x =
        ev.pageX -
        (this.props.outerWidth - this.props.width) / 2;

      const y =
        ev.pageY -
        HERO_SIZE -
        EDITBAR_SIZE -
        (this.props.outerHeight - this.props.height) / 2;

      const xpercent = x / this.props.width;
      const ypercent = y / this.props.height;

      this.props.onClickCreating(
        xpercent * this.props.vbw,
        ypercent * this.props.vbh
      );
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
      <div
        style={{
          display: "flex",
          width: this.props.outerWidth,
          height: this.props.outerHeight,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute"
        }}
      >
        <svg
          onClick={this.onClickAnywhere}
          height={this.props.height}
          width={this.props.width}
          viewBox={`0 0 ${this.props.vbw} ${
            this.props.vbh
          }`}
        >
          <image
            x={0}
            y={0}
            width={this.props.vbw}
            height={this.props.vbh}
            xlinkHref={this.props.src}
          />
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
      </div>
    );
  }
}

export default Renderer;
