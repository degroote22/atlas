import { AutoSubscribeStore } from "resub";
import { IPolygon, IPolygonToCreate } from "../Interfaces";
import RouterStore from "./RouterStore";
import DbStoreInject from "./DbStoreInject";

type SetEditingFn = (polygon: IPolygon) => void;

@AutoSubscribeStore
class EditorStore extends DbStoreInject {
  private setEditingFn: SetEditingFn = (
    polygon: IPolygon
  ) => {};

  public deletePolygon(polygonid: string) {
    const openItem = RouterStore.getShowing();
    if (openItem.type === "content") {
      const groupid = openItem.groupid;
      const itemid = openItem.id;

      this.db().Polygon.Delete(groupid, itemid, polygonid);
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

      this.db().Polygon.Edit(
        groupid,
        itemid,
        polygon,
        newPolygon
      );
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
      this.db().Polygon.Create(groupid, itemid, polygon);
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
