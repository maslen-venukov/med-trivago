import { IUserState, UserAction, UserActionTypes } from '../../types/user'

const initialState: IUserState = {
  user: null,
  ready: false,
  loggedOut: false
}

const user = (state = initialState, action: UserAction): IUserState => {
  switch(action.type) {
    case UserActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      }

    case UserActionTypes.SET_READY:
      return {
        ...state,
        ready: true
      }

    case UserActionTypes.SET_LOGGED_OUT:
      return {
        ...state,
        loggedOut: action.payload
      }

    default:
      return state
  }
}

export default user