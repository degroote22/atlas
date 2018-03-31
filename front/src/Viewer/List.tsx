import * as React from "react";
import { IMenuItemContent, IPolygon } from "../Interfaces";
import * as ReactList from "react-list";

interface IProps {
  onChangeFocus: (id: string) => void;
  item: IMenuItemContent;
  focus: string;
  canEdit: boolean;
  onDelete: (id: string) => void;
  onEdit: (polygon: IPolygon) => void;
  height: number;
  width: number;
}

interface IPropsPolygonCard {
  onChangeFocus: (id: string) => void;
  polygon: IPolygon;
  focus: string;
  canEdit: boolean;
  onDelete: (id: string) => void;
  onEdit: (polygon: IPolygon) => void;
}

class PolygonCard extends React.Component<
  IPropsPolygonCard
> {
  private onEdit = () =>
    this.props.onEdit(this.props.polygon);
  private onDelete = () =>
    this.props.onDelete(this.props.polygon.id);

  private onClick = () =>
    this.props.onChangeFocus(this.props.polygon.id);
  render() {
    const polygon = this.props.polygon;
    const isFocused = polygon.id === this.props.focus;
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
            {this.props.canEdit && (
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

class List extends React.Component<IProps> {
  private list: ReactList | null = null;

  componentWillReceiveProps(np: IProps) {
    // if (this.props.focus !== np.focus) {
    const index = np.item.polygons.findIndex(
      x => x.id === np.focus
    );

    if (this.list) {
      this.list.scrollTo(index);
    }
    // }
  }

  private renderItem = (index: number, key: string) => {
    const polygon = this.props.item.polygons[index];
    return (
      <PolygonCard
        key={key}
        polygon={polygon}
        focus={this.props.focus}
        onChangeFocus={this.props.onChangeFocus}
        canEdit={this.props.canEdit}
        onDelete={this.props.onDelete}
        onEdit={this.props.onEdit}
      />
    );
  };

  render() {
    const polygons = this.props.item.polygons;
    return (
      <ReactList
        ref={ref => (this.list = ref)}
        itemRenderer={this.renderItem}
        length={polygons.length}
        type="simple"
      />
    );
    // return (
    //   <div>
    //     {polygons.map(polygon => {
    //       return (
    //         <PolygonCard
    //           key={polygon.id}
    //           polygon={polygon}
    //           focus={this.props.focus}
    //           onChangeFocus={this.props.onChangeFocus}
    //           canEdit={this.props.canEdit}
    //           onDelete={this.props.onDelete}
    //           onEdit={this.props.onEdit}
    //         />
    //       );
    //     })}
    //   </div>
    // );
  }
}

export default List;
