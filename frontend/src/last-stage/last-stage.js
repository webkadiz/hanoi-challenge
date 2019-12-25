
import './last-stage.scss'
import $ from 'jquery'
import 'jquery-ui/ui/effects/effect-clip.js'
import 'jquery-ui/ui/effects/effect-explode.js'
import socket from './modules/websocket-last-stage'

import { range } from '@/common/utils'

//import { init } from './modules/firework.js'

let gameScore = 5

const scoreEl = $('.score')

const mediaSourceArray = Array(4).fill(null)
const sourceBufferArray = Array(4).fill(null)

const mimeCodec = 'video/webm;codecs=vp8'
const queueArray = Array(4).fill(null)

const videoElems = document.querySelectorAll('video')
 
const flipBtns = $('.flip-btn')

let lastStageIsOpen = false

let amountGameOver = 0

const inputs = Array.from(document.querySelectorAll('.last-stage-input__item'))

const inputEl = $('.last-stage-input')


const amountAttemptsEl = $('.last-stage-attempts__amount') 

const secretWord = 'время'

let amountAttempts = 10


const gameOverScreen = $('.game-over-screen')

let inAnim = false

flipBtns.fadeOut()

for (const i of range(4)) {
	$('.last-stage-img').eq(i).css('background-image', `url(static/${i}.jpg)`)
}


$('.last-stage').effect('clip', { mode: 'hide'} )

amountAttemptsEl.text(amountAttempts)

// обработчик входящих сообщений
socket.onmessage = function(event) {
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

  if (incomingData.buffer) {

  	console.log(queueArray[incomingData.clientIndex])

  	appendBuffer(incomingData.buffer, incomingData.clientIndex)	

  } else if(incomingData.data.create) {
  	
  	createMediaSource(incomingData.clientIndex)

  } else if(incomingData.data.gameOver) {

  	handleFirstStageGameOver(incomingData.data.gameOver, incomingData.clientIndex, incomingData.data.additionalScore)

  }


}


function appendBuffer(buf, clientIndex) {

	const arrayBuffer = toArrayBuffer(buf.data)
	const sourceBuffer = sourceBufferArray[clientIndex]
	const mediaSource = mediaSourceArray[clientIndex]
	const queue = queueArray[clientIndex]

	
	console.log(sourceBuffer.updating, mediaSource.readyState != "open", queue.length > 0)
	
	if (sourceBuffer.updating || mediaSource.readyState != "open" || queue.length > 0) {
		queue.push(arrayBuffer)
	} else {
		sourceBuffer.appendBuffer(arrayBuffer)
	}
	

}

function toArrayBuffer(buf) {
	const ab = new ArrayBuffer(buf.length)
	const view = new Uint8Array(ab)
	for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i]
	}
	return ab
}




function createMediaSource(clientIndex) {
	const videoElem = videoElems[clientIndex]
	const mediaSource = new MediaSource()
	const queue = []

	mediaSourceArray[clientIndex] = mediaSource
	queueArray[clientIndex] = queue

	videoElem.src = URL.createObjectURL(mediaSource)


	mediaSource.addEventListener('sourceopen', () => {
		console.log('source open')
		const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
		sourceBufferArray[clientIndex] = sourceBuffer

		sourceBuffer.addEventListener('updateend', () => {
			if (queue.length > 0 && !sourceBuffer.updating) {
      			sourceBuffer.appendBuffer(queue.shift());
    		}
		})

		videoElem.play()
	})

}


function handleFirstStageGameOver(result, clientIndex, additionalScore) {

	gameScore += additionalScore
	amountGameOver++

	console.log(amountGameOver)

	if (amountGameOver === 4) {
		gameScore++
	}

	if (result === 'win') {
		flipBtns.eq(clientIndex).text('Перевернуть за 0 баллов')
	} else if(result === 'lose') {
		flipBtns.eq(clientIndex).text('Перевернуть за 1 баллов')
	}

	flipBtns.eq(clientIndex).fadeIn(1000)

	flipBtns.eq(clientIndex).click(() => {
		$('.card').eq(clientIndex).addClass('flip')
		if (result === 'lose') gameScore--
	})
}




function addLetter(letter) {

	for (const input of inputs) {
		if (!input.textContent) {
			input.textContent = letter
			return
		}
	}

}


function removeLastLetter() {

	for(const i of range(inputs.length - 1, -1, -1)) {
		if (inputs[i].textContent) {
			inputs[i].textContent = ''
			return
		}
	}

}

function isLetter(letter) {
	return ~'абвгдеёжзийклмнопрстучфцхшщьъыюяэ'.indexOf(letter)
}


function handleAttempt() {
	if (inputs[inputs.length - 1].textContent) {

		amountAttempts--

		amountAttemptsEl.text(amountAttempts)

		const word = inputs.reduce((prev, cur) => prev += cur.textContent, '')

		if (word === secretWord) {
			gameOver()
		} else {
			loseAttempt()
		}
		console.log(word)
	}
}





function loseAttempt() {

	inputEl.addClass('lose-attempt')
	inAnim = true

	inputEl.on('webkitAnimationEnd', () => {
		inputEl.removeClass('lose-attempt')
		inputEl.off('webkitAnimationEnd')

		inputs.forEach(input => input.textContent = '')

	
		inAnim = false

		if (amountAttempts === 0) {
			gameOver()
		}
	})

	
}


function gameOver() {
	console.log('win')
	$(window).off('keyup')



	

	


	setTimeout(() => {


		gradientAnimation()

		

		setTimeout(() => {


			scoreEl.text(gameScore)
			scoreEl.addClass('animation')

			setTimeout(() => import('./modules/firework.js'), 4500)

		}, 4000)

	}, 1000)




}


function gradientAnimation() {

	let iter = 0

	const interval = setInterval(() => {

		if (iter <= 200) {
			gameOverScreen.css('background', `radial-gradient(transparent ${100 - iter}%, black 100%)`)
		} else if (iter <= 400) {
			gameOverScreen.css('background', `radial-gradient(transparent -100%, black ${100 - iter + 200}%)`)
		} else {
			clearInterval(interval)
		}


		iter++

	}, 10)

}



$(window).keyup(e => {

	if (inAnim) return

	console.log(e)
	const letter = e.key.toLowerCase()

	if (e.key === 'Enter') {
		lastStageIsOpen = true
		$('.last-stage').effect('clip', { mode: 'show'} )

	} else if (e.key === 'Escape') {
		lastStageIsOpen = false
		$('.last-stage').effect('clip', { mode: 'hide'} )
	} else if (e.key === 'Backspace') {

		if (lastStageIsOpen) {

			removeLastLetter()

		}

	} else {

		if (lastStageIsOpen && isLetter(letter)) {

			addLetter(letter)

			handleAttempt()

		}

	}
})








