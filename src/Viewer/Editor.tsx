import * as React from "react";
import Renderer from "./Renderer";
import { IPolygon, IPathPoint } from "../Interfaces";
import { EDITBAR_SIZE } from "./Constants";

const editingFill = { r: 255, g: 0, b: 0 };

class Editor extends React.Component<
  {
    polygons: IPolygon[];
    width: number;
    height: number;
    outerHeight: number;
    outerWidth: number;
  },
  {
    creating: boolean;
    saving: boolean;
    creatingPath: IPathPoint[];
    creatingName: string;
    creatingDescription: string;
  }
> {
  state = {
    creating: false,
    saving: false,
    creatingPath: [],
    creatingName: "",
    creatingDescription: ""
  };

  private onCreate = () => {
    this.setState({
      creating: true,
      saving: false,
      creatingPath: [],
      creatingName: "",
      creatingDescription: ""
    });
  };

  private onSave = () => {
    this.setState({
      saving: true,
      creating: false,
      creatingName: "",
      creatingDescription: ""
    });
  };

  private onCancel = () => {
    this.setState({
      creating: false,
      saving: false,
      creatingPath: [],
      creatingName: "",
      creatingDescription: ""
    });
  };

  private onConfirm = () => {
    console.log(this.state);
  };

  private onChangeName = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ creatingName: ev.target.value });
  };
  private onChangeDescription = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ creatingDescription: ev.target.value });
  };
  private renderEditorBar = () => {
    if (this.state.saving) {
      return (
        <div>
          Nome: <input onChange={this.onChangeName} />
          Descrição:{" "}
          <input onChange={this.onChangeDescription} />
          <button onClick={this.onConfirm}>
            CONFIRMAR
          </button>
          <button onClick={this.onCancel}>CANCELAR</button>
        </div>
      );
    }
    if (this.state.creating) {
      return (
        <div>
          Clique na foto para marcar os pontos do polígono.
          <button onClick={this.onSave}>SALVAR</button>
          <button onClick={this.onCancel}>CANCELAR</button>
        </div>
      );
    }
    return (
      <div>
        <button onClick={this.onCreate}>ADICIONAR</button>
      </div>
    );
  };

  private getPolygons = (): IPolygon[] => {
    const editingPoligon: IPolygon = {
      fill: editingFill,
      id: "editing",
      path: this.state.creatingPath
    };

    return this.state.creating || this.state.saving
      ? [editingPoligon]
      : this.props.polygons;
  };

  private onClickCreating = (x: number, y: number) => {
    if (!this.state.creating) {
      return;
    }
    this.setState(state => {
      const newPath: IPathPoint[] = [...state.creatingPath];
      newPath.push({ x, y });
      return {
        creatingPath: newPath
      };
    });
  };

  render() {
    // "200,10 250,190 160,210"
    return (
      <div style={{ position: "absolute" }}>
        <div style={{ height: EDITBAR_SIZE }}>
          {this.renderEditorBar()}
        </div>
        <div
          style={{
            display: "flex",
            width: this.props.outerWidth,
            height: this.props.outerHeight,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Renderer
            height={this.props.height}
            width={this.props.width}
            outerWidth={this.props.outerWidth}
            outerHeight={this.props.outerHeight}
            onClickCreating={this.onClickCreating}
            editing={
              this.state.creating || this.state.saving
            }
            polygons={this.getPolygons()}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
