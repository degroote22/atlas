export interface IPathPoint {
  x: number;
  y: number;
}

export interface IRgb {
  r: number;
  g: number;
  b: number;
}

export type IPath = IPathPoint[];

export interface IPolygonToCreate {
  paths: IPath[];
  description: string;
  title: string;
}

export interface IPolygon extends IPolygonToCreate {
  id: string;
}

export interface IPolygonToRender extends IPolygon {
  editing: boolean;
  hidden: boolean;
  fill: IRgb;
}

export interface IMenuGroupDb {
  title: string;
  priority:
    | number
    | typeof firebase.database.ServerValue.TIMESTAMP;
  items: IMenuItem[];
}

export interface IMenuGroup extends IMenuGroupDb {
  editable: boolean;
  id: string;
  items: IMenuItem[];
}

export interface IItemToCreate {
  width: number;
  height: number;
  title: string;
  file: File;
}

export interface IPhotoItem {
  extension: string;
  width: number;
  height: number;
  polygons: IPolygon[];
}

export type IMenuItem = IMenuItemContent | IMenuItemDefault;

export interface IMenuItemDb extends IPhotoItem {
  id: string;
  title: string;
}

export interface IMenuItemContent extends IMenuItemDb {
  type: "content";
  url: string;
  groupid: string;
}

export interface IMenuItemDefault {
  id: string;
  type: "default";
  title: string;
  payload: "about" | "login";
}
