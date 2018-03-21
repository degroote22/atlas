export interface IPathPoint {
  x: number;
  y: number;
}

export interface IRgb {
  r: number;
  g: number;
  b: number;
}

export interface IPolygon {
  id: string;
  path: IPathPoint[];
  fill: IRgb;
}

export interface IPolygonToRender extends IPolygon {
  editing: boolean;
  hidden: boolean;
}

export interface IMenuGroupDb {
  title: string;
  priority: number;
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
