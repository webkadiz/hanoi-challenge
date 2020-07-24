export default class MediaQueue {
  constructor() {
    this._queue = []
  }

  enqueue(item) {
    this._queue.push(item)
  }

  dequeue(item) {
    if (this.isEmpty()) throw new Error("queue is empty")

    return this._queue.shift()
  }

  isEmpty() {
    return this._queue.length === 0
  }

  isNotEmpty() {
    return !this.isEmpty()
  }
}
