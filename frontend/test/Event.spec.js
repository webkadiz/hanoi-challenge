import { assert } from "chai";
import Event from "../src/first-stage/packages/EventEmitter/Event";
import List from "../src/first-stage/packages/EventEmitter/List";

describe("Event", function () {
  let event, res;

  beforeEach(function () {
    const listenerStore = new List();
    event = new Event("event", listenerStore);
  });

  describe("Emit", function () {
    it("Emit functionality", function (done) {
      event.addListener(() => {
        done();
      });
      event.emit();
    });

    it("Emit order", function (done) {
      const order = []
      event.addListener(() => order.push(1));
      event.addListener(() => order.push(2));
      event.addListener(() => {
        order.push(3)
        assert.deepEqual(order, [1, 2, 3])
        done()
      });
      event.emit();
    });

    it("Emit equal handlers", function (done) {
      const order = []
      const push1 = () => order.push(1)
      event.addListener(push1);
      event.addListener(push1);
      event.addListener(() => {
        order.push(3)
        assert.deepEqual(order, [1, 3])
        done()
      });
      event.emit();
    });

    it("Emit payload", function (done) {
      const obj = { a: 1 };
      event.addListener((data) => {
        assert.deepEqual(data, obj);
        done();
      });
      event.emit(obj);
    });
  });

  describe("Listeners count", function() {
    it("Listeners after create", function() {
      assert.equal(event.listenersCount(), 0)
    })

    it("Listeners count - 3", function() {
      event.addListener(() => {});
      event.addListener(() => {});
      event.addListener(() => {});
      assert.equal(event.listenersCount(), 3)
    })

    it("Listeners count - 2", function() {
      const handler = () => {}
      event.addListener(handler);
      event.addListener(handler);
      event.addListener(() => {});
      assert.equal(event.listenersCount(), 2)
    })
  })

  describe("Remove listener", function() {
    it("Remove listener success", function() {
      const handler = () => {}
      event.addListener(handler);
      res = event.removeListener(handler)
      assert.isTrue(res)
    })

    it("Remove listener fail", function() {
      const handler = () => {}
      event.addListener(handler);
      res = event.removeListener(() => {})
      assert.isFalse(res)
    })

    it("Remove all listeners", function() {
      const handler1 = () => {}
      const handler2 = () => {}

      event.addListener(handler1);
      event.addListener(handler2);
      event.removeAllListeners()
      assert.equal(event.listenersCount(), 0)
    })
  })
});
