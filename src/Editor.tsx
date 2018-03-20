import * as React from "react";
import Renderer from "./Renderer";
import { IPolygon, IPathPoint } from "./Interfaces";

const editingFill = { r: 255, g: 0, b: 0 };

class Editor extends React.Component<
  { polygons: IPolygon[] },
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
      <div>
        <Renderer
          height={210}
          width={500}
          onClickCreating={this.onClickCreating}
          editing={this.state.creating || this.state.saving}
          polygons={this.getPolygons()}
        />
        {this.renderEditorBar()}
      </div>
    );
  }
}

export default Editor;
