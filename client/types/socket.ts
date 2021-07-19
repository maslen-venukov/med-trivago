import { Socket } from 'socket.io-client'

export interface ISocketState {
  socket: Socket | null
  notifications: number
}

export enum SocketActionTypes {
  SET_SOCKET = 'SET_SOCKET',
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  INCREMENT_NOTIFICATIONS = 'INCREMENT_NOTIFICATIONS',
  DECREMENT_NOTIFICATIONS = 'DECREMENT_NOTIFICATIONS'
}

interface ISetSocket {
  type: SocketActionTypes.SET_SOCKET,
  payload: Socket
}

interface ISetNotifications {
  type: SocketActionTypes.SET_NOTIFICATIONS,
  payload: number
}

interface IIncrementNotifications {
  type: SocketActionTypes.INCREMENT_NOTIFICATIONS
}

interface IDecrementNotifications {
  type: SocketActionTypes.DECREMENT_NOTIFICATIONS
}

export type SocketAction = ISetSocket | ISetNotifications | IIncrementNotifications | IDecrementNotifications