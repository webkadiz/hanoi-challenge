export default class MediaContainer {
  constructor(mediaReceiver, mediaSourceAdapter, mediaSourceBuffer, emitter) {
    this.mediaReceiver = mediaReceiver
    this.mediaSourceAdapter = mediaSourceAdapter
    this.mediaSourceBuffer = mediaSourceBuffer
    this.emitter = emitter
    this.srcObject = null
  }

  init() {
    this.mediaReceiver.prepareVideoEl()
    this.mediaSourceAdapter.setSourceOpenHandler()
    this._setSourceOpenHandler()

    this._createSrcObject()
    this._attachSrcObjectToMediaReceiver()

    this.mediaReceiver.playVideo()
  }

  appendBufferToMediaSourceBuffer(buffer) {
    if (!Array.isArray(buffer)) throw new Error("Buffer must be an array")
    if (this.mediaReceiver.isPaused()) {
      this.mediaReceiver.playVideo()
    }

    this.mediaSourceBuffer.appendBuffer(
      buffer,
      this.mediaSourceAdapter.getState()
    )
  }

  _setSourceOpenHandler() {
    this.emitter.on("sourceOpen", (sourceBuffer) => {
      this.mediaSourceBuffer.setSourceBuffer(sourceBuffer)
      this.mediaSourceBuffer.setUpdateHandler()
    })
  }

  _createSrcObject() {
    this.srcObject = URL.createObjectURL(this.mediaSourceAdapter.getOriginal())
  }

  _attachSrcObjectToMediaReceiver() {
    this.mediaReceiver.attachSrcObject(this.srcObject)
  }
}
