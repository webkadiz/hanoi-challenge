const http = require("http")
const url = require("url")
const { firstStageSocket } = require("./first-stage")
const { lastStageSocket } = require("./last-stage")
const { timerSocket } = require("./timer")
const { commandCenterSocket } = require("./command-center")

const server = http.createServer()

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
  } else if (pathname === "/command-center") {
    commandCenterSocket.handleUpgrade(request, socket, head, function done(ws) {
      commandCenterSocket.emit("connection", ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(8081)
