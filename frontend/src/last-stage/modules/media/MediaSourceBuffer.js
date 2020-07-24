export default class MediaSourceBuffer {
  constructor(mediaQueue) {
    this.mediaQueue = mediaQueue
    this.sourceBuffer = null
  }

  setSourceBuffer(sourceBuffer) {
    this.sourceBuffer = sourceBuffer
  }

  setUpdateHandler() {
    this.sourceBuffer.addEventListener("updateend", () => {
      if (this.mediaQueue.isNotEmpty()) {
        this.sourceBuffer.appendBuffer(this.mediaQueue.dequeue())
      }
    })
  }

  appendBuffer(buffer, mediaSourceState) {
    if (this.sourceBuffer === null) throw new Error("should set source buffer")

    buffer = this._prepareBuffer(buffer)

    if (
      this.sourceBuffer.updating ||
      mediaSourceState != "open" ||
      this.mediaQueue.isNotEmpty()
    ) {
      this.mediaQueue.enqueue(buffer)
    } else {
      this.sourceBuffer.appendBuffer(buffer)
    }
  }

  _prepareBuffer(buffer) {
    return new Uint8Array(buffer)
  }
}
