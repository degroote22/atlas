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

export interface IMenuGroup {
  title: string;
  editable: boolean;
  items: IMenuItem[];
}

export interface IPhotoItem extends IPolygon {
  title: string;
  description: string;
  url: string;
}

export type IMenuItem = IMenuItemContent | IMenuItemDefault;

export interface IMenuItemContent {
  type: "content";
  title: string;
  payload: IPhotoItem[];
}

export interface IMenuItemDefault {
  type: "default";
  title: string;
  payload: "about" | "login";
}
