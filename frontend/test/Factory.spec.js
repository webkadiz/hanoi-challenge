import {assert} from 'chai'
import Factory from '../src/first-stage/packages/EventEmitter/Factory'
import Event from "../src/first-stage/packages/EventEmitter/Event";
import List from "../src/first-stage/packages/EventEmitter/List";

describe('Factory', function() {

  describe("Creation instance", function() {
    let factory

    beforeEach(function() {
      factory = new Factory(Event)
    })

    it("One", function() {
      const event = factory.create()
      assert.instanceOf(event, Event)
    })

    it("Two different", function() {
      const event1 = factory.create()
      const event2 = factory.create()
      assert.notEqual(event1, event2)
    })
  })

  describe("Create deps", function() {
    it("Create dependency", function() {
      const factory = new Factory(Event, List)
      const deps = Array.from(factory._createDeps())
      assert.instanceOf(deps[0], List)
    })

    it("Create different dependencies", function() {
      const factory = new Factory(Event, List)
      const deps1 = Array.from(factory._createDeps())
      const deps2 = Array.from(factory._createDeps())
      assert.notEqual(deps1[0], deps2[0])
    })

    it("Create equal dependencies", function() {
      const factory = new Factory(Event, new List())
      const deps1 = Array.from(factory._createDeps())
      const deps2 = Array.from(factory._createDeps())
      assert.equal(deps1[0], deps2[0])
    })
  })
})