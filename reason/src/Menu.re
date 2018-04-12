let component = ReasonReact.statelessComponent("Menu");

/* style={{
     height: "100%",
     position: "absolute",
     left: 0,
     top: 0,
     width: "100%",
     backgroundColor: "whitesmoke",
     zIndex: 555
   }} */
let make = (~onClose, _children) => {
  ...component,
  render: _self => {
    let style =
      ReactDOMRe.Style.make(
        ~height="100%",
        ~position="absolute",
        ~left="0",
        ~top="0",
        ~width="100%",
        ~backgroundColor="whitesmoke",
        ~zIndex="555",
        (),
      );
    <div style>
      <MenuBar menuStatus=Types.Opened title="Menu" onClick=onClose />
    </div>;
  },
};