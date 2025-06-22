import type { ISentMessage, ITyping } from '@/types'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (): Socket => {
  if (!socket || !socket.connected) {
    socket = io('http://localhost:3000')
  }
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = (): Socket | null => {
  return socket
}

export const sendMessage = (sentMessage: ISentMessage): void => {
  if (socket) {
    socket.emit('sendMessage', sentMessage)
  }
}

export const typingEvent = (typing: ITyping) => {
  if (socket) {
    socket.emit('typing', typing)
  }
}

// export const onTypingEvent = (callback: (data: ISentMessage) => void): void => {

// }

// Export default để tương thích với code hiện tại
export default {
  connect: connectSocket,
  disconnect: disconnectSocket,
  get: getSocket,
  sendMessage: sendMessage,
  typingEvent: typingEvent,
}
