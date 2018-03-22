import * as React from "react";
import Polygon from "./Polygon";
import { IPolygon } from "../Interfaces";
import {
  HERO_SIZE,
  EDITBAR_SIZE,
  EDITING_FILL,
  NOT_EDITING_FILL
} from "./Constants";
import colors from "./Colors";

interface IProps {
  polygons: IPolygon[];
  width: number;
  outerWidth: number;
  outerHeight: number;
  editing: boolean;
  height: number;
  onClickCreating?: (x: number, y: number) => void;
  onMoveCreating?: (x: number, y: number) => void;
  onChangeFocus?: (id: string) => void;
  onContextMenu?: () => void;
  vbw: number;
  vbh: number;
  src: string;
}

class Renderer extends React.Component<
  IProps,
  { showing: string; clicked: string; refresh: boolean }
> {
  state = {
    showing: "",
    clicked: "",
    refresh: false
  };

  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.src !== nextProps.src) {
      this.refreshPage();
    }
  }
  public setEditing = (polygon: IPolygon) => {
    // Só pro compilador ficar feliz e não dar erro de tipo
  };

  public changeFocus(id: string) {
    this.setState({
      clicked: id,
      showing: id
    });
  }

  private refreshPage = () => {
    const that = this;
    this.setState({ refresh: true }, () => {
      that.setState({ refresh: false });
    });
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

  private onMouseMove = (
    ev: React.MouseEvent<SVGSVGElement>
  ) => {
    if (this.props.onMoveCreating) {
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

      this.props.onMoveCreating(
        xpercent * this.props.vbw,
        ypercent * this.props.vbh
      );
    }
  };

  private onContextMenu = (
    ev: React.MouseEvent<SVGSVGElement>
  ) => {
    if (this.props.onContextMenu) {
      ev.preventDefault();
      // ev.stopPropagation()
      this.props.onContextMenu();
    }
  };

  render() {
    if (this.state.refresh) {
      return null;
    }
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
          onMouseMove={this.onMouseMove}
          onContextMenu={this.onContextMenu}
        >
          <image
            x={0}
            y={0}
            width={this.props.vbw}
            height={this.props.vbh}
            xlinkHref={this.props.src}
          />
          {this.props.polygons.map((polygon, index) => {
            let fill = colors[index % colors.length];
            if (this.props.editing) {
              // O que tá editando é sempre o último
              if (
                index ===
                this.props.polygons.length - 1
              ) {
                fill = EDITING_FILL;
              } else {
                fill = NOT_EDITING_FILL;
              }
            }
            return (
              <Polygon
                key={polygon.id}
                {...polygon}
                fill={fill}
                editing={this.props.editing}
                hidden={this.getHidden(polygon.id)}
                onMouseEnter={this.onMouseEnter}
                onClick={this.onClick}
                onMouseLeave={this.onMouseLeave}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // private newMethod(): ((event: ) => void) | undefined {
  //   return e => this.onMouseMove;
  // }
}

export default Renderer;
