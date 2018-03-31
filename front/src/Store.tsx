import {
  IMenuGroup,
  IMenuGroupDb,
  IItemToCreate,
  IPolygon,
  IPolygonToCreate,
  IMenuItemContent
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
  if (polygons) {
    return Object.keys(polygons || {}).map(id => ({
      ...polygons[id],
      id
    }));
  }
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

  public onDeletePolygon = (
    id: string,
    groupid: string,
    itemid: string
  ) => {
    Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .child(itemid)
      .child("polygons")
      .child(id)
      .set(null);
  };

  public onDeleteGroup = (groupid: string) => {
    Firebase.database()
      .ref("/groups")
      .child(groupid)
      .set(null);
  };

  public onDeleteItem = (
    groupid: string,
    itemid: string
  ) => {
    Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .child(itemid)
      .set(null);
  };

  public onEditPolygon = (
    polygon: IPolygon,
    groupid: string,
    itemid: string
  ) => {
    const newPolygon = { ...polygon };
    delete newPolygon.id;

    Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .child(itemid)
      .child("polygons")
      .child(polygon.id)
      .set(newPolygon);
  };

  public onCreatePolygon = (
    polygon: IPolygonToCreate,
    groupid: string,
    itemid: string
  ) => {
    Firebase.database()
      .ref("/groups")
      .child(groupid)
      .child("items")
      .child(itemid)
      .child("polygons")
      .push(polygon);
  };

  public onUrlError = (item: IMenuItemContent) => {
    if (item.type !== "content") {
      throw Error("Tipo de item nao reconhecido na geturl");
    }
    const storage = Firebase.storage();
    const storageRef = storage
      .ref()
      .child("images")
      .child("thumb_" + item.id + ".jpg");

    storageRef
      .getDownloadURL()
      .then(url => {
        if (item.type !== "content") {
          throw Error("item inválido");
        }
        // coloca a url no item
        const groupIndex = this.menuGroups.findIndex(
          x => x.id === item.groupid
        );
        if (groupIndex === -1) {
          throw Error("nao tem grupo");
        }
        const itemIndex = this.menuGroups[
          groupIndex
        ].items.findIndex(x => x.id === item.id);
        if (groupIndex === -1) {
          throw Error("nao tem item");
        }
        if (
          this.menuGroups[groupIndex].items[itemIndex]
            .type !== "content"
        ) {
          throw Error("item inválido 2");
        }
        (this.menuGroups[groupIndex].items[
          itemIndex
        ] as any).url = url;
        this.update();
      })
      .catch(err => {
        alert("Erro ao baixar foto. Atualize a página.");
        console.error(err);
        return { ...item, url: "" };
      });
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
          .child("thumb_" + item.id + ".jpg");

        const p = () =>
          storageRef
            .getDownloadURL()
            .then(url => ({
              ...item,
              url
            }))
            .catch(err => {
              // alert("Erro ao baixar foto de " + item.title);
              return { ...item, url: "" };
            });

        return p();
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
            this.menuGroups = [];
            this.update();
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

    return new Promise((rs, rj) => {
      Firebase.database()
        .ref("/groups")
        .push(group)
        .then(rs, rj);
    }) as Promise<void>;
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
    item: IItemToCreate,
    setState: any
  ) => {
    const setProgress = (x: number, extra?: string) => {
      const t = extra ? extra : "";
      const n = x > 99 ? 99 : x;
      setState({
        uploading: true,
        uploadingPercent: n + "% concluído. " + t,
        uploadingGroupid: groupid
      });
    };

    setProgress(0);

    try {
      const nameSplit = item.file.name.split(".");
      const extension = nameSplit[nameSplit.length - 1];
      const res = await Firebase.database()
        .ref("/groups")
        .child(groupid)
        .child("items")
        .push();

      const key = res.key;

      const filename = key + "." + extension;
      const storageRef = Firebase.storage()
        .ref()
        .child("images");

      const imageRef = storageRef.child(filename);

      const task = imageRef.put(item.file);

      return new Promise((rs, rj) => {
        task.on(
          "state_changed",
          function(snapshot: any) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = Math.floor(
              snapshot.bytesTransferred /
                snapshot.totalBytes *
                100
            );

            setProgress(progress);

            switch (snapshot.state) {
              case Firebase.storage.TaskState.PAUSED: // or 'paused'
                setProgress(progress, "Upload pausado");
                break;
              case Firebase.storage.TaskState.RUNNING: // or 'running'
                // setProgress(progress, 'Upload em andamento')
                break;
            }
          },
          function(error) {
            setState({
              uploading: true,
              uploadingPercent:
                "Houve um erro no upload da imagem"
            });
            throw error;
            // Handle unsuccessful uploads
          },
          function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            // var downloadURL = uploadTask.snapshot.downloadURL;
            Firebase.database()
              .ref("/groups")
              .child(groupid)
              .child("items")
              .child(key)
              .set({
                title: item.title,
                width: item.width,
                height: item.height,
                extension
              })
              .then(() => {
                setState({ uploading: false });
                rs();
              });
          }
        );
      }) as Promise<void>;
    } catch (err) {
      setState({
        uploading: true,
        uploadingPercent: "Houve um erro no upload"
      });
      console.error("Erro ao criar imagem");
      console.error(err);
      return Promise.reject(JSON.stringify(err));
    }
  };

  // public updateMenuGroups = () => {
  //   this.update();
  // };
}

export default Store;
