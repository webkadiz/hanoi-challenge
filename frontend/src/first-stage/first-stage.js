import './fontello.css'
import './first-stage.scss'
import $ from 'jquery'
import 'jquery-ui/ui/effects/effect-blind'

import './modules/init'
import socket from './modules/websocket-first-stage'

import Snowfall from './classes/Snowfall'
import Game from './classes/Game'




const game = new Game()
const snowfall = new Snowfall('.snowfall')


game.createLevelScreen()
snowfall.init()
snowfall.animate()




socket.onopen = () => {
	console.log('open')
	socket.send(JSON.stringify({
		create: true
	}))
}


socket.onmessage = event => {
	console.log(event)
	let incomingData

	try {
		incomingData = JSON.parse(event.data)
	} catch(e) {
		incomingData = event.data
	}

  handleIncomingData(incomingData)
}


function handleIncomingData(incomingData) {
	console.log(incomingData)

	if (incomingData.reload) {

		location.reload()
	
	} else if (incomingData.timer === 'start') {

		game.startGame()
			
	} else if (incomingData.timer === 'stop') {

		game.stopGame()

	}
}




navigator.mediaDevices.getDisplayMedia({ video: true })
	.then(stream => {
		const recorder = new MediaRecorder(stream)
		
		recorder.ondataavailable = e => socket.send(e.data)
		
		recorder.start(1000)
	})
	.catch(err => console.log(err))


