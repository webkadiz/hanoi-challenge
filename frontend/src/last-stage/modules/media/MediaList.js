export default class MediaList {
  constructor() {
    this._list = []
  }

  insert(idx, mediaContainer) {
    this._list[idx] = mediaContainer
  }

  eq(idx) {
    return this._list[idx]
  }
}