type groupToCreate = {
  title: string,
  priority: int,
  items: list(string),
};

/* type options = {
     apiKey: string,
     authDomain: string,
     databaseURL: string,
     storageBucket: string,
     projectId: string,
     messagingSenderId: string,
   }; */
let options = {
  "apiKey": "AIzaSyCzMEJQup5ZzXIYciT-hnMZ7tvvgGE70yk",
  "authDomain": "atlas-f41fc.firebaseapp.com",
  "databaseURL": "https://atlas-f41fc.firebaseio.com",
  "projectId": "atlas-f41fc",
  "storageBucket": "atlas-f41fc.appspot.com",
  "messagingSenderId": "503793581648",
};

let app = ReasonFirebase.initializeApp(options);

let db = ReasonFirebase.App.database(app);

let createGroup = title => {
  let group = {title, priority: Js.Math.floor(Js.Date.now()), items: []};
  Js.log(group);
  ReasonFirebase.Database.Reference.push(
    ReasonFirebase.Database.ref(db, ~path="groups", ()),
    ~value=group,
    ~onComplete=err => Js.log(err),
    (),
  );
  /* ReasonFirebase.Database.Reference.once(
       ReasonFirebase.Database.ref(db, ~path="ticket", ()),
       ~eventType="value",
       (),
     )
     |> Js.Promise.then_(teamDomain =>
          ReasonFirebase.Database.DataSnapshot.val_(teamDomain)
          |> (
            ticket =>
              parseTicket(ticket)
              |> (ticketJson => Js.log(ticketJson) |> Js.Promise.resolve)
          )
        ); */
  /* let myPromise = Js.Promise.make((~resolve, ~reject) => resolve(. 2)); */
  /* myPromise; */
};