import { io } from 'socket.io-client'

const socket = io('http://localhost:3000') // Đổi thành backend URL nếu cần

export default socket
