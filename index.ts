import { copy } from "copy-paste"
import WebSocket from "ws"

let copiedData = ""

enum MessageType {
  NewTextItem = "newTextItem",
  Retrieve = "retrieve",
}

const ws = new WebSocket("ws://localhost:3000")

process.stdin.on("readable", () => {
  let chunk: any
  while ((chunk = process.stdin.read()) !== null) {
    copiedData += chunk
  }
})

process.stdin.on("end", () => {
  const command = process.argv[2]

  ws.on("open", function open() {
    if (command === "paste") {
      ws.send(
        JSON.stringify({
          type: MessageType.Retrieve,
          id: 0,
        })
      )
    } else if (command === "copy") {
      ws.send(
        JSON.stringify({
          type: MessageType.NewTextItem,
          text: copiedData,
        })
      )
      process.exit(0)
    }
  })
})

ws.on("message", (data: string) => {
  const response = JSON.parse(data)
  console.log("response ", response)
  switch (response.type) {
    case MessageType.NewTextItem:
      copy(response.text)
      process.exit(0)
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
