type state = {menuStatus: Types.menuStatus};

type action =
  | OpenMenu
  | CloseMenu;

let component = ReasonReact.reducerComponent("App");

let make = _children => {
  ...component,
  initialState: () => {menuStatus: Opened},
  reducer: (action, _state) =>
    switch (action) {
    | OpenMenu => ReasonReact.Update({menuStatus: Opened})
    | CloseMenu => ReasonReact.Update({menuStatus: Closed})
    },
  render: self => {
    let menu =
      self.state.menuStatus == Types.Opened ?
        <Menu onClose=(_ev => self.send(CloseMenu)) key="menu" /> :
        ReasonReact.nullElement;
    ReasonReact.arrayToElement([|
      menu,
      <MenuBar
        key="menubar"
        menuStatus=self.state.menuStatus
        title=Strings.title
        onClick=(
          ev => ev == Open ? self.send(OpenMenu) : self.send(CloseMenu)
        )
      />,
    |]);
  },
};