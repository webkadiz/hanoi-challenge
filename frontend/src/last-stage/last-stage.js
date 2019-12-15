import $ from 'jquery'
import socket from './modules/websocket-last-stage'
console.log(123)


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

  handleIncomingData(incomingData);
};

// показать сообщение в div#subscribe
function handleIncomingData(incomingData) {

  if (incomingData.buffer) {
		console.log(incomingData)
		const { buffer, clientIndex, type } = incomingData
		console.log(buffer)
		
		const arrayBuffer = toArrayBuffer(buffer.data)

		console.log(arrayBuffer)

		const blob = new Blob(arrayBuffer, { type })

		console.log(blob)

		videoElems[clientIndex].srcObject = blob

		videoElems[clientIndex].play()
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


