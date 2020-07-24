import { assert } from "chai"
import sinon from "sinon"
import MediaQueue from "../../../src/last-stage/modules/media/MediaQueue"

describe("MediaQueue ", () => {
  it("Standard flow", () => {
    // Arrange
    const mediaQueue = new MediaQueue()

    // Act
    mediaQueue.enqueue(1)
    mediaQueue.enqueue(2)

    // Assert
    assert.equal(mediaQueue.dequeue(), 1)
  })

  it("dequeuq without enqueue before", () => {
    // Arrange
    const mediaQueue = new MediaQueue()
    const dequeueSpy = sinon.spy(mediaQueue, "dequeue")

    // Act
    try {
      mediaQueue.dequeue()
    } catch (e) {}

    // Assert
    assert.ok(dequeueSpy.threw("Error"))
  })

  it("isEmpty - true", () => {
    // Arrange
    const mediaQueue = new MediaQueue()

    // Act
    const isEmpty = mediaQueue.isEmpty()

    // Assert
    assert.isTrue(isEmpty)
  })

  it("isEmpty - false", () => {
    // Arrange
    const mediaQueue = new MediaQueue()

    // Act
    mediaQueue.enqueue(1)
    const isEmpty = mediaQueue.isEmpty()

    // Assert
    assert.isFalse(isEmpty)
  })

  it("isNotEmpty - false", () => {
    // Arrange
    const mediaQueue = new MediaQueue()

    // Act
    const isNotEmpty = mediaQueue.isNotEmpty()

    // Assert
    assert.isFalse(isNotEmpty)
  })

  it("isNotEmpty - true", () => {
    // Arrange
    const mediaQueue = new MediaQueue()

    // Act
    mediaQueue.enqueue(1)
    const isNotEmpty = mediaQueue.isNotEmpty()

    // Assert
    assert.isTrue(isNotEmpty)
  })
})
