import { assert } from 'chai'
import sinon from 'sinon'
import MediaSourceBuffer from '../../../src/last-stage/modules/media/MediaSourceBuffer'

describe("MediaSourceBuffer", () => {
  let mediaQueue, sourceBuffer

  beforeEach(() => {
    mediaQueue = {
      enqueue() {},
      dequeue() {},
      isEmpty() {},
      isNotEmpty() {},
    }

    sourceBuffer = {
      updating: false,
      appendBuffer() {},
      addEventListener() {},
    }
  })

  it("Call appendBuffer without source buffer", () => {
    // Arrange 
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const appendBufferSpy = sinon.spy(mediaSourceBuffer, 'appendBuffer')
    
    // Act
    try {
      mediaSourceBuffer.appendBuffer([1, 2, 3], "open")
    } catch (e) {}

    // Assert
    assert.ok(appendBufferSpy.threw())
  })

  it("appendBuffer with not empty queue", () => {
    // Arrange 
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const enqueueSpy = sinon.spy(mediaQueue, 'enqueue')
    sinon.replace(mediaQueue, 'isNotEmpty', sinon.fake.returns(true))
    sinon.replace(sourceBuffer, 'updating', false)
    
    // Act
    mediaSourceBuffer.setSourceBuffer(sourceBuffer)
    mediaSourceBuffer.appendBuffer([1,2,3], "open")
    
    // Assert
    assert.ok(enqueueSpy.calledOnce)
  })

  it("appendBuffer with updating true", () => {
    // Arrange 
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const enqueueSpy = sinon.spy(mediaQueue, "enqueue")
    sinon.replace(mediaQueue, 'isNotEmpty', sinon.fake.returns(false))
    sinon.replace(sourceBuffer, 'updating', true)
    
    // Act
    mediaSourceBuffer.setSourceBuffer(sourceBuffer)
    mediaSourceBuffer.appendBuffer([1,2,3], "open")
    
    // Assert
    assert.ok(enqueueSpy.calledOnce)
  })

  it("appendBuffer with closed media source", () => {
    // Arrange 
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const enqueueSpy = sinon.spy(mediaQueue, "enqueue")
    sinon.replace(mediaQueue, 'isNotEmpty', sinon.fake.returns(false))
    sinon.replace(sourceBuffer, 'updating', false)
 
    // Act
    mediaSourceBuffer.setSourceBuffer(sourceBuffer)
    mediaSourceBuffer.appendBuffer([1,2,3], "closed")
    
    // Assert
    assert(enqueueSpy.calledOnce)
  })

  it("appendBuffer with empty queue, not updating, with open media source", () => {
    // Arrange 
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const enqueueSpy = sinon.spy(mediaQueue, "enqueue")
    const appendsBufferSpy = sinon.spy(sourceBuffer, "appendBuffer")
    sinon.replace(mediaQueue, 'isNotEmpty', sinon.fake.returns(false))
    sinon.replace(sourceBuffer, 'updating', false)

    // Act
    mediaSourceBuffer.setSourceBuffer(sourceBuffer)
    mediaSourceBuffer.appendBuffer([1,2,3], "open")
    
    // Assert
    assert.ok(enqueueSpy.notCalled)
    assert.ok(appendsBufferSpy.calledOnce)
  })

  it("setUpdateHandler", () => {
    // Arrange
    const mediaSourceBuffer = new MediaSourceBuffer(mediaQueue)
    const sourceBufferAddEventListenerFake = 
      sinon.replace(sourceBuffer, "addEventListener", sinon.fake())
    sinon

    // Act
    mediaSourceBuffer.setSourceBuffer(sourceBuffer)
    mediaSourceBuffer.setUpdateHandler()

    // Assert
    assert.ok(sourceBufferAddEventListenerFake.calledOnce)
    assert.ok(sourceBufferAddEventListenerFake.
      calledWithExactly("updateend", sourceBufferAddEventListenerFake.callback)
    )
  })
})