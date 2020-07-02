import {assert} from 'chai'
import List from '../src/first-stage/packages/EventEmitter/List'

describe("List", function() {
  describe("Creation", function() {
    it("Create without init", function() {
      new List()
    })

    it("Create with right init", function() {
      new List([1, 2, 3])
    })

    it("Create with wrong init", function() {
      try {
        new List("123")
      } catch {return}
      assert.fail()
    })

    it("Get init", function() {
      const list = new List([1, 2, 3])
      debugger
      assert.deepEqual(list.get(2), [2])
    })
  })

  describe("Add And Get", function() {
    it("get do not exists element", function() {
      const list = new List()
      assert.deepEqual(list.get(2), false)
    })

    it("One equal element", function() {
      const list = new List()
      list.add(3)
      assert.deepEqual(list.get(3), [3])
    })

    it("Two equal element", function() {
      const list = new List()
      list.add(3)
      list.add(3)
      list.add(1)
      assert.deepEqual(list.get(3), [3, 3])
    })

    it("Get All", function() {
      const list = new List()
      list.add(3)
      list.add(3)
      list.add(1)
      assert.deepEqual(list.getAll(), [3, 3, 1])
    })

    it("Chain add", function() {
      const list = new List()
      list.add(2).add(3).add(4)
      assert.deepEqual(list.getAll(), [2, 3, 4])
    })
  })

  describe("Remove and clear", function() {
    it("Remove don't exists element", function() {
      const list = new List([1, 2, 3])
      list.remove(4)
      assert.deepEqual(list.getAll(), [1, 2, 3])
    })

    it("Remove one equal element", function() {
      const list = new List([1, 2, 3])
      list.remove(2)
      assert.deepEqual(list.getAll(), [1, 3])
    })

    it("Remove Two equal element", function() {
      const list = new List([1, 2, 3, 2])
      list.remove(2)
      assert.deepEqual(list.getAll(), [1, 3])
    })

    it("Clear", function() {
      const list = new List([1, 2, 3, 2])
      list.clear()
      assert.deepEqual(list.getAll(), [])
    })
  })

  describe("Length", function() {
    it("from create", function() {
      const list = new List([1, 2, 3])
      assert.equal(list.length(), 3)
    })

    it("from add", function() {
      const list = new List()
      list.add(2)
      assert.equal(list.length(), 1)
    })
  })
})