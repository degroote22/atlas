import * as React from "react";
import Renderer from "./Renderer";
import {
  IPolygon,
  IPathPoint,
  IPolygonToCreate
} from "../Interfaces";
import {
  EDITBAR_SIZE,
  HERO_SIZE,
  EDITBAR_BACKGROUND,
  CARD_MARGIN
} from "./Constants";

class Editor extends React.Component<
  {
    polygons: IPolygon[];
    width: number;
    height: number;
    outerHeight: number;
    outerWidth: number;
    vbw: number;
    vbh: number;
    src: string;
    onCreatePolygon: (polygon: IPolygonToCreate) => void;
    onEditPolygon: (polygon: IPolygon) => void;
    onChangeFocus: (id: string) => void;
    onDeleteItem: () => void;
  },
  {
    editing: boolean;
    editingId: string;
    creating: boolean;
    saving: boolean;
    creatingPath: IPathPoint[];
    creatingName: string;
    creatingDescription: string;
    mouseCoordinate: IPathPoint;
    paths: IPathPoint[][];
  }
> {
  state = {
    editing: false,
    editingId: "",
    creating: false,
    saving: false,
    creatingPath: [],
    creatingName: "",
    creatingDescription: "",
    mouseCoordinate: { x: 0, y: 0 },
    paths: []
  };

  public setEditing = (polygon: IPolygon) => {
    this.setState({
      editing: true,
      creating: true,
      saving: true,
      paths: polygon.paths,
      creatingName: polygon.title,
      creatingDescription: polygon.description,
      editingId: polygon.id
    });
  };

  private renderer: Renderer | null = null;

  private onCreate = () => {
    this.setState(state => {
      return {
        creating: true,
        saving: false
      };
    });
  };

  private onSave = () => {
    this.setState(state => ({
      saving: true,
      creating: false,
      creatingPath: [],
      paths: [...state.paths, state.creatingPath]
    }));
  };

  private onCancel = () => {
    this.setState({
      editing: false,
      creating: false,
      saving: false,
      creatingPath: [],
      creatingName: "",
      creatingDescription: "",
      paths: []
    });
  };

  private onConfirm = () => {
    if (this.state.editing) {
      this.props.onEditPolygon({
        id: this.state.editingId,
        paths: this.state.paths,
        description: this.state.creatingDescription,
        title: this.state.creatingName
      });
    } else {
      this.props.onCreatePolygon({
        paths: this.state.paths,
        description: this.state.creatingDescription,
        title: this.state.creatingName
      });
    }
    this.setState({
      editing: false
    });
  };

  private onChangeName = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ creatingName: ev.target.value });
  };

  private onChangeDescription = (
    ev: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({ creatingDescription: ev.target.value });
  };

  public changeFocus = (id: string) => {
    if (this.renderer) {
      this.renderer.changeFocus(id);
    }
  };

  private renderEditorBar = () => {
    if (this.state.saving) {
      return (
        <div
          style={{
            position: "absolute",
            zIndex: 5,
            backgroundColor: EDITBAR_BACKGROUND,
            left: 0,
            padding: 12,
            width: "100vw"
          }}
        >
          <div className="field">
            <label className="label has-text-light">
              Nome
            </label>
            <div
              className="control"
              style={{ maxWidth: 512 }}
            >
              <input
                className="input"
                onChange={this.onChangeName}
                type="text"
                placeholder="Nome da marcação"
                value={this.state.creatingName}
              />
            </div>
          </div>
          <div className="field">
            <label className="label has-text-light">
              Descrição
            </label>
            <div
              className="control"
              style={{ maxWidth: 512 }}
            >
              <textarea
                onChange={this.onChangeDescription}
                className="textarea"
                placeholder="Texto de descrição"
                value={this.state.creatingDescription}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                onClick={this.onConfirm}
                className="button is-light"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                onClick={this.onCancel}
                className="button is-light"
              >
                CANCELAR
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                onClick={this.onCreate}
                className="button is-light"
              >
                CRIAR OUTRA MARCAÇÃO
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.creating) {
      return (
        <>
          <a
            className="button is-light"
            onClick={this.onSave}
            style={{ marginRight: 6 }}
          >
            SALVAR
          </a>
          <a
            className="button is-light"
            onClick={this.onCancel}
          >
            CANCELAR
          </a>
        </>
      );
    }

    return (
      <>
        <a
          onClick={this.onCreate}
          className="button is-light"
        >
          ADICIONAR
        </a>
        <a
          onClick={this.onDelete}
          style={{ marginLeft: CARD_MARGIN }}
          className="button is-light"
        >
          EXCLUIR FOTO
        </a>
      </>
    );
  };

  private onDelete = () => {
    const ok = confirm("Excluir item?");
    if (ok) {
      this.props.onDeleteItem();
    }
  };

  private getPolygons = (): IPolygon[] => {
    const editingPoligon: IPolygon = {
      id: "editing",
      paths: [...this.state.paths, this.state.creatingPath],
      description: this.state.creatingDescription,
      title: this.state.creatingName
    };

    if (this.state.creating || this.state.saving) {
      if (this.state.saving) {
        return [...this.props.polygons, editingPoligon];
      } else {
        // se tá editando, sempre mostra a posição do mouse
        const newEditignPolygon = { ...editingPoligon };

        let newEditingPolygonPaths = [
          ...newEditignPolygon.paths
        ];

        let newLastPath = [
          ...newEditingPolygonPaths[
            newEditingPolygonPaths.length - 1
          ]
        ];

        newEditingPolygonPaths.splice(-1, 1);

        newLastPath.push({
          x: this.state.mouseCoordinate.x,
          y: this.state.mouseCoordinate.y
        });

        newEditingPolygonPaths = [
          ...newEditingPolygonPaths,
          newLastPath
        ];

        newEditignPolygon.paths = newEditingPolygonPaths;

        return [...this.props.polygons, newEditignPolygon];
      }
    }
    return this.props.polygons;
  };

  private onMoveCreating = (x: number, y: number) => {
    if (!this.state.creating || this.state.saving) {
      return;
    }
    this.setState(state => ({
      mouseCoordinate: { x, y }
    }));
  };

  private onClickCreating = (x: number, y: number) => {
    if (!this.state.creating || this.state.saving) {
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

  private onContextMenu = () => {
    if (!this.state.creating || this.state.saving) {
      return;
    }

    this.setState(state => {
      const newPath = [...state.creatingPath];
      newPath.splice(-1, 1); // remove o último
      return {
        creatingPath: newPath
      };
    });
  };
  render() {
    // "200,10 250,190 160,210"
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: HERO_SIZE
        }}
      >
        <div
          style={{
            height: EDITBAR_SIZE,
            width: "100vw",
            backgroundColor: EDITBAR_BACKGROUND,
            padding: 6
          }}
        >
          {this.renderEditorBar()}
        </div>
        <Renderer
          ref={ref => (this.renderer = ref)}
          vbw={this.props.vbw}
          vbh={this.props.vbh}
          height={this.props.height}
          width={this.props.width}
          outerWidth={this.props.outerWidth}
          outerHeight={this.props.outerHeight}
          onClickCreating={this.onClickCreating}
          onMoveCreating={this.onMoveCreating}
          onContextMenu={this.onContextMenu}
          editing={this.state.creating || this.state.saving}
          polygons={this.getPolygons()}
          src={this.props.src}
          onChangeFocus={this.props.onChangeFocus}
        />
      </div>
    );
  }
}

export default Editor;
