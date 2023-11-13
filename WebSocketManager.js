const WebSocket = require("ws")
const { EventEmitter } = require("events")

class WebSocketManager extends EventEmitter {
  constructor(url) {
    super()
    this.ws = new WebSocket(url)
    this.ws.on("open", () => this.emit("open"))
    this.ws.on("message", (data) => this.emit("message", data))
    this.ws.on("close", (code, reason) => this.emit("close", code, reason))
    this.ws.on("error", (error) => this.emit("error", error))
  }

  send(type, data = {}) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }))
    } else {
      console.error("WebSocket is not open.")
    }
  }
}

// Export an instance so it's a singleton
module.exports = new WebSocketManager("ws://localhost:3000")
