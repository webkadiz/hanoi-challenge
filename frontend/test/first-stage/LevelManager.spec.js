import { assert } from "chai"
import $ from "jquery"
import LevelManager from "../../src/first-stage/classes/LevelManager"
import { EventEmitter, Factory, Event, List } from "@webkadiz/event-emitter"

describe("LevelManager", function () {
  let levelManager, emitter, screen, gameLevels

  beforeEach(function () {
    emitter = new EventEmitter(new Factory(Event, List))
    screen = $("<div class='level'></div>")
    gameLevels = [3, 3, 4, 4, 2]
    levelManager = new LevelManager(screen, gameLevels, emitter)
  })

  describe("calcIndexNumber", function () {
    it("test functionality", function () {
      const levelIndex = 0
      assert.equal(levelManager.calcIndexNumber(levelIndex), 1)
    })
  })

  describe("createCeil", function () {
    it("Create ceil for level index = 1", function () {
      const levelIndex = 0
      const ceil = levelManager.createCeil(levelIndex)

      assert.equal(ceil.text(), "1")
    })
  })

  describe("createScreen", function () {
    it("Test length screen", function () {
      levelManager = new LevelManager(screen, [1, 2], emitter)
      levelManager.createScreen()

      assert.equal(screen.children().length, 2)
    })

    it("Test value ceil", function () {
      levelManager = new LevelManager(screen, [1, 2], emitter)
      levelManager.createScreen()

      assert.equal(screen.children().eq(0).text(), "1")
      assert.equal(screen.children().eq(1).text(), "2")
    })
  })

  describe("getGameLevel", function () {
    it("Game level before choose level", function () {
      assert.equal(levelManager.getGameLevel(), undefined)
    })

    it("Game level before choose level", function () {
      levelManager = new LevelManager(screen, [3, 5], emitter)
      const levelIndex = 0
      const ceil = levelManager.createCeil(levelIndex)

      ceil.click()

      assert.equal(levelManager.getGameLevel(), 3)
    })
  })

  describe("setGameLevel", function () {
    it("Test emit", function (done) {
      emitter.on("setGameLevel", function () {
        done()
      })

      levelManager.setGameLevel()
    })
  })
})
