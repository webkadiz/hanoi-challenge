import { createWebSocket } from "@/common/utils"
import $ from "jquery"

const socket = createWebSocket("command-center")

$(".start").click(() => {
  socket.send("start")
})

$(".reload").click(() => {
  socket.send("reload")
})
