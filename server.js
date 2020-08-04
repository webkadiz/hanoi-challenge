const http = require("http")
const WebSocket = require("ws")
const url = require("url")

const server = http.createServer()

const firstStageSocket = new WebSocket.Server({ noServer: true })
const lastStageSocket = new WebSocket.Server({ noServer: true })
const timerSocket = new WebSocket.Server({ noServer: true })

let timerClient
let lastStageClient
let firstStageClients = Array(4).fill(null)

firstStageSocket.on("connection", function connection(ws, req) {
  const clientIndex = firstStageClients.indexOf(null)

  firstStageClients[clientIndex] = ws

  ws.on("message", (message) => {
    let messageParsed

    if (message instanceof Buffer) {
      const data = JSON.stringify({
        clientIndex,
        buffer: message,
        type: "video/webm;codecs=vp8",
      })
      
      lastStageClient && lastStageClient.send(data)
      return
    }
    
    console.log("message from", clientIndex, message, typeof message)
    try {
      messageParsed = JSON.parse(message)
    } catch (e) {
      messageParsed = message
    }

    const data = JSON.stringify({
      clientIndex,
      data: messageParsed,
    })

    lastStageClient && lastStageClient.send(data)
  })

  ws.on("close", () => {
    debugger
    console.log("close", clientIndex)
    if (clientIndex !== undefined) firstStageClients[clientIndex] = null
  })
})

lastStageSocket.on("connection", function connection(ws) {
  lastStageClient = ws
  console.log("connect last stage client")

  for (const firstStageClient of firstStageClients) {
    firstStageClient &&
      firstStageClient.send(
        JSON.stringify({
          reload: true,
        })
      )
  }
})

timerSocket.on("connection", function connection(ws) {
  timerClient = ws

  timerClient.on("message", (message) => {
    for (const firstStageClient of firstStageClients) {
      firstStageClient &&
        firstStageClient.send(
          JSON.stringify({
            timer: message,
          })
        )
    }

    console.log("get message from timer client", message)
  })
})

server.on("request", () => {
  console.log("request")
})

server.on("upgrade", function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname

  console.log(pathname)

  if (pathname === "/first-stage") {
    firstStageSocket.handleUpgrade(request, socket, head, function done(ws) {
      firstStageSocket.emit("connection", ws, request)
    })
  } else if (pathname === "/last-stage") {
    lastStageSocket.handleUpgrade(request, socket, head, function done(ws) {
      lastStageSocket.emit("connection", ws, request)
    })
  } else if (pathname === "/timer") {
    timerSocket.handleUpgrade(request, socket, head, function done(ws) {
      timerSocket.emit("connection", ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(8081)
