import WebSocket from "ws"

let copiedData = ""

enum MessageType {
  NewTextItem = "newTextItem",
  Retrieve = "retrieve",
  Error = "error",
}

const ws = new WebSocket("ws://localhost:3000")

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
    process.stdin.on("readable", () => {
      let chunk: any
      while ((chunk = process.stdin.read()) !== null) {
        copiedData += chunk
      }
    })

    process.stdin.on("end", () => {
      ws.send(
        JSON.stringify({
          type: MessageType.NewTextItem,
          text: copiedData,
        })
      )
    })
  }
})

ws.on("message", (data: string) => {
  const response = JSON.parse(data)
  switch (response.type) {
    case MessageType.NewTextItem:
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
