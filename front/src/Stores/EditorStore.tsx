import {
  StoreBase,
  AutoSubscribeStore
  // autoSubscribe
} from "resub";
import { IPolygon, IPolygonToCreate } from "../Interfaces";
import RouterStore from "./RouterStore";
import Firebase from "../Database/firebase";

type SetEditingFn = (polygon: IPolygon) => void;

@AutoSubscribeStore
class EditorStore extends StoreBase {
  private setEditingFn: SetEditingFn = (
    polygon: IPolygon
  ) => {};

  public deletePolygon(polygonid: string) {
    const openItem = RouterStore.getShowing();
    if (openItem.type === "content") {
      const groupid = openItem.groupid;
      const itemid = openItem.id;

      Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .child(itemid)
        .child("polygons")
        .child(polygonid)
        .set(null);
    } else {
      console.error(
        "O item aberto não corresponde a um polígono na hora de deletar"
      );
    }
  }

  public editPolygon(polygon: IPolygon) {
    const openItem = RouterStore.getShowing();
    if (openItem.type === "content") {
      const groupid = openItem.groupid;
      const itemid = openItem.id;

      const newPolygon = { ...polygon };
      delete newPolygon.id;

      Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .child(itemid)
        .child("polygons")
        .child(polygon.id)
        .set(newPolygon);
    } else {
      console.error(
        "O item aberto não corresponde a um polígono na hora de editar"
      );
    }
  }

  public createPolygon = (polygon: IPolygonToCreate) => {
    const openItem = RouterStore.getShowing();
    if (openItem.type === "content") {
      const groupid = openItem.groupid;
      const itemid = openItem.id;
      Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .child(itemid)
        .child("polygons")
        .push(polygon);
    } else {
      console.error(
        "O item aberto não corresponde a um polígono na hora de criar"
      );
    }
  };

  public registerSetEditing = (fn: SetEditingFn) => {
    this.setEditingFn = fn;
  };

  public setEditing = (polygon: IPolygon) => {
    this.setEditingFn(polygon);
  };
}

const store = new EditorStore();

export default store;
