import { Socket } from 'socket.io-client'

import { SocketActionTypes, SocketAction } from '../../types/socket'

export const setSocket = (payload: Socket): SocketAction => ({
  type: SocketActionTypes.SET_SOCKET,
  payload
})

export const incrementNotifications = (): SocketAction => ({
  type: SocketActionTypes.INCREMENT_NOTIFICATIONS
})

export const decrementNotifications = (): SocketAction => ({
  type: SocketActionTypes.DECREMENT_NOTIFICATIONS
})

export const resetNotifications = (): SocketAction => ({
  type: SocketActionTypes.RESET_NOTIFICATIONS
})