"use strict"

import { MessageType } from "../utils/types"
import { sendMessage } from "../utils/websocket"

module.exports = (args: any) => {
  sendMessage(MessageType.Retrieve, { id: 0 })
}
