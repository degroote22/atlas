import {
  StoreBase,
  AutoSubscribeStore,
  autoSubscribe
} from "resub";

type ScrollTo = (focus: string) => void;
@AutoSubscribeStore
export class ViewerStore extends StoreBase {
  private focus = "";
  private scrollTo: ScrollTo = (f: string) => {};

  public registerListScrollTo(fn: ScrollTo) {
    this.scrollTo = fn;
  }

  public setFocus(id: string, forceListScrollTo: boolean) {
    this.focus = id;
    this.trigger();
    if (forceListScrollTo) {
      this.scrollTo(id);
    }
  }

  @autoSubscribe
  public getFocus() {
    return this.focus;
  }
}

const store = new ViewerStore();

export default store;
