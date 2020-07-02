import { assert } from "chai";
import { EventEmitter } from "../src/first-stage/packages/EventEmitter/EventEmitter";
import Factory from "../src/first-stage/packages/EventEmitter/Factory";
import Event from "../src/first-stage/packages/EventEmitter/Event";
import List from "../src/first-stage/packages/EventEmitter/List";

const ERROR_CLASS_NAME = "EventEmitterError";

describe("EventEmitter", () => {
  let emitter

  beforeEach(function() {
    emitter = new EventEmitter(new Factory(Event, List))
  })

  describe("Private API", function() {

    describe("EventNameIsValid", function() {
      it("EventName - string", function() {
        assert.isTrue(emitter._eventNameIsValid("noname"))
      })
      
      it("EventName - number", function() {
        assert.isFalse(emitter._eventNameIsValid(4))
      })

      it("EventName - array", function() {
        assert.isFalse(emitter._eventNameIsValid([1,3]))
      })
    })

    describe("ListenerIsValid", function() {
      it("Listener - function", function() {
        assert.isTrue(emitter._listenerIsValid(() => {}))
      })
      
      it("Listener - number", function() {
        assert.isFalse(emitter._listenerIsValid(4))
      })

      it("Listener - string", function() {
        assert.isFalse(emitter._listenerIsValid("function"))
      })
    })

    describe("ThrowErrorIfEventNameInValid", function() {
      it("throw", function() {
        try {
          emitter._throwErrorIfEventNameInValid(4)
        } catch {return}

        assert.fail()
      })

      it("do not throw", function() {
        emitter._throwErrorIfEventNameInValid("noname")
      })
    })

    describe("ThrowErrorIfListenerInValid", function() {
      it("throw", function() {
        try {
          emitter._throwErrorIfListenerInValid("function")
        } catch {return}

        assert.fail()
      })

      it("do not throw", function() {
        emitter._throwErrorIfListenerInValid(() => {})
      })
    })
  })

  describe("Public API", function () {
    describe("Correct ot incorrect subscribe", () => {
      it("correct subscribe on event", () => {
        emitter.on("test", () => {});
      });

      it("incorrect subscribe on event", () => {
        try {
          emitter.on(123, () => {});
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("incorrect subscribe on event", () => {
        try {
          emitter.on("test", "test");
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("incorrect subscribe on event", () => {
        try {
          emitter.on(123, "test");
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });
    });

    describe("Listeners count", () => {
      it("count listeners - 0", () => {
        assert.equal(emitter.listenersCount("test"), 0);
      });

      it("count listeners - 3 different", () => {
        emitter.on("test", () => {});
        emitter.on("test", () => {});
        emitter.on("test", () => {});
        assert.equal(emitter.listenersCount("test"), 3);
      });

      it("count listeners - 2 equal, 1 different", () => {
        const testHandler = () => {};
        emitter.on("test", testHandler);
        emitter.on("test", testHandler);
        emitter.on("test", () => {});
        assert.equal(emitter.listenersCount("test"), 2);
      });

      it("incorrect event name type", () => {
        try {
          emitter.listenersCount(123);
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });
    });

    describe("Correct and incorrect emit call", () => {
      it("Correct emit", () => {
        const resBool = emitter.emit("test");

        assert.isTrue(resBool);
      });

      it("Correct emit payload", () => {
        const resBool = emitter.emit("test", { a: 1 });

        assert.isTrue(resBool);
      });

      it("Incorrect emit event name", () => {
        try {
          emitter.emit(123);
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });
    });

    describe("Emit functionality", function () {
      it("Test emit", (done) => {
        emitter.on("test", () => done());
        emitter.emit("test");
      });

      it("Test emit payload", (done) => {
        const payload = { a: 1 };
        emitter.on("test", (data) => {
          assert.equal(data, payload);
          done();
        });
        emitter.emit("test", payload);
      });

      it("Test listener order", (done) => {
        const order = [];
        emitter.on("test", () => order.push(1));
        emitter.on("test", () => order.push(2));
        emitter.on("test", () => {
          order.push(3);
          assert.deepEqual(order, [1, 2, 3], "out of order");
          done();
        });

        emitter.emit("test");
      });
    });

    describe("Remove listener", function () {
      it("Remove listener - success", function () {
        const handler = () => {};
        emitter.on("test", handler);
        const res = emitter.off("test", handler);

        assert.isTrue(res);
      });

      it("Remove listener - fail", function () {
        const handler = () => {};
        emitter.on("test", handler);
        const res = emitter.off("test", () => {});

        assert.isFalse(res);
      });

      it("Remove listener - incorrect", function () {
        const handler = () => {};
        emitter.on("test", handler);

        try {
          emitter.off(123);
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("Remove listener functionality", function(done){
        const order = [];
        const testHandler = () => order.push(2);
        emitter.on("test", () => order.push(1));
        emitter.on("test", () => testHandler);
        emitter.on("test", () => {
          order.push(3);
          assert.deepEqual(order, [1, 3], "remove listener not working right");
          done();
        });

        emitter.off("test", testHandler);
        emitter.emit("test");
      });

      it("Remove all listeners functionality", () => {
        const order = [];
        const handler = () => {
          order.push(2);
          assert.deepEqual(order, [2]);
          done();
        };

        emitter.on("test", () => order.push(1));
        emitter.on("test", () => handler);
        emitter.on("test", () => order.push(3));

        emitter.off("test");

        emitter.on("test", () => handler);
        emitter.emit("test");
      });
    });
  });
});
