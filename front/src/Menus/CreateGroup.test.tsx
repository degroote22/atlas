import * as React from "react";
import * as ReactDOM from "react-dom";
import CreateGroup from "./CreateGroup";
import * as renderer from "react-test-renderer";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<CreateGroup />, div);
});

it("renders correctly", () => {
  const tree = renderer.create(<CreateGroup />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("does not create a group without a title", () => {
  const mock = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve());

  const wrapper = shallow(
    <CreateGroup
      GroupStore={
        {
          create: mock
        } as any
      }
    />
  );

  const title = "";

  wrapper
    .find("._input")
    .simulate("change", { target: { value: title } });

  wrapper.find("._create").simulate("click");

  expect(mock).not.toHaveBeenCalled();
});

it("creates a group and clears state", done => {
  const mock = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve());
  const wrapper = shallow(
    <CreateGroup
      GroupStore={
        {
          create: mock
        } as any
      }
    />
  );

  const title = "Novo Título";

  wrapper
    .find("._input")
    .simulate("change", { target: { value: title } });

  wrapper.find("._create").simulate("click");
  wrapper.update();
  expect(wrapper.instance().state.newTitle).toBe(title);
  expect(wrapper.getElement()).toMatchSnapshot();
  expect(mock).toHaveBeenCalledWith(title);

  setTimeout(() => {
    wrapper.update();
    expect(wrapper.instance().state.newTitle).toBe("");
    expect(wrapper.instance().state.error).toBe(false);
    expect(wrapper.getElement()).toMatchSnapshot();
    done();
  }, 0);
});

it("displays an error if needed", done => {
  const mock = jest
    .fn()
    .mockReturnValueOnce(Promise.reject("_ANY_"));

  const wrapper = shallow(
    <CreateGroup
      GroupStore={
        {
          create: mock
        } as any
      }
    />
  );

  const title = "XXXXXXXXXXXXXxx";

  wrapper
    .find("._input")
    .simulate("change", { target: { value: title } });

  wrapper.find("._create").simulate("click");

  expect(mock).toHaveBeenCalledWith(title);

  setTimeout(() => {
    wrapper.update();
    expect(wrapper.instance().state.error).toBe(true);
    expect(wrapper.find("._error")).toHaveLength(1);
    expect(
      wrapper.find("._error").getElement()
    ).toMatchSnapshot();
    done();
  }, 0);
});
