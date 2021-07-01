import { IUser, UserAction, UserActionTypes } from '../../types/user'

export const setUser = (payload: IUser | null): UserAction => ({
  type: UserActionTypes.SET_USER,
  payload
})

export const setReady = (): UserAction => ({
  type: UserActionTypes.SET_READY
})

export const setLoggedOut = (payload: boolean): UserAction => ({
  type: UserActionTypes.SET_LOGGED_OUT,
  payload
})