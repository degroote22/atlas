import * as React from "react";
import Menu from "./Menus/Menu";
import Router from "./Router";
import GroupStore from "./Stores/GroupStore";
import Database from "./Database";
import RouterStore from "./Stores/RouterStore";

export const Stores = {
  RouterStore
};

export type IStores = typeof Stores;

class App extends React.Component {
  private initStores() {
    GroupStore.init(Database, Stores);
  }

  constructor(p: React.Props<{}>) {
    super(p);
    this.initStores();
  }
  render() {
    return (
      <>
        <Menu />
        <Router />
      </>
    );
  }
}

export default App;
