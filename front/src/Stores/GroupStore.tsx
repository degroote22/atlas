import {
  StoreBase,
  AutoSubscribeStore
  // autoSubscribe
} from "resub";
import { IMenuGroupDb } from "../Interfaces";
import Firebase from "../Database/firebase";
import RouterStore from "./RouterStore";

@AutoSubscribeStore
class CreateGroupStore extends StoreBase {
  public create = (title: string): Promise<void> => {
    const group: IMenuGroupDb = {
      title,
      priority: new Date().getTime(),
      items: []
    };

    return new Promise((rs, rj) => {
      Firebase.database()
        .ref("/groups")
        .push(group)
        .then(rs, rj);
    }) as Promise<void>;
  };
  public delete = async (id: string) => {
    const ok = confirm("Excluir seção?");

    if (ok) {
      RouterStore.reset();
      Firebase.database()
        .ref("/groups")
        .child(id)
        .set(null);
    }
  };
}

const store = new CreateGroupStore();

export default store;
