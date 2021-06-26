import { Server } from 'socket.io'
import http from 'http'

import { corsOptions } from './cors'

import { SocketActions } from '../types'

const socket = (server: http.Server) => {
  const io = new Server(server, { cors: corsOptions })

  io.on('connection', socket => {
    console.log('user connected', socket.id)

    socket.on(SocketActions.JOIN, hospitalId => {
      socket.join(hospitalId)
      console.log('joined', hospitalId)
    })

    socket.on(SocketActions.APPOINT, async ({ hospitalId, data }) => {
      socket.broadcast.to(hospitalId).emit(SocketActions.WATCH, data)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}

export default socket