import {assert} from 'chai'
import Ring from '../../src/first-stage/classes/Ring'
import $ from 'jquery'

describe('Ring', () => {
  let ring

  before(() => {
    $('body').append('<div class="field"></div>')
  })

  beforeEach(() => {
    ring = new Ring()
  })

  it("createElement", () => {
    ring.createElement()

    assert.instanceOf(ring.el, HTMLDivElement)
    assert.equal(ring.el.className, 'ring')
  })

  it("insertInDocument", () => {
    ring.createElement()
    ring.insertInDocument()

    assert.equal($('.field').children().length, 1)

    ring.createElement()
    ring.insertInDocument()

    assert.equal($('.field').children().length, 1)
  })
})