import $ from 'jquery'
import { WEBSOCKET_SERVER_URL } from '@/common/constants'


const socket = new WebSocket(`${WEBSOCKET_SERVER_URL}/first-stage`);

// обработчик входящих сообщений
socket.onmessage = function(event) {
	console.log(event)
	let incomingMessage

	try {
		incomingMessage = JSON.parse(event.data)
	} catch(e) {
		incomingMessage = event.data
	}

  showMessage(incomingMessage);
};

// показать сообщение в div#subscribe
function showMessage(message) {
  console.log(message)
  
}


$(window).keyup(e => {
  console.log(socket)
	socket.send(e.key)
})

export default socket