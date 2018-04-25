import { AutoSubscribeStore } from "resub";
import { IMenuGroupDb } from "../Interfaces";
import DbStoreInject from "./DbStoreInject";

@AutoSubscribeStore
export class GroupStore extends DbStoreInject {
  public create = (title: string): Promise<void> => {
    const group: IMenuGroupDb = {
      title,
      priority: this.db().Now,
      items: []
    };

    return this.db().Group.Create(group);
  };
  public delete = async (id: string) => {
    const ok = confirm("Excluir seção?");

    if (ok) {
      this.st().RouterStore.reset();
      this.db().Group.Delete(id);
    }
  };
}

const store = new GroupStore();

export default store;
