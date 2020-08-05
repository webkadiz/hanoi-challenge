module.exports = function sendMsg(client, msg) {
  client && client.send(msg)
}