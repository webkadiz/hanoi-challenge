import EventEmitterError from "./EventEmitterError"


const EMIT_WITH_NO_LISTENERS = `There is  no listeners for this event`
const INCORRECT_EVENT_NAME_TYPE_AND_LISTENER_TYPE =
    "Event name must be a string and listener must be a function"
const INCORRECT_LISTENER_TYPE = "Listener must be a function"
const INCORRECT_EVENT_NAME_TYPE = "Event name must be a string"
const EMIT_WITH_MORE_PAYLOAD = "Emit expects 2 parameters: eventName, payload"


class EventEmitter {
  constructor(event) {
    this._event = event
    this._eventsStore = {}
  }

  on(eventName, listener) {
    this._throwErrorIfEventNameInValid(eventName)
    this._throwErrorIfListenerInValid(listener)

    if (!this._eventIsExists(eventName))
      this._createEvent(eventName)
    
    const curEvent = this._getEvent(eventName)

    curEvent.addListener(listener)
  }

  off(eventName, listener) {
    this._throwErrorIfEventNameInValid(eventName)

    if (!this._eventIsExists(eventName)) return true

    const event = this._getEvent(eventName)

    if (this._listenerIsEmpty(listener)) {
      event.removeAllListeners()
      return true
    } else {
      this._throwErrorIfListenerInValid(listener)
      const resRemoving = event.removeListener(listener)
      return resRemoving
    }
  }

  emit(eventName, payload) {
    this._throwErrorIfEventNameInValid(eventName)

    if (!this._eventIsExists(eventName)) return true

    const event = this._getEvent(eventName)

    return event.emit(payload)
  }

  _throwErrorIfEventNameInValid(eventName) {
    if (this._eventNameIsValid(eventName)) return
    else throw new EventEmitterError(INCORRECT_EVENT_NAME_TYPE)
  }

  _throwErrorIfListenerInValid(listener) {
    if (this._listenerIsValid(listener)) return
    else throw new EventEmitterError(INCORRECT_LISTENER_TYPE)
  }

  _eventNameIsValid(eventName) {
    if (typeof eventName === "string") return true
    else return false;
  }

  _listenerIsValid(listener) {
    if (typeof listener === "function") return true
    else return false
  }

  _eventIsExists(eventName) {
    if (this._eventsStore[eventName]) return true
    else return false
  }

  _createEvent(eventName) {
    this._eventsStore[eventName] = new this._event(eventName).create()
  }

  _getEvent(eventName) {
    return this._eventsStore[eventName]
  }

  _listenerIsEmpty(listener) {
    return listener === undefined ? true : false
  }
}

export { EventEmitter };
