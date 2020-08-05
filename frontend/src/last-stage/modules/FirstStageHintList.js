import { range } from "@/common/utils"
import FirstStageHint from "./FirstStageHint"

export default class FirstStageHintList {
  constructor(emitter) {
    this.emitter = emitter
    this._amountHints = 4
    this._list = []
  }

  reload() {
    for (const hint of this._list) {
      hint.reload()
    }
  }

  fill() {
    for (const number of range(this._amountHints)) {
      this._list[number] = new FirstStageHint(number, this.emitter).activate()
    }
  }

  eq(idx) {
    return this._list[idx]
  }
}
