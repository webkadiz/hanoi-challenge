import $ from 'jquery'

export default class MediaReceiver {
  constructor() {
    this.videoEl = null
  }

  prepareVideoEl() {
    const videoEl = this._findVideoEl()
    this._setVideoEl(videoEl)
    this._makeUsable()
    this._makeMuted()
  }

  attachSrcObject(srcObject) {  
    if (this.videoEl === null) throw new Error("Video element does not set")
    this.videoEl.attr("src", srcObject)
  }

  playVideo() {
    if (this.videoEl === null) throw new Error("Video element does not set")
    this.videoEl.get(0).play()
  }

  _findVideoEl() {
    return $('video').filter(function() {
      return $(this).data('used') !== true
    }).eq(0)
  }

  _setVideoEl(videoEl) {
    this.videoEl = videoEl
  }

  _makeUsable() {
    this.videoEl.data('used', true)
  }

  _makeMuted() {
    this.videoEl.attr('muted', true)
  }
}