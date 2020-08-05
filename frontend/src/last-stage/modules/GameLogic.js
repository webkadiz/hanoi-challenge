import $ from "jquery"
import { range } from "@/common/utils"

export default class GameLogic {
  constructor(emitter) {
    this.emitter = emitter
    this._secretWord = "время"
    this._amountAttempts = null
    this._amountAttemptsElement = $(".last-stage-attempts__amount")
    this._letterInputElements = Array.from(
      document.querySelectorAll(".last-stage-input__item")
    )
    this._wordInputElement = $(".last-stage-input")
  }

  activate() {
    this.init()
  }

  reload() {
    this.init()
  }

  init() {
    this.initAttempts()
    this.printAttempts()
    this.zeroingLetterInputElements()
  }

  initAttempts() {
    this._amountAttempts = 10
  }

  decreaseAttempts() {
    this._amountAttempts -= 1
  }

  getAmountAttempts() {
    return this._amountAttempts
  }

  printAttempts() {
    this._amountAttemptsElement.text(this._amountAttempts)
  }

  handleAttempt() {
    const lastLetterInput = this._letterInputElements[
      this._letterInputElements.length - 1
    ]

    if (lastLetterInput.textContent) {
      this.decreaseAttempts()
      this.printAttempts()

      const word = this._letterInputElements.reduce(
        (prev, cur) => (prev += cur.textContent),
        ""
      )

      if (this.checkWinGame(word)) {
        this.emitter.emit("gameOver")
      } else {
        this.loseAttempt()
      }
    }
  }

  loseAttempt() {
    this._wordInputElement.addClass("lose-attempt")
    this.emitter.emit("keyboardLock")

    this._wordInputElement.on("webkitAnimationEnd", () => {
      this._wordInputElement.removeClass("lose-attempt")
      this._wordInputElement.off("webkitAnimationEnd")

      this.emitter.emit("keyboardUnlock")

      this.zeroingLetterInputElements()

      if (this.checkFailGame()) {
        this.emitter.emit("gameOver")
      }
    })
  }

  zeroingLetterInputElements() {
    this._letterInputElements.forEach((input) => (input.textContent = ""))
  }

  checkWinGame(word) {
    return word === this._secretWord
  }

  checkFailGame() {
    return this._amountAttempts === 0
  }

  isLetter(letter) {
    return ~"абвгдеёжзийклмнопрстучфцхшщьъыюяэ".indexOf(letter)
  }

  addLetter(letter) {
    for (const letterInput of this._letterInputElements) {
      if (!letterInput.textContent) {
        letterInput.textContent = letter
        return
      }
    }
  }

  removeLetter() {
    for (const i of range(this._letterInputElements.length - 1, -1, -1)) {
      if (this._letterInputElements[i].textContent) {
        this._letterInputElements[i].textContent = ""
        return
      }
    }
  }
}
