import * as React from "react";
import { IPolygon } from "../Interfaces";
import { ComponentBase } from "resub";
import AuthStore from "../Stores/AuthStore";
import ViewerStore from "../Stores/ViewerStore";
import EditorStore from "../Stores/EditorStore";

interface IProps extends React.Props<{}> {
  polygon: IPolygon;
}

interface IState {
  focus: string;
  canEdit: boolean;
}

class PolygonCard extends ComponentBase<IProps, IState> {
  protected _buildState(p: IProps, i: boolean): IState {
    return {
      focus: ViewerStore.getFocus(),
      canEdit: AuthStore.getAdminLogged()
    };
  }

  private onEdit = () =>
    EditorStore.setEditing(this.props.polygon);

  private onDelete = () =>
    EditorStore.deletePolygon(this.props.polygon.id);

  private onClick = () =>
    ViewerStore.setFocus(this.props.polygon.id, false);

  render() {
    const polygon = this.props.polygon;
    const isFocused = polygon.id === this.state.focus;
    return (
      <div className="card">
        <header
          className="card-header"
          onClick={this.onClick}
          style={{ cursor: "pointer" }}
        >
          <p className="card-header-title">
            {polygon.title}
          </p>
        </header>
        {isFocused && (
          <>
            <div className="card-content">
              <div className="content">
                {polygon.description}
              </div>
            </div>
            {this.state.canEdit && (
              <footer className="card-footer">
                <a
                  onClick={this.onEdit}
                  className="card-footer-item"
                >
                  EDITAR
                </a>
                <a
                  onClick={this.onDelete}
                  className="card-footer-item"
                >
                  DELETAR
                </a>
              </footer>
            )}
          </>
        )}
      </div>
    );
  }
}

export default PolygonCard;
