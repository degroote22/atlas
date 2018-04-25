import { ItemStore, getProgressText } from "./ItemStore";
import * as f from "firebase";
import Firebase from "../Database/firebase";

const skip = () =>
  new Promise((rs, rj) => setTimeout(rs, 0));

describe("creation", () => {
  let prog: any;
  let err: any;
  let succ: any;
  const key = "key";
  let s = new ItemStore();
  let push = jest.fn();
  let createImageRef = jest.fn();
  let put = jest.fn();
  let trig = jest.fn();
  let set = jest.fn();

  const groupid = "groupid";
  const item = {
    file: {
      name: "abc.jpg"
    }
  };

  const on = (
    s: string,
    _prog: any,
    _err: any,
    _succ: any
  ) => {
    expect(s).toBe("state_changed");
    prog = _prog;
    err = _err;
    succ = _succ;
  };

  const task = {
    on
  };

  beforeEach(() => {
    s = new ItemStore();
    (s as any).trigger = trig;
    push.mockClear();
    createImageRef.mockClear();
    put.mockClear();
    trig.mockClear();
    set.mockClear();
    const db = {
      Item: {
        Push: push,
        Set: set
      },
      Storage: {
        CreateImageRef: createImageRef
      }
    } as any;
    s.init(db, 0 as any);

    set.mockResolvedValueOnce({});
    put.mockReturnValueOnce(task);
    createImageRef.mockReturnValueOnce({ put: put });
  });

  it("handles file upload errors", done => {
    push.mockResolvedValueOnce({ key });

    const txt = "txt";
    s.create(groupid, item as any).catch(x => {
      expect(s.getUploadingText()).toBe(
        "Houve um erro no upload da imagem. " +
          JSON.stringify(txt)
      );
      expect(s.getUploading()).toBe(false);
      expect(trig.mock.calls.length).toBe(2);
      done();
    });

    // como a referencia e chave vêm em uma promessa
    // o registro dos callbacks no evento só acontece
    // no próximo loop de eventos. então é preciso esperar
    // que o callback seja registrado para então chamá-lo
    // (isso acontece no próximo loop de eventos)
    setTimeout(() => {
      err(txt);
    }, 0);
  });

  it("handles other errors", done => {
    const txt = "txt";
    push.mockRejectedValueOnce(txt);

    s.create(groupid, item as any).catch(x => {
      expect(s.getUploadingText()).toBe(
        "Houve um erro na criação. " + JSON.stringify(txt)
      );
      expect(s.getUploading()).toBe(false);
      expect(trig.mock.calls.length).toBe(2);
      done();
    });
  });

  it("creates", async () => {
    push.mockResolvedValueOnce({ key });
    s.create(groupid, item as any);
    await skip();

    expect(push).toBeCalledWith(groupid);
    expect(createImageRef).toBeCalledWith(
      key + "." + "jpg"
    );
    expect(put).toBeCalledWith(item.file);

    const snapshot = {
      bytesTransferred: 1,
      totalBytes: 100,
      state: Firebase.storage.TaskState.RUNNING
    };

    prog(snapshot);
    expect(s.getUploadingText()).toBe(
      getProgressText(1 / 100 * 100)
    );
    expect(s.getUploading()).toBe(true);

    const snapshot2 = {
      bytesTransferred: 100,
      totalBytes: 100,
      state: Firebase.storage.TaskState.RUNNING
    };

    prog(snapshot2);
    expect(s.getUploadingText()).toBe(
      getProgressText(99 / 100 * 100)
    );
    expect(s.getUploading()).toBe(true);

    const snapshot3 = {
      bytesTransferred: 100,
      totalBytes: 100,
      state: Firebase.storage.TaskState.PAUSED
    };

    prog(snapshot3);
    expect(s.getUploadingText()).toBe(
      getProgressText(99 / 100 * 100, "Upload pausado")
    );
    expect(s.getUploading()).toBe(true);

    succ();
    await skip();

    expect(s.getUploading()).toBe(false);
    expect(s.getUploadingText()).toBe(
      "Enviado com sucesso!"
    );
    expect(trig.mock.calls.length).toBe(5);
  });
});

it("deletes if confirmed", () => {
  const s = new ItemStore();

  const mock1 = jest.fn();
  const mock2 = jest.fn();
  window.confirm = () => true;
  s.init(
    { Item: { Delete: mock1 } } as any,
    {
      RouterStore: {
        reset: mock2
      }
    } as any
  );

  const groupid = "groupid";
  const id = "id";
  s.delete(groupid, id);
  expect(mock1).toBeCalledWith(groupid, id);
  expect(mock2).toBeCalled();
});
it("does not delete if not confirmed", () => {
  const s = new ItemStore();

  const mock1 = jest.fn();
  const mock2 = jest.fn();
  window.confirm = () => false;
  s.init(
    { Item: { Delete: mock1 } } as any,
    {
      RouterStore: {
        reset: mock2
      }
    } as any
  );

  const groupid = "groupid";
  const id = "id";
  s.delete(groupid, id);
  expect(mock1).not.toBeCalled();
  expect(mock2).not.toBeCalled();
});
