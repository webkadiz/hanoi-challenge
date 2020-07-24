export default class VideoStreamManager {
  constructor(emitter) {
    this.emitter = emitter
  }

  init() {
    navigator.mediaDevices
      .getDisplayMedia({ video: { width: 640, height: 360, frameRate: 10 } })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = (e) => {
          if (this.emitter.listenersCount("videoStreamDataAvailable")) {
            this.emitter.emit("videoStreamDataAvailable", e.data)
          } else {
            recorder.ondataavailable = null
            recorder.stop()
          }
        }

        recorder.start(1000)
      })
      .catch((err) => {
        this.emitter.emit("videoStreamBlock", err)
      })
  }
}
