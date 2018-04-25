import DbStoreInject from "./DbStoreInject";

it("initiliazes the database", () => {
  const mockDb = jest.fn();
  const mockSt = jest.fn();

  class Test extends DbStoreInject {
    test() {
      expect(mockDb).toEqual(this.db());
      expect(mockSt).toEqual(this.st());
    }
  }
  const t = new Test();
  t.init(mockDb as any, mockSt as any);
  t.test();
});

it("throws if the database is not initialized", () => {
  class Test extends DbStoreInject {
    test() {
      this.db();
    }
  }
  const t = new Test();
  expect(() => {
    t.test();
  }).toThrow();

  class Test2 extends DbStoreInject {
    test() {
      this.st();
    }
  }
  const t2 = new Test2();
  expect(() => {
    t2.test();
  }).toThrow();
});
