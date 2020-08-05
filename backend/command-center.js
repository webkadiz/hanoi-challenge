const WebSocket = require("ws")
const sendMsg = require("./sendMsg")

const commandCenterSocket = new WebSocket.Server({ noServer: true })

commandCenterSocket.on("connection", (ws) => {
  ws.on("message", (msg) => {
    const { firstStageClients } = require("./first-stage")
    const { lastStageClient } = require("./last-stage")
    const { timerClient } = require("./timer")

    firstStageClients.forEach((client) => sendMsg(client, msg))
    sendMsg(lastStageClient, msg)
    sendMsg(timerClient, msg)
  })
})

module.exports.commandCenterSocket = commandCenterSocket
