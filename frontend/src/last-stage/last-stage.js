import "./last-stage.scss"
import "jquery-ui/ui/effects/effect-clip.js"
import "jquery-ui/ui/effects/effect-explode.js"

import { EventEmitter, Factory, Event, List } from "@webkadiz/event-emitter"
import LastStage from "./modules/LastStage"
import LastStageGame from "./modules/LastStageGame"
import GameLogic from "./modules/GameLogic"
import FirstStageHintList from "./modules/FirstStageHintList"
import ServerEventsProvider from "./modules/ServerEventsProvider"
import SocketManager from "../first-stage/classes/SocketManager"
import MediaList from "./modules/media/MediaList"
import FireworkAdapter from "./modules/FireworkAdapter"

const emitter = new EventEmitter(new Factory(Event, List))

const last = new LastStage(
  new LastStageGame(new GameLogic(emitter), emitter),
  new FirstStageHintList(emitter),
  new ServerEventsProvider(
    new SocketManager(new WebSocket("ws://localhost:8081/last-stage"), emitter),
    emitter
  ),
  new MediaList(),
  new FireworkAdapter(),
  emitter
).run()
