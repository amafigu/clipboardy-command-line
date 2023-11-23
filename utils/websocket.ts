import WebSocket from "ws"
import { MessageType } from "../utils/types"

const ws = new WebSocket("ws://localhost:3000")

const sendMessage = (type: string, data = {}) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, ...data }))
  } else {
    ws.once("open", () => sendMessage(type, data))
  }
}

ws.on("message", (data: string) => {
  const response = JSON.parse(data)
  switch (response.type) {
    case MessageType.NewTextItem:
      process.exit(0)
    case MessageType.Retrieve:
      process.stdout.write(response.text)
      process.exit(0)
    case MessageType.Error:
      console.error(response.message)
      process.exit(1)
    default:
      console.log("Received:", response)
      break
  }
})

ws.on("error", (error) => {
  console.error("WebSocket Error:", error)
})

ws.on("close", (code, reason) => {
  console.log(`WebSocket closed. Code: ${code}, Reason: ${reason}`)
})

export { sendMessage, ws }
