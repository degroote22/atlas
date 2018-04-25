import Firebase from "./firebase";
import {
  IMenuGroupDb,
  IPolygon,
  IPolygonToCreate
} from "../Interfaces";

enum Paths {
  groups = "groups",
  items = "items",
  polygons = "polygons"
}

class Group {
  public static Create = (group: IMenuGroupDb) => {
    return new Promise((rs, rj) => {
      Firebase.database()
        .ref()
        .child(Paths.groups)
        .push(group)
        .then(rs, rj);
    }) as Promise<void>;
  };

  public static Delete = (id: string) => {
    Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(id)
      .set(null);
  };
}

class Polygon {
  public static Delete = (
    groupid: string,
    itemid: string,
    polygonid: string
  ) => {
    Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .child(itemid)
      .child(Paths.polygons)
      .child(polygonid)
      .set(null);
  };

  public static Edit = (
    groupid: string,
    itemid: string,
    polygon: IPolygon,
    newPolygon: IPolygon
  ) => {
    Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .child(itemid)
      .child(Paths.polygons)
      .child(polygon.id)
      .set(newPolygon);
  };

  public static Create = (
    groupid: string,
    itemid: string,
    polygon: IPolygonToCreate
  ) => {
    Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .child(itemid)
      .child(Paths.polygons)
      .push(polygon);
  };
}

class Item {
  public static Delete = (groupid: string, id: string) => {
    Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .child(id)
      .set(null);
  };

  public static Set = (
    groupid: string,
    key: string,
    newItem: {
      title: string;
      width: number;
      height: number;
      extension: string;
    }
  ) => {
    return Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .child(key)
      .set(newItem) as Promise<void>;
  };

  public static Push = <T extends {}>(
    groupid: string,
    payload?: T
  ) => {
    return Firebase.database()
      .ref()
      .child(Paths.groups)
      .child(groupid)
      .child(Paths.items)
      .push(payload) as Firebase.database.ThenableReference;
  };
}

class Storage {
  public static CreateImageRef = (filename: string) =>
    Firebase.storage()
      .ref()
      .child("images")
      .child(filename);

  public static TaskState = {
    PAUSED: Firebase.storage.TaskState.PAUSED,
    RUNNING: Firebase.storage.TaskState.RUNNING
  };
}

// console.log(Firebase);

class Database {
  public static Group = Group;
  public static Polygon = Polygon;
  public static Item = Item;
  public static Storage = Storage;
  public static Now = Firebase.database.ServerValue
    .TIMESTAMP;
}

export type IDb = typeof Database;

export default Database;
