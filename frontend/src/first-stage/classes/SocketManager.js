export default class SocketManager {
  constructor(socket, emitter) {
    this.socket = socket
    this.emitter = emitter
  }

  setHandlers() {
    this.socket.onopen = this.openHandler.bind(this)
    this.socket.onmessage = this.messageHandler.bind(this)
    this.socket.onclose = this.closeHandler.bind(this)
    this.socket.onerror = this.errorHandler.bind(this)
  }

  openHandler(event) {
    console.log('open', this)
    this.emitter.emit('socketOpen')

  }

  messageHandler(event) {
    console.log(event)
    let incomingData

    try {
      incomingData = JSON.parse(event.data)
    } catch(e) {
      incomingData = event.data
    }

    this.emitter.emit('socketMessage', incomingData)
  }

  closeHandler(event) {
    console.log('close')
    this.emitter.emit('socketClose')
  }

  errorHandler(event) {}

  send(data) {
    this.socket.send(data)
  }
}