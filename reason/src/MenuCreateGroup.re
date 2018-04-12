type state = {
  title: string,
  error: bool,
};

type action =
  | ChangeTitle(string)
  | ClearState
  | SetError
  | ClearError;

let component = ReasonReact.reducerComponent("MenuCreateGroup");

let initialState = {title: "", error: false};

let make = _children => {
  ...component,
  initialState: () => initialState,
  reducer: (action, state) =>
    switch (action) {
    | ChangeTitle(title) => ReasonReact.Update({...state, title})
    | ClearError => ReasonReact.Update({...state, error: false})
    | SetError => ReasonReact.Update({...state, error: true})
    | ClearState => ReasonReact.Update(initialState)
    },
  render: self => {
    let disabled = String.length(self.state.title) == 0;
    let onCreate = _ev =>
      if (! disabled) {
        self.send(ClearError);
        Js.log("Teste");
        /* Creators.createGroup(self.state.title); */
        ();
      };
    let input =
      <div className="control">
        <input
          onChange=(
            ev =>
              self.send(
                ChangeTitle(
                  ReactDOMRe.domElementToObj(ReactEventRe.Form.target(ev))##value,
                ),
              )
          )
          value=self.state.title
          className="input"
          _type="text"
          placeholder="Digite o nome"
        />
      </div>;
    let button =
      <div className="control">
        <button
          disabled=(Js.Boolean.to_js_boolean(disabled))
          className="button is-dark"
          onClick=onCreate>
          (ReasonReact.stringToElement("Criar"))
        </button>
      </div>;
    let error =
      self.state.error ?
        <div className="field has-addons">
          <p className="subtitle">
            (ReasonReact.stringToElement("Houve um erro no upload!"))
          </p>
        </div> :
        ReasonReact.nullElement;
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
            (ReasonReact.stringToElement({js|"Criar nova seção"|js}))
          </h1>
          <div className="field has-addons"> input button </div>
          error
        </div>
      </div>
    </section>;
  },
};