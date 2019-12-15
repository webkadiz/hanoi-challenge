import './index.scss'
import $ from 'jquery'

import '@modules/init'
import { range, print, float } from '@modules/utils'


const amountRings = 3
const baseWidthRing = 100 // px
const baseHeightRing = 25 // px
const increaseWidthRing = 40 // px
const maxWidthRing = increaseWidthRing * amountRings + baseWidthRing // px


const rodWidth = 25 // px
const marginRodEdge = 20 // px

let rodIndex = 0


const topRings = [] // table amountRings X amountRods

for (const i of range(3)) {
	topRings[i] = Array(amountRings).fill(0)
}

const floor = $('.floor')
const rods = $('.rod')
const field = $('.field')

const score = $('.score')
const bestScore = $('.best-score')


let rememberRodIndex = 0

bestScore.text(2 ** amountRings - 1)
score.text(0)

let activeRing


let edgeMargin = 0
let ableWidthForRods = 0


class Ring {
	isInAnim = false
	
	constructor() {

	}

	createElement() {
		this.el = $('<div class="ring"></div>')[0]
	}

	insertInDocument() {
		$('.field').append(this.el)
	}

	bindJqueryFunctions() {
		this.css = $().css.bind($(this.el))
		this.animateBind = $().animate.bind($(this.el))
	}

	animate(styles, props = {}) {
		this.isInAnim = true
		this.animateBind(styles, {
			complete: () => this.isInAnim = false,
			...props
		})
	}


	get left() {
		return float(this.css('left'))
	}
	set left(value) {
		return this.css('left', value)
	}

	get bottom() {
		return float(this.css('bottom'))
	}
	set bottom(value) {
		return this.css('bottom', value)
	}

	get width() {
		return float(this.css('width'))
	}
	set width(value) {
		return this.css('width', value)
	}

	get height() {
		return float(this.css('height'))
	}
	set height(value) {
		return this.css('height', value)
	}
}

class ActiveRing {
	ring = false

	get() {
		return this.ring
	}

	set(ring) {
		if (ring instanceof Ring) {
			this.ring = ring
		} else {
			throw new Error('ring mus be instance of Ring')
		}
	}

	exists() {
		return this.ring !== false
	}

	empty() {
		return this.ring === false
	}

	unset() {
		this.ring = false
	}
}


function initGameMap() {
	
	activeRing = new ActiveRing()

	const floorWidth = floor.width()

	edgeMargin = maxWidthRing / 2 + marginRodEdge
	ableWidthForRods = (floorWidth - edgeMargin * 2) / 2


	for (const i of range(3)) {
		rods.eq(i).css('left', edgeMargin + i * ableWidthForRods - rodWidth / 2)
	}

	for(const i of range(amountRings)) {
		
		const ring = new Ring()

		ring.createElement()
		ring.insertInDocument()
		ring.bindJqueryFunctions()

		ring.width = baseWidthRing + increaseWidthRing * i
		ring.left = edgeMargin - ring.width / 2
		ring.bottom = (amountRings - i - 1) * baseHeightRing
		ring.height = baseHeightRing

		topRings[rodIndex][i] = ring
	}


}


function increaseScore() {
	if (rodIndex !== rememberRodIndex) {
		score.text(Number(score.text()) + 1)
	}
}

$(window).on('keyup', e => {
	const UP = e.key === 'w' || e.key === 'ArrowUp'
	const RIGHT = e.key === 'd' || e.key === 'ArrowRight'
	const DOWN = e.key === 's' || e.key === 'ArrowDown'
	const LEFT = e.key === 'a' || e.key === 'ArrowLeft'


	if (activeRing.get().isInAnim) return

	if (UP) {

		if (activeRing.empty() && topRings[rodIndex][0]) {

			activeRing.set(topRings[rodIndex][0])
			topRings[rodIndex].shiftLeft()

			activeRing.get().animate({'bottom': field.height() - baseHeightRing})

			rememberRodIndex = rodIndex
		}
	} else if (DOWN) {
		let topRing = topRings[rodIndex][0]

		if (activeRing.exists()) {
			if (topRing) {
				if (topRing.width > activeRing.get().width) {

					activeRing.get().animate({'bottom': topRing.bottom + topRing.height})
					topRings[rodIndex].shiftRight()
					topRings[rodIndex][0] = activeRing.get()
					activeRing.unset()
					increaseScore()
				} else {

				}
			} else {

				activeRing.get().animate({'bottom': 0})
				topRings[rodIndex][0] = activeRing.get()
				activeRing.unset()
				increaseScore()

			}
		}


	} else if (RIGHT) {

		if (activeRing.exists()) {
			let rightRodOffset = float(rods.eq(2).css('left'))
			let rightRingOffset = float(activeRing.get().css('left'))


			if (rightRingOffset + ableWidthForRods < rightRodOffset) {
				activeRing.get().animate({'left': rightRingOffset + ableWidthForRods})
			}
		} else {

		}

		rodIndex = rodIndex === 2 ? 2 : rodIndex + 1
	} else if (LEFT) {

		if (activeRing.exists()) {
			let leftRodOffset = float(rods.eq(0).css('left'))
			
			let leftRingOffset = float(activeRing.get().css('left'))


			if (leftRingOffset - ableWidthForRods + activeRing.get().width / 2 > leftRodOffset) {
				activeRing.get().animate({'left': leftRingOffset - ableWidthForRods})
			}
		}

		rodIndex = rodIndex === 0 ? 0 : rodIndex - 1		
	}

})


initGameMap()