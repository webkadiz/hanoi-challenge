import { assert } from "chai"
import sinon from "sinon"
import $ from "jquery"
import MediaReceiver from "../../../src/last-stage/modules/media/MediaReceiver"

describe("MediaReveiver", () => {
  beforeEach(() => {
    $("body").empty()
  })

  it("Prepare one element", () => {
    // Arrange
    $("body").append(`
      <div>
        <video></video>
        <video></video>
        <video></video>
        <video></video>
      </div>
    `)
    const mediaReceiver = new MediaReceiver()

    // Act
    mediaReceiver.prepareVideoEl()

    // Assert
    assert.isTrue($("video").eq(0).data("used"))
    assert.equal($("video").eq(0).attr("muted"), "true")
    assert.isUndefined($("video").eq(1).data("used"))
    assert.isUndefined($("video").eq(1).attr("muted"))
  })

  it("Prepare two element", () => {
    // Arrange
    $("body").append(`
      <div>
        <video></video>
        <video></video>
        <video></video>
        <video></video>
      </div>
    `)
    const mediaReceiver = new MediaReceiver()

    // Act
    mediaReceiver.prepareVideoEl()
    mediaReceiver.prepareVideoEl()

    // Assert
    assert.isTrue($("video").eq(0).data("used"))
    assert.equal($("video").eq(0).attr("muted"), "true")
    assert.isTrue($("video").eq(1).data("used"))
    assert.equal($("video").eq(1).attr("muted"), "true")
  })

  it("Attach src object", () => {
    // Arrange
    $("body").append("<video></video>")
    const mediaReceiver = new MediaReceiver()
    const srcObject = {}

    // Act
    mediaReceiver.prepareVideoEl()
    mediaReceiver.attachSrcObject(srcObject)

    // Assert
    assert.equal($("video").attr("src"), srcObject)
  })

  it("Attach src object without prepare", () => {
    // Arrange
    $("body").append("<video></video>")
    const mediaReceiver = new MediaReceiver()
    const srcObject = {}
    const attachSrcObjectSpy = sinon.spy(mediaReceiver, "attachSrcObject")

    // Act
    try {
      mediaReceiver.attachSrcObject(srcObject)
    } catch (e) {}

    // Assert
    assert.isTrue(attachSrcObjectSpy.threw("Error"))
  })

  it("Play video without prepare", () => {
    // Arrange
    HTMLVideoElement.prototype.play = () => {}
    $("body").append("<video></video>")
    const mediaReceiver = new MediaReceiver()
    const srcObject = {}
    const playSpy = sinon.spy(mediaReceiver, "playVideo")

    // Act
    try {
      mediaReceiver.playVideo()
    } catch (e) {}

    // Assert
    assert.isTrue(playSpy.threw("Error"))
  })
})
