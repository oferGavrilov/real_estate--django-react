import io, { Socket } from 'socket.io-client'

export const SOCKET_LOGOUT = 'logout'
export const SOCKET_LOGIN = 'login'

const baseUrl =
      process.env.NODE_ENV === 'production'
            ? 'https://rolling-chat-messenger-server.vercel.app'
            : 'http://localhost:5000'

export const socketService = createSocketService()

interface SocketService {
      setup (userId: string): void
      login (userId: string): void
      logout (userId: string): void
      on (eventName: string, cb: (...args: any[]) => void, boolParam?: boolean): void
      off (eventName: string, cb?: (...args: any[]) => void): void
      emit (eventName: string, data: any): void
      terminate (): void
}

function createSocketService (): SocketService {
      let socket: Socket | null = null

      const socketService: SocketService = {
            setup (userId) {
                  socket = io(baseUrl, { reconnection: false })
                  socket.emit('setup', userId)
            },
            on (eventName, cb, boolParam = true) {
                  if (socket) {
                        socket.on(eventName, (...args) => {
                              if (boolParam !== undefined) {
                                    cb(...args, boolParam)
                              } else {
                                    cb(...args)
                              }
                        })
                  }
            },
            off (eventName, cb) {
                  if (!socket) return
                  if (!cb) {
                        socket.removeAllListeners(eventName)
                  } else {
                        socket.off(eventName, cb)
                  }
            },
            login (userId) {
                  this.emit(SOCKET_LOGIN, userId)
            },
            logout (userId) {
                  this.emit(SOCKET_LOGOUT, userId)
            },
            emit (eventName, data) {
                  if (socket) {
                        socket.emit(eventName, data)
                  }
            },
            terminate () {
                  if (socket) {
                        socket.disconnect()
                        socket = null
                  }
            },

      }
      return socketService
}

export default socketService
