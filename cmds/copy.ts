"use strict"

import { MessageType } from "../utils/types"
import { sendMessage } from "../utils/websocket"
module.exports = (args: any) => {
  let copiedData = ""
  process.stdin.on("readable", () => {
    let chunk: any
    while ((chunk = process.stdin.read()) !== null) {
      copiedData += chunk
    }
  })

  process.stdin.on("end", () => {
    if (copiedData) {
      sendMessage(MessageType.NewTextItem, { text: copiedData })
    }
  })

  setTimeout(() => {
    if (!copiedData) {
      console.log("No data received. Exiting...")
      process.exit(0)
    }
  }, 2000)
}
