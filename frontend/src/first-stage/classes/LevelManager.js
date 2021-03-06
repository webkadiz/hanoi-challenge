import $ from "jquery"

export default class LevelManager {
  constructor(screen, gameLevels, emitter) {
    this.gameLevels = gameLevels
    this.gameLevelIndex = -1
    this.emitter = emitter
    this.screen = screen
  }

  createScreen() {
    this.gameLevels.forEach((level, i) =>
      this.screen.append(this.createCeil(i))
    )
  }

  createCeil(gameLevelIndex) {
    const gameLevelNumber = this.calcIndexNumber(gameLevelIndex)
    const ceil = $(`<div class="level-ceil">${gameLevelNumber}</div>`)

    ceil.click(() => {
      this.gameLevelIndex = gameLevelIndex

      this.hideScreen()

      this.setGameLevel()
    })

    return ceil
  }

  calcIndexNumber(gameLevelIndex) {
    return gameLevelIndex + 1
  }

  getGameLevel() {
    return this.gameLevels[this.gameLevelIndex]
  }

  setGameLevel() {
    this.emitter.emit("setGameLevel", this.getGameLevel())
  }

  hideScreen() {
    this.screen.hide()
  }

  showScreen() {
    this.screen.show()
  }
}
