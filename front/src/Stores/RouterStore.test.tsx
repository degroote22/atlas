import { RouterStore, DEFAULT_OPEN } from "./RouterStore";

let s = new RouterStore();
let mock = jest.fn();
beforeEach(() => {
  s = new RouterStore();
  mock = jest.fn();
  (s as any).trigger = mock;
});

it("resets", () => {
  s.reset();
  expect(s.getMenuHidden()).toBe(false);
  expect(s.getShowing()).toBe(DEFAULT_OPEN);
  expect(mock).toBeCalled();
});

it("opens the menu", () => {
  s.openMenu();
  expect(s.getMenuHidden()).toBe(false);
  expect(mock).toBeCalled();
});

it("closed the menu", () => {
  s.closeMenu();
  expect(s.getMenuHidden()).toBe(true);
  expect(mock).toBeCalled();
});

it("opens a menuItem", () => {
  const X = "X";
  s.openMenuItem(X as any);
  expect(s.getMenuHidden()).toBe(true);
  expect(s.getShowing()).toBe(X);
  expect(mock).toBeCalled();
});
