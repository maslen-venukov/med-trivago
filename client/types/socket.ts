import { Socket } from 'socket.io-client'

export interface ISocketState {
  socket: Socket | null
  notifications: number
}

export enum SocketActionTypes {
  SET_SOCKET = 'SET_SOCKET',
  INCREMENT_NOTIFICATIONS = 'INCREMENT_NOTIFICATIONS',
  DECREMENT_NOTIFICATIONS = 'DECREMENT_NOTIFICATIONS'
}

interface ISetSocket {
  type: SocketActionTypes.SET_SOCKET,
  payload: Socket
}

interface IIncrementNotifications {
  type: SocketActionTypes.INCREMENT_NOTIFICATIONS
}

interface IDecrementNotifications {
  type: SocketActionTypes.DECREMENT_NOTIFICATIONS
}

export type SocketAction = ISetSocket | IIncrementNotifications | IDecrementNotifications