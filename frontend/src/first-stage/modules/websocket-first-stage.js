import $ from 'jquery'
import { WEBSOCKET_SERVER_URL } from '@/common/constants'

const socket = new WebSocket(`${WEBSOCKET_SERVER_URL}/first-stage`);

export default socket