import {
  IMenuGroup,
  IMenuGroupDb,
  IItemToCreate,
  IPolygon
} from "./Interfaces";
import * as Firebase from "firebase";

var config = {
  apiKey: "AIzaSyCzMEJQup5ZzXIYciT-hnMZ7tvvgGE70yk",
  authDomain: "atlas-f41fc.firebaseapp.com",
  databaseURL: "https://atlas-f41fc.firebaseio.com",
  projectId: "atlas-f41fc",
  storageBucket: "atlas-f41fc.appspot.com",
  messagingSenderId: "503793581648"
};
Firebase.initializeApp(config);

type Update = () => void;

const getPolygons = (polygons: any): IPolygon[] => {
  console.log(polygons);
  if (polygons) {
    console.log("tem");
    return [];
  }
  console.log("nao tem ");
  return [];
};

const getItems = (items: any, groupid: string) => {
  return Object.keys(items).map(id => ({
    ...items[id],
    id,
    type: "content" as any,
    url: "",
    polygons: getPolygons(items[id].polygons) as IPolygon[],
    groupid
  }));
};

class Store {
  private update: Update;
  private user: Firebase.User | null = null;
  private menuGroups: IMenuGroup[] = [];
  private loading = false;

  public getItem = (id: string, groupid: string) => {
    const menu = this.menuGroups.find(
      x => x.id === groupid
    );

    if (!menu) {
      throw Error("Menu nao encontrado no getItem");
    }

    const item = menu.items.find(x => x.id === id);

    if (!item) {
      throw Error("Item nao encontrado");
    }
    return item;
  };

  private updateUrls = async () => {
    const promises = this.menuGroups.map(async group => {
      const _promises = group.items.map(item => {
        if (item.type !== "content") {
          throw Error(
            "Tipo de item nao reconhecido na geturl"
          );
        }
        const storage = Firebase.storage();
        const storageRef = storage
          .ref()
          .child("images")
          .child(item.id + "." + item.extension);

        const p = () =>
          storageRef.getDownloadURL().then(url => ({
            ...item,
            url
          }));

        // UGLYYYY HACK

        return p().catch(async err => {
          console.error(err, "retrying...");
          await new Promise((rs, rj) =>
            setTimeout(rs, 5000)
          );
          return p().catch(async err => {
            console.error(err, "retrying2...");
            await new Promise((rs, rj) =>
              setTimeout(rs, 5000)
            );
            return p();
          });
        });
      });

      const items = await Promise.all(_promises);

      return { ...group, items };
    });

    const newGroups = await Promise.all(promises);
    this.menuGroups = newGroups;
    this.update();
  };

  constructor(update: Update) {
    this.update = update;

    Firebase.database()
      .ref("/groups")
      .on("value", data => {
        if (data) {
          const x = data.val();
          if (!x) {
            console.error(
              "Não há dados do grupo, mas recebeu"
            );
            return;
          }

          const groups: IMenuGroup[] = Object.keys(
            x || {}
          ).map(id => {
            let item = x[id] as IMenuGroupDb;

            if (!item.items) {
              item.items = [];
            } else {
              item.items = getItems(item.items, id);
            }

            return {
              ...item,
              id,
              editable: true
            };
          });

          this.menuGroups = groups;

          this.update();

          this.updateUrls();
        } else {
          console.error("Nao há dados do grupo");
        }
      });

    if (Firebase.auth) {
      Firebase.auth().onIdTokenChanged(user => {
        this.onAuthStateChanged(user);
      });
    } else {
      throw Error(
        "Nao há instância do firebaseAuth na hora de registrar o CB"
      );
    }
  }

  private onAuthStateChanged = (
    user: Firebase.User | null
  ) => {
    this.user = user;
    this.loading = false;
    this.update();
    // if (user) {
    //   console.log("tá logando");
    // } else {
    //   console.log("tá deslogando");
    // }
  };

  public onCreateGroup = (title: string) => {
    const group: IMenuGroupDb = {
      title,
      priority: new Date().getTime(),
      items: []
    };

    Firebase.database()
      .ref("/groups")
      .push(group);
  };

  public getCanEdit = () => this.user !== null;

  public onLogin = (email: string, password: string) => {
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.error(err);
        // TODO
        alert("Usuário ou senha inválidos");
        this.loading = false;
        this.update();
      });

    this.loading = true;
    this.update();
  };

  public onSignout = () => {
    Firebase.auth().signOut();
  };

  public getMenuGroups = (): IMenuGroup[] =>
    this.menuGroups;

  public getLoading = () => this.loading;

  public onCreateItem = async (
    groupid: string,
    item: IItemToCreate
  ) => {
    // create the ref

    const nameSplit = item.file.name.split(".");
    const extension = nameSplit[nameSplit.length - 1];
    const res = await Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .push({
        title: item.title,
        width: item.width,
        height: item.height,
        extension
      });

    const key = res.key;

    const filename = key + "." + extension;
    const storageRef = Firebase.storage()
      .ref()
      .child("images");

    const imageRef = storageRef.child(filename);

    await imageRef.put(item.file);
  };

  // public updateMenuGroups = () => {
  //   this.update();
  // };
}

export default Store;
