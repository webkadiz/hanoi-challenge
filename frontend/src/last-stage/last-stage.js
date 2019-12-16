
import './last-stage.scss'
import $ from 'jquery'
import socket from './modules/websocket-last-stage'
console.log(123)


const mimeCodec = 'video/webm;codecs=vp8'
const queue = []
const videoElems = document.querySelectorAll('video')
const videoElem = videoElems[0]

const mediaSource = new MediaSource();
  //console.log(mediaSource.readyState); // closed
videoElem.src = URL.createObjectURL(mediaSource);

videoElem.play()

let sourceBuffer

mediaSource.addEventListener('sourceopen', () => {
	sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

	sourceBuffer.addEventListener('updateend', () => {
		if (queue.length > 0 && !sourceBuffer.updating) {
      		sourceBuffer.appendBuffer(queue.shift());
    	}
	})
})


 


// обработчик входящих сообщений
socket.onmessage = function(event) {
	console.log(event)
	let incomingData

	try {
		incomingData = JSON.parse(event.data)
	} catch(e) {
		incomingData = event.data
	}

  handleIncomingData(incomingData);
};


function handleIncomingData(incomingData) {

  if (incomingData.buffer) {
		console.log(incomingData)
		const { buffer, clientIndex, type } = incomingData
		console.log(buffer)
		
		const arrayBuffer = toArrayBuffer(buffer.data)

		console.log(arrayBuffer)
			
		console.log(sourceBuffer.updating, mediaSource.readyState != "open")
		if (sourceBuffer.updating || mediaSource.readyState != "open" || queue.length > 0) {
			queue.push(arrayBuffer);
		} else {
			console.log('append buffer')
			sourceBuffer.appendBuffer(arrayBuffer)
		}

		console.log(sourceBuffer)


//		videoElems[clientIndex].play()
  }
}





function toArrayBuffer(buf) {
	var ab = new ArrayBuffer(buf.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buf.length; ++i) {
			view[i] = buf[i];
	}
	return ab;
}


