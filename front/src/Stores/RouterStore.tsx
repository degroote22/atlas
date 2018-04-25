import {
  StoreBase,
  AutoSubscribeStore,
  autoSubscribe
} from "resub";
import { IMenuItem } from "../Interfaces";

export const DEFAULT_OPEN: IMenuItem = {
  title: "Sobre",
  type: "default",
  payload: "about",
  id: "any"
};

@AutoSubscribeStore
export class RouterStore extends StoreBase {
  private hidden = false;
  private showing: IMenuItem = DEFAULT_OPEN;

  public reset = () => {
    this.hidden = false;
    this.showing = DEFAULT_OPEN;
    this.trigger();
  };

  public openMenu = () => {
    this.hidden = false;
    this.trigger();
  };

  public closeMenu = () => {
    this.hidden = true;
    this.trigger();
  };

  public openMenuItem = (item: IMenuItem) => {
    this.showing = item;
    this.hidden = true;
    this.trigger();
  };

  @autoSubscribe
  getMenuHidden() {
    return this.hidden;
  }

  @autoSubscribe
  getShowing() {
    return this.showing;
  }
}

const store = new RouterStore();

export default store;
