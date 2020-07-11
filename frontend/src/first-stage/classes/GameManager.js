export default class GameManager {
  constructor(game, socketManager, videoStreamManager, snowfall, injectorArrayMethods, emitter) {
    this.game = game
    this.socketManager = socketManager
    this.videoStreamManager = videoStreamManager
    this.injectorArrayMethods = injectorArrayMethods
    this.emitter = emitter
    this.snowfall = snowfall
  }

  run() {
    this.emitter.on('socketOpen', this.socketOpen.bind(this))
    this.emitter.on('socketMessage', this.socketMessage.bind(this))
    this.emitter.on('socketClose', this.socketClose.bind(this))
    this.emitter.on('videoStreamDataAvailable', this.videoStreamDataAvailable.bind(this))
    
    this.socketManager.setHandlers()
    this.injectorArrayMethods.inject()

    this.game.setGameLevelHandler()
    this.game.createLevelScreen()

    this.snowfall.init()
    this.snowfall.animate()
  }

  socketOpen() {
    this.socketManager.send(JSON.stringify({
      create: true
    }))
    this.videoStreamManager.init()
  }

  socketMessage(incomingData) {
    console.log('income', incomingData)
    if (incomingData.reload) {

      location.reload()
    
    } else if (incomingData.timer === 'start') {
  
      this.game.startGame()
        
    } else if (incomingData.timer === 'stop') {
  
      this.game.stopGame()
  
    }
  }

  socketClose() {
    this.emitter.off('videoStreamDataAvailable')
    this.game.setOfflineMode()
  }

  videoStreamDataAvailable(data) {
    this.socketManager.send(data)
  }
}