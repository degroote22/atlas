import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { unregister } from "./registerServiceWorker";
import "./index.css";
import "../node_modules/bulma/css/bulma.css";

ReactDOM.render(<App />, document.getElementById(
  "root"
) as HTMLElement);
unregister();
