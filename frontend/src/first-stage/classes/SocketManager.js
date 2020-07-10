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
    this.emitter.emit('socketOpen', event)
  }

  messageHandler(event) {
    let incomingData

    try {
      incomingData = JSON.parse(event.data)
    } catch(e) {
      incomingData = event.data
    }

    this.emitter.emit('socketMessage', incomingData)
  }

  closeHandler(event) {
    this.emitter.emit('socketClose', event)
  }

  errorHandler(event) {
    this.emitter.emit('socketError', event)
  }

  send(data) {
    if (this.socket.readyState == 1) {
      this.socket.send(JSON.stringify(data))
      return true
    } else {
      return false
    }
  }
}