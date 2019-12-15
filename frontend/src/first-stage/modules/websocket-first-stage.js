import $ from 'jquery'

const socket = new WebSocket("ws://localhost:8081/first-stage");

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