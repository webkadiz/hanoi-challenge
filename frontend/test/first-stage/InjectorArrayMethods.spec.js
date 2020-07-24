import { assert } from "chai"
import InjectorArrayMethods from "@/first-stage/classes/InjectorArrayMethods"

describe("InjectorArrayMethods", () => {
  const injectorArrayMethods = new InjectorArrayMethods()
  injectorArrayMethods.inject()

  it("inject functions", () => {
    assert.isFunction([].shiftLeft)
    assert.isFunction([].shiftRight)
  })

  it("test work of injected functions", () => {
    debugger
    assert.deepEqual([1, 2, 3].shiftLeft(), [2, 3, 0])
    assert.deepEqual([1, 2, 3].shiftRight(), [0, 1, 2])
  })
})
