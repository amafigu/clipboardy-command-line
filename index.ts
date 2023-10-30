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
    if (command === "copy") {
      ws.send(
        JSON.stringify({
          type: MessageType.NewTextItem,
          text: copiedData,
        })
      )
    } else if (command === "paste") {
      ws.send(
        JSON.stringify({
          type: MessageType.Retrieve,
          text: copiedData,
        })
      )
    }
  })
})

ws.on("message", (data: string) => {
  const response = JSON.parse(data)
  switch (response.type) {
    case MessageType.NewTextItem:
      console.log(`Received new text item with ID: ${response.id}`)
      break
    case MessageType.Retrieve:
      console.log(`Your clipboard content: ${response.text}`)
      break
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
