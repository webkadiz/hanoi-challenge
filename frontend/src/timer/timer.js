import "./bender.css"
import "./timer.scss"
import { createWebSocket } from "@/common/utils"
import Timer from "./modules/Timer"

const socket = createWebSocket("timer")
const timer = new Timer(socket)
timer.init()

socket.onmessage = (e) => {
  if (e.data === "start") timer.start()
  else if (e.data === "reload") timer.reload()
}
