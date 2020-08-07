const WebSocket = require("ws")
const sendMsg = require("./sendMsg")

const firstStageSocket = new WebSocket.Server({ noServer: true })
const firstStageClients = new Array(4).fill(null)

firstStageSocket.on("connection", (ws) => {
  const clientIndex = firstStageClients.indexOf(null) // first free cell
  firstStageClients[clientIndex] = ws

  ws.on("message", (message) => {
    const { lastStageClient } = require("./last-stage")
    let messageParsed

    if (message instanceof Buffer) {
      const data = JSON.stringify({
        clientIndex,
        buffer: message,
        type: "video/webm;codecs=vp8",
      })

      sendMsg(lastStageClient, data)
      return
    }

    try {
      messageParsed = JSON.parse(message)
    } catch (e) {
      messageParsed = message
    }

    const data = JSON.stringify({
      clientIndex,
      data: messageParsed,
    })

    sendMsg(lastStageClient, data)
  })

  ws.on("close", () => {
    firstStageClients[clientIndex] = null
  })
})

module.exports.firstStageSocket = firstStageSocket
module.exports.firstStageClients = firstStageClients
