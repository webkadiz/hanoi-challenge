import { EventEmitter, Factory, Event, List } from "@webkadiz/event-emitter"
import MediaContainer from "./media/MediaContainer"
import MediaReceiver from "./media/MediaReceiver"
import MediaSourceAdapter from "./media/MediaSourceAdapter"
import MediaSourceBuffer from "./media/MediaSourceBuffer"
import MediaQueue from "./media/MediaQueue"

export default class LastStage {
  constructor(
    lastStageGame,
    firstStageHintList,
    serverEventsProvider,
    mediaList,
    fireworkAdapter,
    emitter
  ) {
    this.lastStageGame = lastStageGame
    this.firstStageHintList = firstStageHintList
    this.serverEventsProvider = serverEventsProvider
    this.mediaList = mediaList
    this.fireworkAdapter = fireworkAdapter
    this.emitter = emitter
  }

  run() {
    this.serverEventsProvider.launch()
    this.firstStageHintList.fill()
    this.fireworkAdapter.prepare()
    this.lastStageGame.activate()

    this.emitter.on("createMediaSource", this.createMediaSource.bind(this))
    this.emitter.on("appendBuffer", this.appendBuffer.bind(this))
    this.emitter.on(
      "handleFirstStageGameOver",
      this.handleFirstStageGameOver.bind(this)
    )
    this.emitter.on("reloadStage", this.reloadStage.bind(this))
    this.emitter.on("fireworkLaunch", this.fireworkLaunch.bind(this))

    return this
  }

  createMediaSource({ clientIndex }) {
    const mediaEmitter = new EventEmitter(new Factory(Event, List))
    const mediaContainer = new MediaContainer(
      new MediaReceiver(),
      new MediaSourceAdapter(new MediaSource(), mediaEmitter),
      new MediaSourceBuffer(new MediaQueue()),
      mediaEmitter
    )

    mediaContainer.init()
    this.mediaList.insert(clientIndex, mediaContainer)
  }

  appendBuffer({ buffer, clientIndex }) {
    this.mediaList.eq(clientIndex).appendBufferToMediaSourceBuffer(buffer)
  }

  handleFirstStageGameOver({ result, additionalScore, clientIndex }) {
    this.lastStageGame.handleFirstStageGameOver(additionalScore)
    this.firstStageHintList.eq(clientIndex).handleFirstStageGameOver(result)
  }

  reloadStage() {
    this.firstStageHintList.reload()
    this.fireworkAdapter.reload()
    this.lastStageGame.reload()
  }

  fireworkLaunch() {
    this.fireworkAdapter.launch()
  }
}
