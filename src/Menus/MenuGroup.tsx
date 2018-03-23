import * as React from "react";
import CreateItem from "./CreateItem";
import { IItemToCreate } from "../Interfaces";

interface IProps {
  title: string;
  editable: boolean; // se esse item é editável
  canEdit: boolean; // se o usuário tem permissão
  loading: boolean;
  onDeleteGroup: (groupid: string) => void;
  onCreateItem: (
    groupid: string,
    item: IItemToCreate
  ) => void;
  dark: boolean;
  id: string;
}

class MenuGroup extends React.Component<IProps> {
  private renderCreateItem = () => {
    return (
      <div className="hero is-info">
        <div className="hero-body">
          <div className="container">
            <CreateItem
              groupid={this.props.id}
              grouptitle={this.props.title}
              loading={this.props.loading}
              onCreateItem={this.props.onCreateItem}
            />
          </div>
        </div>
      </div>
    );
  };

  private onDelete = () => {
    const ok = confirm("Excluir seção?");
    if (ok) {
      this.props.onDeleteGroup(this.props.id);
    }
  };

  render() {
    const cn = this.props.dark
      ? "hero is-dark"
      : "hero is-light";
    return (
      <>
        <div className={cn}>
          <div className="hero-body">
            <div className="container">
              <h2 className="title">{this.props.title}</h2>
              {this.props.children}
              {this.props.canEdit &&
                this.props.editable && (
                  <a
                    className="button is-danger"
                    onClick={this.onDelete}
                  >
                    EXCLUIR
                  </a>
                )}
            </div>
          </div>
        </div>
        {this.props.canEdit &&
          this.props.editable &&
          this.renderCreateItem()}
      </>
    );
  }
}

export default MenuGroup;
