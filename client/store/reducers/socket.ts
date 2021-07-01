import { ISocketState, SocketAction, SocketActionTypes } from '../../types/socket'

const initialState: ISocketState = {
  socket: null,
  notifications: 0
}

const socket = (state = initialState, action: SocketAction): ISocketState => {
  switch(action.type) {
    case SocketActionTypes.SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      }

    case SocketActionTypes.INCREMENT_NOTIFICATIONS:
      return {
        ...state,
        notifications: ++state.notifications
      }

    case SocketActionTypes.DECREMENT_NOTIFICATIONS:
      return {
        ...state,
        notifications: --state.notifications
      }

    default:
      return state
  }
}

export default socket