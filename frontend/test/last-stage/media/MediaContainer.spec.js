import { assert } from "chai";
import sinon from "sinon";
import MediaContainer from "../../../src/last-stage/modules/media/MediaContainer";

describe("MediaContainer", () => {
  let mediaReceiver,
    mediaSourceAdapter,
    mediaSourceBuffer,
    emitter,
    mediaReceiverSpy,
    mediaSourceAdapterSpy,
    mediaSourceBufferSpy,
    emitterSpy,
    createObjectURLSpy;

  beforeEach(() => {
    URL.createObjectURL = () => {};

    mediaReceiver = {
      prepareVideoEl() {},
      playVideo() {},
      attachSrcObject() {},
    };

    mediaSourceAdapter = {
      setSourceOpenHandler() {},
      getOriginal() {},
    };

    mediaSourceBuffer = {
      appendBuffer() {},
      setSourceBuffer() {},
      setUpdateHandler() {},
    };

    emitter = {
      on() {},
      emit() {},
    };

    mediaReceiverSpy = sinon.spy(mediaReceiver);
    mediaSourceAdapterSpy = sinon.spy(mediaSourceAdapter);
    mediaSourceBufferSpy = sinon.spy(mediaSourceBuffer);
    emitterSpy = sinon.spy(emitter);
    createObjectURLSpy = sinon.spy(URL, "createObjectURL");
  });

  it("Init", () => {
    // Arrange
    const mediaContainer = new MediaContainer(
      mediaReceiver,
      mediaSourceAdapter,
      mediaSourceBuffer,
      emitter
    );

    // Act
    mediaContainer.init();

    // Assert
    assert.isTrue(mediaReceiverSpy.prepareVideoEl.calledOnce);
    assert.isTrue(mediaSourceAdapterSpy.setSourceOpenHandler.calledOnce);
    assert.isTrue(emitterSpy.on.calledWith("sourceOpen"));
    assert.isTrue(createObjectURLSpy.calledOnce);
    assert.isTrue(
      mediaReceiverSpy.attachSrcObject.calledAfter(createObjectURLSpy)
    );
  });
});
