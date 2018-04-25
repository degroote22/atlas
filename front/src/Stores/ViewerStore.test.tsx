import { ViewerStore } from "./ViewerStore";

it("set focus without forcing list to scroll", () => {
  const mock = jest.fn();
  const s = new ViewerStore();
  const id = "id";
  (s as any).trigger = mock;
  s.setFocus(id, false);

  expect(s.getFocus()).toBe(id);
  expect(mock).toBeCalled();
});

it("set focues and calls scollTo", () => {
  const s = new ViewerStore();
  const id = "id";
  const mock = jest.fn();
  const mock2 = jest.fn();
  (s as any).trigger = mock2;

  s.registerListScrollTo(mock);
  s.setFocus(id, true);
  expect(s.getFocus()).toBe(id);
  expect(mock).toBeCalledWith(id);
  expect(mock2).toBeCalled();
});
