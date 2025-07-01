import type { IReadMessage, ISendMessage, ITyping } from '@/types'
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

export const sendMessage = (sentMessage: ISendMessage): void => {
  if (socket) {
    socket.emit('sendMessage', sentMessage)
  }
}

export const typingEvent = (typing: ITyping) => {
  if (socket) {
    socket.emit('typing', typing)
  }
}

export const receiveMessage = (callback: (data: ISendMessage) => void): void => {
  console.log("object");
  if (socket) {
    socket.on('receive_message', (data: ISendMessage) => {
      // console.log("receive_message");
      callback(data)
    })
  }
}

export const readMessage = (data: IReadMessage) => {
  if (socket) {
    socket.emit("read_message", data );
  }
}

export const receive_readMessage = (callback: (data: IReadMessage) => void): void => {
  if (socket) {
    socket.on('read_message', (data: IReadMessage) => {
      callback(data)
    })
  }
}

export default {
  connect: connectSocket,
  disconnect: disconnectSocket,
  get: getSocket,
  sendMessage: sendMessage,
  typingEvent: typingEvent,
  receiveMessage: receiveMessage,
  readMessage: readMessage,
  receive_readMessage: receive_readMessage,
}
