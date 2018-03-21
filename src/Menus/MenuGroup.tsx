import * as React from "react";
import CreateItem from "./CreateItem";
import { IItemToCreate } from "../Interfaces";

interface IProps {
  title: string;
  editable: boolean; // se esse item é editável
  canEdit: boolean; // se o usuário tem permissão
  loading: boolean;
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
      <CreateItem
        groupid={this.props.id}
        grouptitle={this.props.title}
        loading={this.props.loading}
        onCreateItem={this.props.onCreateItem}
      />
    );
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
            </div>
          </div>
        </div>
        {this.props.canEdit &&
          this.props.editable && (
            <div className="hero is-info">
              <div className="hero-body">
                <div className="container">
                  {this.renderCreateItem()}
                </div>
              </div>
            </div>
          )}
      </>
    );
  }
}

export default MenuGroup;
