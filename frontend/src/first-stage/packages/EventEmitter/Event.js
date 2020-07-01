export default class Event {
  constructor(eventName, listenersStore) {
    this._eventName = eventName;
    this._listenersStore = listenersStore;
  }

  create() {
    this._listenersStore.create()
    return this
  }

  addListener(listener) {
    this._listenersStore.add(listener);
  }

  removeAllListener() {
    this._listenersStore.clear();
  }

  removeListener(listener) {
    if (this._listenersStore.get(listener)) {
      this._listenersStore.remove(listener);
      return true;
    } else {
      return false;
    }
  }

  emit(payload) {
    for(const listener of this._listenersStore.getAll()) {
      listener(payload)
    }
    
    return true
  }

  listenersCount() {
    return this._listenersStore.length()
  }
}
