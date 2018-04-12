import * as React from "react";
import CreateItem from "./CreateItem";
import GroupStore from "../Stores/GroupStore";
import { IMenuItem } from "../Interfaces";
import MenuItem from "./MenuItem";

interface IProps {
  title: string;
  editable: boolean; // se esse item é editável
  canEdit: boolean; // se o usuário tem permissão
  dark: boolean;
  id: string;
  items: IMenuItem[];
}

class MenuGroup extends React.Component<IProps> {
  private onDelete = () => {
    GroupStore.delete(this.props.id);
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
              {this.props.items.map(item => (
                <MenuItem
                  item={item}
                  key={item.id}
                  dark={this.props.dark}
                />
              ))}
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
          this.props.editable && (
            <CreateItem
              groupid={this.props.id}
              grouptitle={this.props.title}
            />
          )}
      </>
    );
  }
}

export default MenuGroup;
