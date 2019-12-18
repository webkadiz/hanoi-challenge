import './timer.scss'
import $ from 'jquery'
import socket from './modules/websocket-timer'

let q = selector => document.querySelector(selector)
let qAll = selector => document.querySelectorAll(selector)
let timerEl = $(".timer")
let time = timerEl.attr('data-time')
let minute
let second
let strTime = ""
let colors = ["#009914", "#ff0000", "#ff7777", "#f7de00"]
let color = colors[0]
let keyIP = "123557855"
let strIP = ""
let clickFunc
let timer
let result = 10

function strFromTime(time) {
	let str = ""
	const minute = ~~(time / 60)
	const second = time % 60
 	
 	if (time < 0) {
		time = Math.abs(time)
		str = "-"
 	}
 	
	str += `${~~(minute / 10)}${minute % 10}:${~~(second / 10)}${second % 10}`
	return str
}

$(".page").on("click", clickFunc = e => {

	socket.send('start')
	$(".page").off("click", clickFunc)


	const timer = setInterval(() => {
		
	time -= 1
	minute = ~~((time - 1) / 60)

	if (time < 60) timerEl.css("animation", "scale 1s infinite linear")
	if (minute > -1 && minute < 2) color = colors[minute + 1]
	strTime = strFromTime(time)
	timerEl.text(strTime)
	timerEl.css("color", color)


	if (time <= 0) {
		clearInterval(timer)
		timerEl.css("animation", "none")
		socket.send('stop')
	}

	}, 1000)

})





