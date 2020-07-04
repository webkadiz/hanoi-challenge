import $ from 'jquery'

export default class LevelManager {
	constructor(emitter, screen) {
		this.gameLevels = [3, 3, 4, 4, 2]
		this.gameLevelIndex = -1
		this.emitter = emitter
		this.screen = screen
	}


	createScreen() {

		this.gameLevels.forEach((level, i) => this.screen.append(this.createCeil(i)))

	}	

	createCeil(gameLevelIndex) {
		const ceil = $(`<div class="level-ceil">${gameLevelIndex + 1}</div>`)

		ceil.click(() => {
			this.gameLevelIndex = gameLevelIndex

			this.screen.hide()

			this.setGameLevel()
		})

		return ceil
	}

	getGameLevel() {
		return this.gameLevels[this.gameLevelIndex]
	}

	setGameLevel() {

		emitter.emit('setLevel', this.getGameLevel())

	}


}