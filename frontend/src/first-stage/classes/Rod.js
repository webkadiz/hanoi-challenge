export default class Rod {
	constructor(amountRings) {
		this.rings = Array(amountRings).fill(0)
	}

	push(ring) {
		if (this.rings.every(Boolean)) return

		this.rings.shiftRight()
		this.rings[0] = ring
	}

	pop() {
		const topRing = this.rings[0]

		this.rings.shiftLeft()

		return topRing
	}

	top() {
		return this.rings[0]
	}

	len() {
		return this.rings.length
	}

	isFull() {
		return this.rings.every(Boolean)
	}
}