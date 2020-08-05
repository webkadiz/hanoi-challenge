import $ from "jquery"

export default class LastStageGame {
  constructor(gameLogic, emitter) {
    this._gameLogic = gameLogic
    this.emitter = emitter
    this._gameScore = 5

    this._amountFirstStageGames = 4
    this._amountFirstStageGamesOver = 0
    this._secretWord = "время"
    this._gameScreenElement = $(".last-stage")
    this._scoreElement = $(".score")
    this._gameOverScreenElement = $(".game-over-screen")

    this._isKeyboardLock = false
    this._isGameScreenOpen = false
    this.KEY_OPEN = "Enter"
    this.KEY_CLOSE = "Escape"
    this.KEY_REMOVE_LETTER = "Backspace"
  }

  activate() {
    this.emitter.on("increaseScore", this.increaseScore.bind(this))
    this.emitter.on("decreaseScore", this.decreaseScore.bind(this))
    this.emitter.on("keyboardLock", this.keyboardLock.bind(this))
    this.emitter.on("keyboardUnlock", this.keyboardUnlock.bind(this))
    this.emitter.on("gameOver", this.gameOver.bind(this))

    this._gameLogic.activate()
    this.init()
  }

  reload() {
    this._gameOverScreenElement.css("background", "")
    this._scoreElement.removeClass("animation")
    this.init()
    this._gameLogic.reload()
  }

  init() {
    this._gameScore = 5
    this._amountFirstStageGamesOver = 0
    this._isKeyboardLock = false
    this._isGameScreenOpen = false

    this.setKeyupHandler()
    this._gameScreenElement.effect("clip", { mode: "hide" })
  }

  keyboardLock() {
    this._isKeyboardLock = true
  }

  keyboardUnlock() {
    this._isKeyboardLock = false
  }

  setKeyupHandler() {
    $(window).on("keyup", (e) => {
      if (this._isKeyboardLock) return
      const letter = e.key.toLowerCase()

      if (e.key === this.KEY_OPEN) {
        this.openGameScreen()
        this._isGameScreenOpen = true
      } else if (e.key === this.KEY_CLOSE) {
        this.closeGameScreen()
        this._isGameScreenOpen = false
      } else if (e.key === this.KEY_REMOVE_LETTER) {
        if (this._isGameScreenOpen) {
          this._gameLogic.removeLetter()
        }
      } else {
        if (this._isGameScreenOpen && this._gameLogic.isLetter(letter)) {
          this._gameLogic.addLetter(letter)
          this._gameLogic.handleAttempt()
        }
      }
    })
  }

  removeKeyupHandler() {
    $(window).off("keyup")
  }

  openGameScreen() {
    this._gameScreenElement.effect("clip", { mode: "show" })
  }

  closeGameScreen() {
    this._gameScreenElement.effect("clip", { mode: "hide" })
  }

  handleFirstStageGameOver(additionalScore) {
    this.increaseScore(additionalScore)
    this.increaseAmountFirstStageGamesOver()

    if (this.checkAllGamesCompleted()) {
      this.increaseScore()
    }
  }

  increaseScore(value) {
    this._gameScore += value === undefined ? 1 : value
  }

  decreaseScore(value) {
    this._gameScore -= value === undefined ? 1 : value
  }

  increaseAmountFirstStageGamesOver() {
    this._amountFirstStageGamesOver += 1
  }

  checkAllGamesCompleted() {
    return this._amountFirstStageGamesOver === this._amountFirstStageGames
  }

  gameOver() {
    this.removeKeyupHandler()

    setTimeout(() => {
      this.gradientAnimation()

      setTimeout(() => {
        this._scoreElement.text(this._gameScore)
        this._scoreElement.addClass("animation")

        setTimeout(() => {
          this.emitter.emit("fireworkLaunch")
        }, 4500)
      }, 4000)
    }, 1000)
  }

  gradientAnimation() {
    let iter = 0

    const interval = setInterval(() => {
      if (iter <= 200) {
        this._gameOverScreenElement.css(
          "background",
          `radial-gradient(transparent ${100 - iter}%, black 100%)`
        )
      } else if (iter <= 400) {
        this._gameOverScreenElement.css(
          "background",
          `radial-gradient(transparent -100%, black ${100 - iter + 200}%)`
        )
      } else {
        clearInterval(interval)
      }

      iter++
    }, 10)
  }
}
