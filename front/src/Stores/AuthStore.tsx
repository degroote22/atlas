import {
  StoreBase,
  AutoSubscribeStore,
  autoSubscribe
} from "resub";
import Firebase from "../Database/firebase";

@AutoSubscribeStore
class AuthStore extends StoreBase {
  constructor() {
    super();
    this.registerAuthHandler();
  }

  private loading = false;
  private user: Firebase.User | null = null;

  @autoSubscribe
  public getUser() {
    return this.user;
  }

  @autoSubscribe
  public getLoading() {
    return this.loading;
  }

  // private logged = false;

  @autoSubscribe
  public getAdminLogged() {
    return !!this.user;
    // return this.logged;
  }

  private registerAuthHandler = () => {
    if (Firebase.auth) {
      Firebase.auth().onIdTokenChanged(user => {
        this.onAuthStateChanged(user);
      });
    } else {
      throw Error(
        "Nao há instância do firebaseAuth na hora de registrar o CB"
      );
    }
  };

  private onAuthStateChanged = (
    user: Firebase.User | null
  ) => {
    this.user = user;
    this.loading = false;
    this.trigger();
    // if (user) {
    //   console.log("tá logando");
    // } else {
    //   console.log("tá deslogando");
    // }
  };

  public signIn = (email: string, password: string) => {
    this.loading = true;
    this.trigger();

    return Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.error(err);
        // TODO
        alert("Usuário ou senha inválidos");
        this.loading = false;
        this.trigger();
      });
  };

  public signOff = () => {
    return Firebase.auth().signOut();
  };
}

const store = new AuthStore();

export default store;
