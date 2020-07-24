const http = require("http")
const WebSocket = require("ws")
const url = require("url")
const cookie = require("cookie")

const server = http.createServer()

const firstStageSocket = new WebSocket.Server({ noServer: true })
const lastStageSocket = new WebSocket.Server({ noServer: true })
const timerSocket = new WebSocket.Server({ noServer: true })

const cookieExpires = 60 * 60 * 24 * 7 * 2

let timerClient
let lastStageClient
let firstStageClients = Array(4).fill(null)
let webSocketKeyTable = {}

firstStageSocket.on("headers", (headers, req) => {
  const cookieParsed = cookie.parse(req.headers.cookie || "")
  const cliendIndex = firstStageClients.indexOf(null)

  if (!cookieParsed.firstStageIndex && ~cliendIndex) {
    headers.push(
      `Set-Cookie: ${cookie.serialize("firstStageIndex", cliendIndex, {
        maxAge: cookieExpires,
      })}`
    )
    webSocketKeyTable[req.headers["sec-websocket-key"]] = cliendIndex
  }
})

firstStageSocket.on("connection", function connection(ws, req) {
  const cookieParsed = cookie.parse(req.headers.cookie || "")
  let clientIndex

  console.log(cookieParsed)

  if (
    cookieParsed.firstStageIndex &&
    !firstStageClients[cookieParsed.firstStageIndex]
  ) {
    clientIndex = cookieParsed.firstStageIndex
    firstStageClients[clientIndex] = ws
  } else if (
    webSocketKeyTable[req.headers["sec-websocket-key"]] !== undefined
  ) {
    clientIndex = webSocketKeyTable[req.headers["sec-websocket-key"]]
    firstStageClients[clientIndex] = ws
    delete webSocketKeyTable[req.headers["sec-websocket-key"]]
  } else {
    console.log("terminate")
    ws.terminate()
  }

  ws.on("message", (message) => {
    console.log("message from", clientIndex, message, typeof message)
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

  lastStageClient.on("message", (message) => {
    console.log("get message from last stage client", message)
  })
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
