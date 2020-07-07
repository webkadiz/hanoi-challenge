import $ from 'jquery'
import { range, float } from '@/common/utils'
import Ring from './Ring'
import ActiveRing from './ActiveRing'
import GameMap from './GameMap'
import Rod from './Rod'

export default class Game {

	constructor(levelManager, emitter) {
		this.amountRings = -1
		this.emitter = emitter
		this.levelManager = levelManager
		this.map = new GameMap()
		this.activeRing = new ActiveRing()
		this.rodContainer = Array(3).fill(0)

		
		this.baseWidthRing = 140 // px
		this.baseHeightRing = 35 // px
		this.increaseWidthRing = 70 // px

		this.glowWidth = this.baseWidthRing - 20
		this.rodWidth = 43 // px
		this.marginRodEdge = 20 // px
		this.rodIndex = 0
		this.rememberRodIndex = 0

		this.edgeMargin = -1
		this.maxWidthRing = -1
		this.ableWidthForRods = -1
		this.score = -1
		this.bestScore = -1
		this.isGameOver = false
	}


	createLevelScreen() {
		this.levelManager.createScreen(this)
	}

	setGameLevelHandler() {
		this.emitter.on("setGameLevel", gameLevel => {
			this.setLevel(gameLevel)
		})
	}

	setLevel(gameLevel) {
		this.amountRings = gameLevel

		this.computeValuesDependOnAmountRings()

		this.fillRodContainer()

		this.computeDimensionsGlow()

		this.setRodsLeft()

		this.createRings()

		this.initScore()

		this.initBestScore()

		this.setReserveStartGame()
	}


	computeValuesDependOnAmountRings() {
		const floorWidth = this.map.floor.width()

		this.maxWidthRing = this.increaseWidthRing * this.amountRings + this.baseWidthRing
		this.edgeMargin = this.maxWidthRing / 2 + this.marginRodEdge
		this.ableWidthForRods = (floorWidth - this.edgeMargin * 2) / 2
	}



	fillRodContainer() {
		for (const i of range(3)) {
			this.rodContainer[i] = new Rod(this.amountRings)
		}
	}

	computeDimensionsGlow() {
		for (const i of range(3)) {
			console.log('for')
			console.log(this.map.glows)
			this.map.glows.eq(i).css('width', this.glowWidth)
			this.map.glows.eq(i).css('height', this.baseHeightRing * this.amountRings + 100)
			this.map.glows.eq(i).css('left', -this.glowWidth / 2 + this.rodWidth / 2)

		}

		this.map.glows.eq(0).addClass('active')
	}

	setRodsLeft() {
		for (const i of range(3)) {
			this.map.rods.eq(i).css('left', this.edgeMargin + i * this.ableWidthForRods - this.rodWidth / 2)
		}
	}

	createRings() {
		for(const i of range(this.amountRings - 1, -1, -1)) {
			
			const ring = new Ring()

			ring.createElement()
			ring.insertInDocument()
			ring.bindJqueryFunctions()

			ring.width = this.baseWidthRing + this.increaseWidthRing * i
			ring.left = this.edgeMargin - ring.width / 2
			ring.bottom = (this.amountRings - i - 1) * this.baseHeightRing
			ring.height = this.baseHeightRing

			this.rodContainer[this.rodIndex].push(ring)
		}

	}

	initScore() {
		this.score = 0
		this.map.score.text(this.score)
	}

	initBestScore() {
		this.bestScore = 2 ** this.amountRings - 1
		this.map.bestScore.text(this.bestScore)
	}


	increaseScore() {
		if (this.rodIndex !== this.rememberRodIndex) {
			this.score += 1
			this.map.score.text(this.score)
		}
	}

	increaseRodIndex() {
		this.map.glows.eq(this.rodIndex).removeClass('active')

		this.rodIndex = this.rodIndex === 2 ? 2 : this.rodIndex + 1

		console.log(this.map.glows.eq(this.rodIndex))

		this.map.glows.eq(this.rodIndex).addClass('active')
	}

	decreaseRodIndex() {
		this.map.glows.eq(this.rodIndex).removeClass('active')

		this.rodIndex = this.rodIndex === 0 ? 0 : this.rodIndex - 1

		this.map.glows.eq(this.rodIndex).addClass('active')
	}

	getAdditionalScore() {
		return this.score === this.bestScore ? 1 : 0
	}

	setReserveStartGame() {
		const self = this

		$(window).on('keyup', function handleKeyUp(e) {
			if (e.ctrlKey && e.shiftKey && e.key === 'F12') {
				self.startGame()
				$(window).off('keyup', handleKeyUp)
			}
		})
	}


	startGame() {
		this.map.overlay.effect('blind', {}, 2000, () => {
			$(window).on('keyup', this.handleControl.bind(this))
		})
	}


	stopGame() {
		this.gameOver('lose')
	}

	gameOver(result) {
		if (this.isGameOver) return

		const additionalScore = this.getAdditionalScore()

		$(window).off('keyup')

		$(`.${result}`).addClass('active')
		
		this.emitter.emit("gameOver", {
			gameOver: result,
			additionalScore
		})

		this.gameOver = true
	}

	checkVictory() {
		if (this.rodContainer[2].isFull()) {
			this.gameOver('win')
		}
		
	}

	handleControl(e) {
		const UP = e.key === 'w' || e.key === 'ArrowUp'
		const RIGHT = e.key === 'd' || e.key === 'ArrowRight'
		const DOWN = e.key === 's' || e.key === 'ArrowDown'
		const LEFT = e.key === 'a' || e.key === 'ArrowLeft'


		if (this.activeRing.get().isInAnim) return

		if (UP) {

			if (this.activeRing.empty() && this.rodContainer[this.rodIndex].top()) {

				this.activeRing.set(this.rodContainer[this.rodIndex].pop())

				this.activeRing.get().animate({'bottom': this.map.field.height()})

				this.rememberRodIndex = this.rodIndex
			}

		} else if (DOWN) {
			const topRing = this.rodContainer[this.rodIndex].top()


			if (this.activeRing.exists()) {

				if (topRing && topRing.width < this.activeRing.get().width) {
					this.activeRing.get().shake()
					return
				}

				if (topRing) {

					this.activeRing.get().animate({'bottom': topRing.bottom + topRing.height})

				} else {

					this.activeRing.get().animate({'bottom': 0})

				}


				this.rodContainer[this.rodIndex].push(this.activeRing.get())
				this.activeRing.unset()
				this.increaseScore()
				this.checkVictory()
			}

		} else if (RIGHT) {

			if (this.activeRing.exists()) {
				let rightRodOffset = float(this.map.rods.eq(2).css('left'))
				let rightRingOffset = float(this.activeRing.get().css('left'))


				if (rightRingOffset + this.ableWidthForRods < rightRodOffset) {
					this.activeRing.get().animate({'left': rightRingOffset + this.ableWidthForRods})
				}
			} else {

			}

			this.increaseRodIndex()
		} else if (LEFT) {

			if (this.activeRing.exists()) {
				let leftRodOffset = float(this.map.rods.eq(0).css('left'))
				
				let leftRingOffset = float(this.activeRing.get().css('left'))


				if (leftRingOffset - this.ableWidthForRods + this.activeRing.get().width / 2 > leftRodOffset) {
					this.activeRing.get().animate({'left': leftRingOffset - this.ableWidthForRods})
				}
			}

			this.decreaseRodIndex()		
		}
	}

}