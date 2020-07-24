import { assert } from "chai"
import ServerEventsProvider from "@/last-stage/modules/ServerEventsProvider"
import SocketManager from "@/first-stage/classes/SocketManager"
import { EventEmitter, Factory, Event, List } from "@webkadiz/event-emitter"

describe("ServerEventsProvider", () => {
  const emitter = new EventEmitter(new Factory(Event, List))
  const socketManager = new SocketManager(new Object(), emitter)
  const serverEventsProvider = new ServerEventsProvider(
    socketManager,
    emitter
  ).launch()

  it("test createMediaSource event", () => {
    emitter.on("createMediaSource", (data) => {
      assert.isDefined(data.clientIndex)
      assert.equal(data.clientIndex, 0)
      assert.lengthOf(Object.keys(data), 1)
    })

    socketManager.emitter.emit("socketMessage", {
      clientIndex: 0,
      data: {
        created: true,
      },
    })
  })

  it("test appendBuffer event", () => {
    emitter.on("appendBuffer", (data) => {
      assert.isDefined(data.clientIndex)
      assert.isDefined(data.buffer)
      assert.equal(data.clientIndex, 0)
      assert.isArray(data.buffer)
      assert.deepEqual(data.buffer, [1, 2, 3])
      assert.lengthOf(Object.keys(data), 2)
    })

    socketManager.emitter.emit("socketMessage", {
      clientIndex: 0,
      buffer: {
        type: "Buffer",
        data: [1, 2, 3],
      },
    })
  })

  it("test gameOver event", () => {
    emitter.on("appendBuffer", (data) => {
      assert.isDefined(data.clientIndex)
      assert.isDefined(data.additionalScore)
      assert.isDefined(data.gameOver)
      assert.equal(data.clientIndex, 0)
      assert.equal(data.additionalScore, 1)
      assert.equal(data.gameOver, true)
      assert.lengthOf(Object.keys(data), 3)
    })

    socketManager.emitter.emit("socketMessage", {
      clientIndex: 0,
      data: {
        additionalScore: 1,
        gameOver: true,
      },
    })
  })
})
