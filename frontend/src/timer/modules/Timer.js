import $ from "jquery"

export default class Timer {
  constructor(socket) {
    this.socket = socket
    this.timerElement = $(".timer")
    this.beginTime = this.timerElement.attr("data-time")
    this.timer = null
    this.inWork = false
  }

  init() {
    this.timerElement.text(this.strFromTime(this.beginTime))
  }

  start() {
    if (this.inWork) return

    let curTime = this.beginTime
    this.inWork = true
    
    this.timer = setInterval(() => {
      curTime -= 1
      const strTime = this.strFromTime(curTime)
      this.timerElement.text(strTime)

      if (curTime <= 0) {
        this.clear()
        this.socket.send("stop")
      }
    }, 1000)
  }

  reload() {
    this.clear()
    this.init()
  }

  clear() {
    clearInterval(this.timer)
    this.inWork = false
  }

  strFromTime(time) {
    let str = ""
    const minute = ~~(time / 60)
    const second = time % 60

    if (time < 0) {
      time = Math.abs(time)
      str = "-"
    }

    str += `${~~(minute / 10)}${minute % 10}:${~~(second / 10)}${second % 10}`
    return str
  }
}
