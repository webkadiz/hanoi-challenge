import $ from "jquery"

export default class FirstStageHint {
  constructor(number, emitter) {
    this.emitter = emitter
    this._gameResult = null
    this._number = number
    this._flipButtonElement = $(".flip-btn").eq(number)
    this._cardElement = $(".card").eq(number)
    this._winText = "Перевернуть за 0 баллов"
    this._loseText = "Перевернуть за 1 баллов"
  }

  activate() {
    this.init()

    return this
  }

  reload() {
    this._flipButtonElement.off()
    this.init()
  }

  init() {
    this._gameResult = null
    this.hideFlipButtonElement()
  }

  handleFirstStageGameOver(result) {
    this._gameResult = result

    if (result === "win") {
      this._flipButtonElement.text(this._winText)
    } else if (result === "lose") {
      this._flipButtonElement.text(this._loseText)
    }

    this.setImage()
    this.showFlipButtonElement()
    this.setFlipButtonHandler()
  }

  showFlipButtonElement() {
    this._flipButtonElement.fadeIn(1000)
  }

  hideFlipButtonElement() {
    this._flipButtonElement.fadeOut()
  }

  setFlipButtonHandler() {
    this._flipButtonElement.click(() => {
      this._cardElement.addClass("flip")

      if (this.checkLose()) {
        this.emitter.emit("decreaseScore")
      }
    })
  }

  checkLose() {
    return this._gameResult === "lose"
  }

  setImage() {
    $(".last-stage-img").css(
      "background-image",
      `url(static/${this._number}.jpg)`
    )
  }
}
