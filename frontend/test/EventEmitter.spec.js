import { assert } from "chai";
import { EventEmitter } from "../src/first-stage/packages/EventEmitter/EventEmitter";

const ERROR_CLASS_NAME = "EventEmitterError";

describe("EventEmitter", () => {
  
  describe("Private API", function() {

    describe("EventNameIsValid", function() {
      it("EventName - string", function() {
        const emitter = new EventEmitter();

        assert.isTrue(emitter._eventNameIsValid("noname"))
      })
      
      it("EventName - number", function() {
        const emitter = new EventEmitter();

        assert.isFalse(emitter._eventNameIsValid(4))
      })

      it("EventName - array", function() {
        const emitter = new EventEmitter();

        assert.isFalse(emitter._eventNameIsValid([1,3]))
      })
    })

    describe("ListenerIsValid", function() {
      it("Listener - function", function() {
        const emitter = new EventEmitter();

        assert.isTrue(emitter._listenerIsValid(() => {}))
      })
      
      it("Listener - number", function() {
        const emitter = new EventEmitter();

        assert.isFalse(emitter._listenerIsValid(4))
      })

      it("Listener - string", function() {
        const emitter = new EventEmitter();

        assert.isFalse(emitter._listenerIsValid("function"))
      })
    })

    describe("ThrowErrorIfEventNameInValid", function() {
      it("throw", function() {
        const emitter = new EventEmitter();

        try {
          emitter._throwErrorIfEventNameInValid(4)
        } catch {return}

        assert.fail()
      })

      it("do not throw", function() {
        const emitter = new EventEmitter();
        
        emitter._throwErrorIfEventNameInValid("noname")
      })
    })

    describe("ThrowErrorIfListenerInValid", function() {
      it("throw", function() {
        const emitter = new EventEmitter();

        try {
          emitter._throwErrorIfListenerInValid("function")
        } catch {return}

        assert.fail()
      })

      it("do not throw", function() {
        const emitter = new EventEmitter();
        
        emitter._throwErrorIfListenerInValid(() => {})
      })
    })
  })

  describe("Public API", function () {
    describe("Correct ot incorrect subscribe", () => {
      it("correct subscribe on event", () => {
        const emitter = new EventEmitter();
        emitter.on("test", () => {});
      });

      it("incorrect subscribe on event", () => {
        const emitter = new EventEmitter();

        try {
          emitter.on(123, () => {});
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("incorrect subscribe on event", () => {
        const emitter = new EventEmitter();

        try {
          emitter.on("test", "test");
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("incorrect subscribe on event", () => {
        const emitter = new EventEmitter();

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
        const emitter = new EventEmitter();
        assert.equal(emitter.listenersCount("test"), 0);
      });

      it("count listeners - 3 different", () => {
        const emitter = new EventEmitter();
        emitter.on("test", () => {});
        emitter.on("test", () => {});
        emitter.on("test", () => {});
        assert.equal(emitter.listenersCount("test"), 3);
      });

      it("count listeners - 2 equal, 1 different", () => {
        const emitter = new EventEmitter();
        const testHandler = () => {};
        emitter.on("test", testHandler);
        emitter.on("test", testHandler);
        emitter.on("test", () => {});
        assert.equal(emitter.listenersCount("test"), 2);
      });

      it("incorrect event name type", () => {
        const emitter = new EventEmitter();

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
        const emitter = new EventEmitter();
        const resBool = emitter.emit("test");

        assert.isTrue(resBool);
      });

      it("Correct emit payload", () => {
        const emitter = new EventEmitter();
        const resBool = emitter.emit("test", { a: 1 });

        assert.isTrue(resBool);
      });

      it("Incorrect emit event name", () => {
        const emitter = new EventEmitter();

        try {
          emitter.emit(123);
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("Incorrect emit with more payload", () => {
        const emitter = new EventEmitter();

        try {
          emitter.emit("test", { a: 1 }, { b: 1 });
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });
    });

    describe("Emit functionality", function () {
      it("Test emit", (done) => {
        const emitter = new EventEmitter();
        emitter.on("test", () => done());
        emitter.emit("test");
      });

      it("Test emit payload", (done) => {
        const emitter = new EventEmitter();
        payload = { a: 1 };
        emitter.on("test", (data) => {
          assert.equal(data, payload);
          done();
        });
        emitter.emit("test", payload);
      });

      it("Test listener order", (done) => {
        const emitter = new EventEmitter();
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
        const emitter = new EventEmitter();
        const handler = () => {};
        emitter.on("test", handler);
        const res = emitter.off("test", handler);

        assert.isTrue(res);
      });

      it("Remove listener - fail", function () {
        const emitter = new EventEmitter();
        const handler = () => {};
        emitter.on("test", handler);
        const res = emitter.off("test", () => {});

        assert.isFalse(res);
      });

      it("Remove listener - incorrect", function () {
        const emitter = new EventEmitter();
        const handler = () => {};
        emitter.on("test", handler);

        try {
          emitter.off(123);
          assert.fail();
        } catch (e) {
          assert.equal(e.name, ERROR_CLASS_NAME);
        }
      });

      it("Remove listener functionality", () => {
        const emitter = new EventEmitter();
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
        const emitter = new EventEmitter();
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
