import {
  init as fireworkInit,
  reload as fireworkReload,
} from "./firework/firework"
import $ from "jquery"

export default class FireworkAdapter {
  constructor() {
    this._fireworkContainerElement = $(".container")
  }

  prepare() {
    this._fireworkContainerElement.hide()
  }

  reload() {
    fireworkReload()
    this.prepare()
  }

  launch() {
    this._fireworkContainerElement.show()
    fireworkInit()
  }
}
