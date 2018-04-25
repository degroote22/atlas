import { IDb } from "../Database";
import { IStores } from "../App";
import { StoreBase } from "resub";

class DbStoreBase extends StoreBase {
  private _db: IDb | null = null;
  private _st: IStores | null = null;

  public init(db: IDb, st: IStores) {
    this._db = db;
    this._st = st;
  }

  protected db() {
    if (this._db === null) {
      throw Error("Database not found");
    }
    return this._db;
  }

  protected st() {
    if (this._st === null) {
      throw Error("Stores not found");
    }
    return this._st;
  }
}

export default DbStoreBase;
