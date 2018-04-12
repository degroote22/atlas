[%bs.raw {|require('./index.css')|}];

[%bs.raw {|require('../node_modules/bulma/css/bulma.css')|}];

/* [@bs.module "./registerServiceWorker"] external register_service_worker : unit => unit = "default"; */
ReactDOMRe.renderToElementWithId(<App />, "root");
/* register_service_worker(); */