const http = require('http')
const WebSocket = require('ws')
const url = require('url')
const cookie = require('cookie')
 
const server = http.createServer()

const firstStageSocket = new WebSocket.Server({ noServer: true })
const lastStageSocket = new WebSocket.Server({ noServer: true })
const timerSocket = new WebSocket.Server({ noServer: true })

let lastStageClient
let firstStageClients = Array(4).fill(null)
let webSocketKeyTable = {}
id = 0


firstStageSocket.on('headers', (headers, req) => {
  const cookieParsed = cookie.parse(req.headers.cookie || '')
  const cliendIndex = firstStageClients.indexOf(null)


  if (!cookieParsed.firstStageIndex && ~cliendIndex) {
    headers.push(`Set-Cookie: ${cookie.serialize('firstStageIndex', cliendIndex)}`)
    webSocketKeyTable[req.headers['sec-websocket-key']] = cliendIndex
  }

})

firstStageSocket.on('connection', function connection(ws, req) {
  
  const cookieParsed = cookie.parse(req.headers.cookie || '')
  let clientIndex

  console.log(cookieParsed)

  if (cookieParsed.firstStageIndex && !firstStageClients[cookieParsed.firstStageIndex]) {
    clientIndex = cookieParsed.firstStageIndex
    firstStageClients[clientIndex] = ws
  } else if (webSocketKeyTable[req.headers['sec-websocket-key']] !== undefined) {
    clientIndex = webSocketKeyTable[req.headers['sec-websocket-key']]
    firstStageClients[clientIndex] = ws
    delete webSocketKeyTable[req.headers['sec-websocket-key']]
  } else {
    console.log('terminate')
    ws.terminate()
  }

  
  ws.on('message', message => {
    console.log('message from', clientIndex, message, typeof message)


    if (message instanceof Buffer) {
      const data = JSON.stringify({
        clientIndex,
        buffer: message,
        type: 'video/webm;codecs=vp8'
      })

      lastStageClient.send(data)
    }
  })

  ws.on('close', () => {
    console.log('close', clientIndex)
    if (clientIndex !== undefined)
      firstStageClients[clientIndex] = null

    console.log(firstStageClients.filter(Boolean).length)
    console.log(firstStageSocket.clients.size)
  })
})
 
lastStageSocket.on('connection', function connection(ws) {

  lastStageClient = ws
  console.log('connect last stage client')

  lastStageClient.on('message', message => {
    console.log('get message from last stage client', message)
  })
  
})

timerSocket.on('connection', function connection(ws) {
  // ...
})


server.on('request', () => {
  console.log('request')
})

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname
  

  console.log(pathname)

  if (pathname === '/first-stage') {
    firstStageSocket.handleUpgrade(request, socket, head, function done(ws) {
      firstStageSocket.emit('connection', ws, request)
    })
  } else if (pathname === '/last-stage') {
    lastStageSocket.handleUpgrade(request, socket, head, function done(ws) {
      lastStageSocket.emit('connection', ws, request)
    })
    
  } else if (pathname === '/timer') {
    timerSocket.handleUpgrade(request, socket, head, function done(ws) {
      timerSocket.emit('connection', ws, request)
    })
    
  } else {
    socket.destroy()
  }
})
 
server.listen(8081)