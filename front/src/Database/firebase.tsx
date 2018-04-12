import * as Firebase from "firebase";

// var config_production = {
//   apiKey: "AIzaSyCzMEJQup5ZzXIYciT-hnMZ7tvvgGE70yk",
//   authDomain: "atlas-f41fc.firebaseapp.com",
//   databaseURL: "https://atlas-f41fc.firebaseio.com",
//   projectId: "atlas-f41fc",
//   storageBucket: "atlas-f41fc.appspot.com",
//   messagingSenderId: "503793581648"
// };

var config_staging = {
  apiKey: "AIzaSyD1zRGF4Ijz2ETtnW6zDtdEtBGATcucz4Q",
  authDomain: "atlas-staging2.firebaseapp.com",
  databaseURL: "https://atlas-staging2.firebaseio.com",
  projectId: "atlas-staging2",
  storageBucket: "atlas-staging2.appspot.com",
  messagingSenderId: "179336845950"
};
Firebase.initializeApp(config_staging);

export default Firebase;
