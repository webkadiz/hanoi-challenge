const WebSocket = require("ws")
const sendMsg = require("./sendMsg")
const { firstStageClients } = require("./first-stage")
 
const timerSocket = new WebSocket.Server({ noServer: true })

timerSocket.on("connection", (ws) => {
  ws.on("message", (message) => {
    firstStageClients.forEach((client) => sendMsg(client, message))
  })

  module.exports.timerClient = ws
})

module.exports.timerSocket = timerSocket
