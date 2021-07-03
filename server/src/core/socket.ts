import { Server } from 'socket.io'
import http from 'http'

import { corsOptions } from './cors'

import { SocketActions } from '../types'

const socket = (server: http.Server) => {
  const io = new Server(server, { cors: corsOptions })

  io.on('connection', socket => {
    console.log('user connected', socket.id)

    socket.on(SocketActions.Join, hospitalId => {
      socket.join(hospitalId)
      console.log('hospital joined', hospitalId)
    })

    socket.on(SocketActions.Appoint, async ({ hospitalId, data }) => {
      socket.broadcast.to(hospitalId).emit(SocketActions.Watch, data)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}

export default socket