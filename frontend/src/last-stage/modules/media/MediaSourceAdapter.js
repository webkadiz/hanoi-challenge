export default class MediaSourceAdapter {
  constructor(mediaSource, emitter) {
    this.mediaSource = mediaSource
    this.emitter = emitter
    this.mimeCodec = "video/webm;codecs=vp8"
  }

  setSourceOpenHandler() {
    this.mediaSource.addEventListener("sourceopen", () => {
      const sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeCodec)
      this.emitter.emit("sourceOpen", sourceBuffer)
    })
  }

  getOriginal() {
    return this.mediaSource
  }

  getState() {
    return this.mediaSource.readyState
  }
}
