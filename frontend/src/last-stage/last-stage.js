
import './last-stage.scss'
import $ from 'jquery'
import socket from './modules/websocket-last-stage'
console.log(123)


const mediaSourceArray = Array(4).fill(null)
const sourceBufferArray = Array(4).fill(null)

const mimeCodec = 'video/webm;codecs=vp8'
const queueArray = Array(4).fill(null)

const videoElems = document.querySelectorAll('video')
 


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

  		appendBuffer(incomingData.buffer, incomingData.clientIndex)
		




  } else if(incomingData.data.create) {
  	console.log('create media')
  	createMediaSource(incomingData.clientIndex)
  }


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


