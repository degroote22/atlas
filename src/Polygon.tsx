import * as React from "react";
import { IPathPoint, IPolygonToRender } from "./Interfaces";

interface IProps extends IPolygonToRender {
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
  onClick: (id: string) => void;
}

const makePath = (path: IPathPoint[]): string => {
  // Se espera uma string do tipo
  // "200,10 250,190 160,210"
  const points = path.map(p => `${p.x},${p.y}`);
  const joinedPath = points.join(" ");
  return joinedPath;
};

class Polygon extends React.Component<IProps, {}> {
  // Esses eventos são declarados aqui porque se eles forem declarados
  // 'inline' dentro do render há uma penalidade de performance.
  private onMouseEnter = () =>
    this.props.onMouseEnter(this.props.id);
  private onMouseLeave = () =>
    this.props.onMouseLeave(this.props.id);
  private onClick = () => this.props.onClick(this.props.id);

  private getFill = () => {
    if (this.props.hidden) {
      return "rgba(0, 0, 0, 0)";
    }
    const { fill } = this.props;
    return `rgba(${fill.r}, ${fill.g}, ${fill.b}, 0.1)`;
  };

  private getStroke = () => {
    // Se tiver escondido, zera o tamanho do stroke e ele some,
    // não precisa tratar aqui.
    const { fill } = this.props;

    return `rgba(${fill.r}, ${fill.g}, ${fill.b}, 1)`;
  };

  private getStrokeWidth = () =>
    this.props.hidden ? 0 : 2;

  render() {
    return (
      <polygon
        points={makePath(this.props.path)}
        fill={this.getFill()}
        stroke={this.getStroke()}
        strokeWidth={this.getStrokeWidth()}
        onMouseEnter={this.onMouseEnter}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}

export default Polygon;
