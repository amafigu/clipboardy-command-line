import WebSocket from "ws"

let copiedData = ""

enum MessageType {
  NewTextItem = "newTextItem",
  Retrieve = "retrieve",
  Error = "error",
}

const ws = new WebSocket("ws://localhost:3000")

function sendMessage(type: string, data = {}) {
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
      process.stdout.write(response.text)
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

const command = process.argv[2]
ws.on("open", function open() {
  if (command === "paste") {
    sendMessage(MessageType.Retrieve, { id: 0 })
  } else if (command === "copy") {
    process.stdin.on("readable", () => {
      let chunk: any
      while ((chunk = process.stdin.read()) !== null) {
        copiedData += chunk
      }
    })

    process.stdin.on("end", () => {
      sendMessage(MessageType.NewTextItem, { text: copiedData })
    })
  }
})
