import { assert } from "chai"
import SocketManager from "../src/common/SocketManager"
import WebSocket from "ws"
import { EventEmitter, Factory, Event, List } from "@webkadiz/event-emitter"

describe("SocketManager", function () {
  describe("after open", function () {
    let conn, server, ws, emitter, socketManager

    beforeEach((done) => {
      server = new WebSocket.Server({ port: 3020 })
      ws = new WebSocket("ws://localhost:3020")
      emitter = new EventEmitter(new Factory(Event, List))
      socketManager = new SocketManager(ws, emitter)
      socketManager.setHandlers()

      server.on("connection", (client) => {
        conn = client
      })

      ws.on("open", () => {
        done()
      })
    })

    afterEach(() => {
      server.close()
    })

    it("message json", function (done) {
      emitter.on("socketMessage", (data) => {
        assert.deepEqual(data, { a: 1 })
        done()
      })
      conn.send(JSON.stringify({ a: 1 }))
    })

    it("message text", function (done) {
      emitter.on("socketMessage", (data) => {
        assert.equal(data, 123)
        done()
      })
      conn.send(123)
    })

    it("send", function () {
      const res = socketManager.send({
        a: 1,
      })
      assert.isTrue(res)
    })
  })

  describe("before open", () => {
    let conn, server, ws, emitter, socketManager

    beforeEach(() => {
      ws = new WebSocket("ws://localhost:3020")
      emitter = new EventEmitter(new Factory(Event, List))
      socketManager = new SocketManager(ws, emitter)
      socketManager.setHandlers()
    })

    it("send without connection", function () {
      const res = socketManager.send({
        a: 1,
      })

      assert.isFalse(res)
    })
  })
})
