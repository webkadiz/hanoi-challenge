import './fontello.css'
import './first-stage.scss'
import 'jquery-ui/ui/effects/effect-blind'

import $ from 'jquery'
import {EventEmitter, Event, Factory, List} from '@webkadiz/event-emitter'
import GameManager from './classes/GameManager'
import Game from './classes/Game'
import LevelManger from './classes/LevelManager'
import GameMap from './classes/GameMap'
import SocketManager from './classes/SocketManager'
import VideoStreamManager from './classes/VideoStreamManager'
import Snowfall from './classes/Snowfall'
import InjectorArrayMethods from './classes/InjectorArrayMethods'

const emitter = new EventEmitter(new Factory(Event, List))

new GameManager(
	new Game(
		new LevelManger(
			$('.level'),
			[3, 3, 4, 4, 2],
			emitter
		),
		new GameMap(),
		emitter
	),
	new SocketManager(
		new WebSocket("ws://localhost:8081/first-stage"),
		emitter
	),
	new VideoStreamManager(emitter),
	new Snowfall('.snowfall'),
	new InjectorArrayMethods(),
	emitter
).run()
