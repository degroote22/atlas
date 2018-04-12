type action =
  | Open
  | Close;

let component = ReasonReact.statelessComponent("MenuBar");

let make = (~menuStatus, ~title, ~onClick, _children) => {
  let click = _event =>
    menuStatus == Types.Opened ? onClick(Close) : onClick(Open);
  {
    ...component,
    render: _self => {
      let cn = menuStatus == Opened ? "hero is-dark is-bold" : "hero is-dark";
      <div className=cn>
        <div className="hero-body">
          <div className="container">
            <nav className="media">
              <p className="media-left">
                <a onClick=click className="button is-light">
                  <MenuIcon status=menuStatus />
                </a>
              </p>
              <p className="media-content title">
                (ReasonReact.stringToElement(title))
              </p>
            </nav>
          </div>
        </div>
      </div>;
    },
  };
};