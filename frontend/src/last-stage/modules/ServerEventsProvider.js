export default class ServerEventsProvider {
  constructor(socketManager, emitter) {
    this.socketManager = socketManager
    this.emitter = emitter
  }

  launch() {
    this.socketManager.setHandlers()

    this.emitter.on('socketMessage', (incomingData => {
      if (incomingData.buffer) {
        this.emitter.emit('appendBuffer', {
          buffer: incomingData.buffer.data,
          clientIndex: incomingData.clientIndex
        })
      } else if(incomingData.data.create) {
        this.emitter.emit('createMediaSource', {
          clientIndex: incomingData.clientIndex
        })        
      } else if(incomingData.data.gameOver) {
        this.emitter.emit('handleFirstStageGameOver', {
          gameOver: incomingData.data.gameOver,
          additionalScore: incomingData.data.additionalScore,
          clientIndex: incomingData.clientIndex
        })    
      }    
    }).bind(this))
  }
}