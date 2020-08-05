const WebSocket = require("ws")

const lastStageSocket = new WebSocket.Server({ noServer: true })

lastStageSocket.on("connection", (ws) => {
  module.exports.lastStageClient = ws
})

module.exports.lastStageSocket = lastStageSocket 