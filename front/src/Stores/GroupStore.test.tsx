import { GroupStore } from "./GroupStore";
import * as f from "firebase";

it("creates a group", () => {
  const mock = jest.fn();

  const title = "Título";

  const group = {
    title,
    priority: f.database.ServerValue.TIMESTAMP,
    items: []
  };

  const store = new GroupStore();
  store.init(
    {
      Group: { Create: mock },
      Now: f.database.ServerValue.TIMESTAMP
    } as any,
    0 as any
  );

  store.create(title);
  expect(mock).toBeCalledWith(group);
});

it("deletes a group", () => {
  const mock = jest.fn();
  const mockResetRouter = jest.fn();

  const id = "id";
  const store = new GroupStore();

  store.init(
    {
      Group: { Delete: mock },
      Now: f.database.ServerValue.TIMESTAMP
    } as any,
    {
      RouterStore: { reset: mockResetRouter }
    } as any
  );

  window.confirm = () => true;
  store.delete(id);
  expect(mock).toBeCalledWith(id);
  expect(mockResetRouter).toBeCalled();
});

it("does not delete a group if not confirmed", () => {
  const mockGroupDelete = jest.fn();
  const mockResetRouter = jest.fn();
  const id = "id";
  const store = new GroupStore();

  store.init(
    {
      Group: { Delete: mockGroupDelete },
      Now: f.database.ServerValue.TIMESTAMP
    } as any,
    {
      RouterStore: { reset: mockResetRouter }
    } as any
  );

  window.confirm = () => false;
  store.delete(id);
  expect(mockGroupDelete).not.toBeCalled();
  expect(mockResetRouter).not.toBeCalled();
});
