import { assert } from "chai"
import sinon from "sinon"
import MediaList from "../../../src/last-stage/modules/media/MediaList"

describe("MediaList", () => {
  let mediaContainer

  beforeEach(() => {
    mediaContainer = {}
  })

  it("functionality script", () => {
    // Arrange
    const mediaList = new MediaList()

    // Act
    mediaList.insert(1, mediaContainer)

    // Assert
    assert.equal(mediaList.eq(1), mediaContainer)
  })
})
