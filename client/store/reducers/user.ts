import { IUserState, UserAction, UserActionTypes } from '../../types/user'

const initialState: IUserState = {
  token: null,
  user: null,
  ready: false
}

const user = (state = initialState, action: UserAction): IUserState => {
  switch(action.type) {
    case UserActionTypes.SET_USER:
      const { token, user } = action.payload
      localStorage.setItem('token', token)
      return {
        ...state,
        token,
        user
      }

    case UserActionTypes.SET_READY:
      return {
        ...state,
        ready: true
      }

    case UserActionTypes.LOG_OUT:
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        user: null
      }

    default:
      return state
  }
}

export default user