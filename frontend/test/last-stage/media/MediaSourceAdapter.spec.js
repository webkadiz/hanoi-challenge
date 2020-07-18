import { assert } from 'chai'
import sinon from 'sinon'
import MediaSourceAdapter from '../../../src/last-stage/modules/media/MediaSourceAdapter'


describe("MediaSourceAdapter", () => {
  let mediaSource, emitter

  beforeEach(() => {
    mediaSource = {
      readyState: 'closed',
      addEventListener() {},
      addSourceBuffer() {}
    }

    emitter = {
      emit() {},
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  it("setSourceOpenHandler", () => {
    // Arrange
    const mediaSourceAdapter = new MediaSourceAdapter(mediaSource, emitter)
    const addEventListenerFake = sinon.fake()
    sinon.replace(mediaSource, 'addEventListener', addEventListenerFake)

    // Act
    mediaSourceAdapter.setSourceOpenHandler()

    // Assert
    assert.ok(addEventListenerFake.calledOnceWithExactly('sourceopen', addEventListenerFake.callback))
  })

  it("Emit sourceOpen event", () => {
    // Arrange
    const mediaSourceAdapter = new MediaSourceAdapter(mediaSource, emitter)
    const addEventListenerFake = sinon.fake()
    const emitFake = sinon.fake()
    sinon.replace(mediaSource, 'addEventListener', addEventListenerFake)
    sinon.replace(mediaSource, 'addSourceBuffer', sinon.fake.returns('sourceBuffer'))
    sinon.replace(emitter, 'emit', emitFake)

    // Act
    mediaSourceAdapter.setSourceOpenHandler()
    addEventListenerFake.callback()

    assert.ok(emitFake.calledOnceWithExactly('sourceOpen', 'sourceBuffer'))
  })

  it("getOriginal must return original media source instance", () => {
    // Arrange
    const mediaSourceAdapter = new MediaSourceAdapter(mediaSource, emitter)
    
    // Act
    const mediaSourceOriginal = mediaSourceAdapter.getOriginal()

    // Assert
    assert.strictEqual(mediaSourceOriginal, mediaSource)
  })

  it("getState must return readyState property of media source instance", () => {
    // Arrange
    const mediaSourceAdapter = new MediaSourceAdapter(mediaSource, emitter)

    // Act
    const state = mediaSourceAdapter.getState()

    // Assert
    assert.equal(state, 'closed')
  })
})