import { range } from '@/common/utils'

Object.defineProperty(Array.prototype, 'shiftLeft', {
	value() {

		for (const i of range(1, this.length)) 
			this[i - 1] = this[i]
		
		this[this.length - 1] = 0
		
		return this
	}
})

Object.defineProperty(Array.prototype, 'shiftRight', {
	value() {
		for (const i of range(this.length - 2, -1, -1))
			this[i + 1] = this[i]
		
		this[0] = 0
		
		return this
	}
})