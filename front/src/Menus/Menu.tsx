import * as React from "react";
import MenuBar from "./MenuBar";
import MenuGroup from "./MenuGroup";
import MenuItem from "./MenuItem";
import {
  IMenuGroup,
  IMenuItem,
  IItemToCreate
} from "../Interfaces";
import CreateGroup from "./CreateGroup";

interface IProps {
  closeMenu: () => void;
  hidden: boolean;
  groups: IMenuGroup[];
  onMenuClick: (item: IMenuItem) => void;
  canEdit: boolean;
  loading: boolean;
  onCreateGroup: (title: string) => Promise<void>;
  onDeleteGroup: (groupid: string) => void;
  onCreateItem: (
    groupid: string,
    item: IItemToCreate
  ) => Promise<void>;
  uploading: boolean;
  uploadPercent: string;
  uploadingGroupid: string;
}

const groupsDefault: IMenuGroup[] = [
  {
    id: "@@@NAOUSADO",
    title: "Outros",
    editable: false,
    items: [
      {
        id: "@@@NAOUSADO1",
        title: "Fazer Login / Logout",
        type: "default",
        payload: "login"
      },
      {
        id: "@@@NAOUSADO2",
        title: "Sobre",
        type: "default",
        payload: "about"
      }
    ],
    priority: 0 // não eh usado
  }
];

class Menu extends React.Component<IProps> {
  private onMenuClick = (item: IMenuItem) => {
    this.props.onMenuClick(item);
  };

  private renderGroups = () => {
    const sortedGroups = [...this.props.groups];
    // TODO: SORT THEM

    const all = [...sortedGroups, ...groupsDefault];

    return all.map((group, index) => (
      <MenuGroup
        key={group.title}
        id={group.id}
        title={group.title}
        editable={group.editable}
        canEdit={this.props.canEdit}
        loading={this.props.loading}
        onCreateItem={this.props.onCreateItem}
        onDeleteGroup={this.props.onDeleteGroup}
        dark={index % 2 !== 0}
        uploading={this.props.uploading}
        uploadPercent={this.props.uploadPercent}
        uploadingGroupid={this.props.uploadingGroupid}
      >
        {group.items.map(item => (
          <MenuItem
            item={item}
            key={item.id}
            onClick={this.onMenuClick}
            dark={index % 2 !== 0}
          />
        ))}
      </MenuGroup>
    ));
  };

  private onCreateGroup = (title: string) => {
    return this.props.onCreateGroup(title);
  };
  private renderCreateGroup = () => (
    <CreateGroup
      loading={this.props.loading}
      onCreateGroup={this.onCreateGroup}
    />
  );

  render() {
    if (this.props.hidden) {
      return null;
    }
    return (
      <div
        style={{
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          backgroundColor: "whitesmoke",
          zIndex: 555
        }}
      >
        <MenuBar
          onClick={this.props.closeMenu}
          title={"Menu"}
          type="close"
        />
        {this.props.canEdit && this.renderCreateGroup()}
        {this.renderGroups()}
      </div>
    );
  }
}

export default Menu;
