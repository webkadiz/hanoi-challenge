export default class EventEmitterError extends Error {
  constructor(message) {
    super(message)
    this.name = "EventEmitterError"
  }
}