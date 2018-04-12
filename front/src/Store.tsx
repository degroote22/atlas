// import {
//   IMenuGroup,
//   IMenuGroupDb,
//   IPolygon,
//   IPolygonToCreate,
//   IMenuItemContent
// } from "./Interfaces";
// import Firebase from "./Database/firebase";

// type Update = () => void;

// // const getPolygons = (polygons: any): IPolygon[] => {
// //   if (polygons) {
// //     return Object.keys(polygons || {}).map(id => ({
// //       ...polygons[id],
// //       id
// //     }));
// //   }
// //   return [];
// // };

// // const getItems = (items: any, groupid: string) => {
// //   return Object.keys(items).map(id => ({
// //     ...items[id],
// //     id,
// //     type: "content" as any,
// //     url: "",
// //     polygons: getPolygons(items[id].polygons) as IPolygon[],
// //     groupid
// //   }));
// // };

// class Store {
//   private update: Update = () => {};
//   // private menuGroups: IMenuGroup[] = [];
//   private loading = false;

//   // public getItem = (id: string, groupid: string) => {
//   //   const menu = this.menuGroups.find(
//   //     x => x.id === groupid
//   //   );

//   //   if (!menu) {
//   //     throw Error("Menu nao encontrado no getItem");
//   //   }

//   //   const item = menu.items.find(x => x.id === id);

//   //   if (!item) {
//   //     throw Error("Item nao encontrado");
//   //   }
//   //   return item;
//   // };

//   // public onDeletePolygon = (
//   //   id: string,
//   //   groupid: string,
//   //   itemid: string
//   // ) => {
//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .child(groupid)
//   //     .child("items")
//   //     .child(itemid)
//   //     .child("polygons")
//   //     .child(id)
//   //     .set(null);
//   // };

//   // public onDeleteGroup = (groupid: string) => {
//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .child(groupid)
//   //     .set(null);
//   // };

//   // public onDeleteItem = (
//   //   groupid: string,
//   //   itemid: string
//   // ) => {
//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .child(groupid)
//   //     .child("items")
//   //     .child(itemid)
//   //     .set(null);
//   // };

//   // public onEditPolygon = (
//   //   polygon: IPolygon,
//   //   groupid: string,
//   //   itemid: string
//   // ) => {
//   //   const newPolygon = { ...polygon };
//   //   delete newPolygon.id;

//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .child(groupid)
//   //     .child("items")
//   //     .child(itemid)
//   //     .child("polygons")
//   //     .child(polygon.id)
//   //     .set(newPolygon);
//   // };

//   // public onCreatePolygon = (
//   //   polygon: IPolygonToCreate,
//   //   groupid: string,
//   //   itemid: string
//   // ) => {
//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .child(groupid)
//   //     .child("items")
//   //     .child(itemid)
//   //     .child("polygons")
//   //     .push(polygon);
//   // };

//   // public onUrlError = (item: IMenuItemContent) => {
//   //   if (item.type !== "content") {
//   //     throw Error("Tipo de item nao reconhecido na geturl");
//   //   }
//   //   const storage = Firebase.storage();
//   //   const storageRef = storage
//   //     .ref()
//   //     .child("images")
//   //     .child("thumb_" + item.id + ".jpg");

//   //   storageRef
//   //     .getDownloadURL()
//   //     .then(url => {
//   //       if (item.type !== "content") {
//   //         throw Error("item inválido");
//   //       }
//   //       // coloca a url no item
//   //       const groupIndex = this.menuGroups.findIndex(
//   //         x => x.id === item.groupid
//   //       );
//   //       if (groupIndex === -1) {
//   //         throw Error("nao tem grupo");
//   //       }
//   //       const itemIndex = this.menuGroups[
//   //         groupIndex
//   //       ].items.findIndex(x => x.id === item.id);
//   //       if (groupIndex === -1) {
//   //         throw Error("nao tem item");
//   //       }
//   //       if (
//   //         this.menuGroups[groupIndex].items[itemIndex]
//   //           .type !== "content"
//   //       ) {
//   //         throw Error("item inválido 2");
//   //       }
//   //       (this.menuGroups[groupIndex].items[
//   //         itemIndex
//   //       ] as any).url = url;
//   //       this.update();
//   //     })
//   //     .catch(err => {
//   //       alert("Erro ao baixar foto. Atualize a página.");
//   //       console.error(err);
//   //       return { ...item, url: "" };
//   //     });
//   // };

//   // private updateUrls = async () => {
//   //   const promises = this.menuGroups.map(async group => {
//   //     const _promises = group.items.map(item => {
//   //       if (item.type !== "content") {
//   //         throw Error(
//   //           "Tipo de item nao reconhecido na geturl"
//   //         );
//   //       }
//   //       const storage = Firebase.storage();
//   //       const storageRef = storage
//   //         .ref()
//   //         .child("images")
//   //         .child("thumb_" + item.id + ".jpg");

//   //       const p = () =>
//   //         storageRef
//   //           .getDownloadURL()
//   //           .then(url => ({
//   //             ...item,
//   //             url
//   //           }))
//   //           .catch(err => {
//   //             // alert("Erro ao baixar foto de " + item.title);
//   //             return { ...item, url: "" };
//   //           });

//   //       return p();
//   //     });

//   //     const items = await Promise.all(_promises);

//   //     return { ...group, items };
//   //   });

//   //   const newGroups = await Promise.all(promises);
//   //   this.menuGroups = newGroups;
//   //   this.update();
//   // };

//   // constructor() {
//   //   Firebase.database()
//   //     .ref("/groups")
//   //     .on("value", data => {
//   //       if (data) {
//   //         const x = data.val();
//   //         if (!x) {
//   //           console.error(
//   //             "Não há dados do grupo, mas recebeu"
//   //           );
//   //           this.menuGroups = [];
//   //           this.update();
//   //           return;
//   //         }

//   //         const groups: IMenuGroup[] = Object.keys(
//   //           x || {}
//   //         ).map(id => {
//   //           let item = x[id] as IMenuGroupDb;

//   //           if (!item.items) {
//   //             item.items = [];
//   //           } else {
//   //             item.items = getItems(item.items, id);
//   //           }

//   //           return {
//   //             ...item,
//   //             id,
//   //             editable: true
//   //           };
//   //         });

//   //         this.menuGroups = groups;
//   //         this.updateUrls();
//   //       } else {
//   //         console.error("Nao há dados do grupo");
//   //       }
//   //     });
//   // }

//   // public getMenuGroups = (): IMenuGroup[] =>
//   //   this.menuGroups;

//   // public getLoading = () => this.loading;
// }

// export default Store;
