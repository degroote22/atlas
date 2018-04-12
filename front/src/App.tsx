import * as React from "react";
import Menu from "./Menus/Menu";
import Router from "./Router";

class App extends React.Component {
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
