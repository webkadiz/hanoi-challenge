import $ from "jquery"
import { float } from "@/common/utils"

export default class Ring {
  constructor() {
    this.isInAnim = false
    this.el = false
    this.appended = false
  }

  createElement() {
    if (this.el) return

    this.el = $('<div class="ring"></div>')[0]
  }

  insertInDocument() {
    if (this.appended) return

    $(".field").append(this.el)
    this.appended = true
  }

  bindJqueryFunctions() {
    this.css = $().css.bind($(this.el))
    this.animateBind = $().animate.bind($(this.el))
  }

  animate(styles, props = {}) {
    this.isInAnim = true
    this.animateBind(styles, {
      complete: () => (this.isInAnim = false),
      ...props,
    })
  }

  shake() {
    const self = this

    this.isInAnim = true

    this.el.classList.add("shake")

    this.el.addEventListener("webkitAnimationEnd", function shake() {
      self.el.classList.remove("shake")
      self.isInAnim = false
      self.el.removeEventListener("webkitAnimationEnd", shake)
    })
  }

  get left() {
    return float(this.css("left"))
  }
  set left(value) {
    return this.css("left", value)
  }

  get bottom() {
    return float(this.css("bottom"))
  }
  set bottom(value) {
    return this.css("bottom", value)
  }

  get width() {
    return float(this.css("width"))
  }
  set width(value) {
    return this.css("width", value)
  }

  get height() {
    return float(this.css("height"))
  }
  set height(value) {
    return this.css("height", value)
  }
}
