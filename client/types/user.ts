export enum UserActionTypes {
  SET_USER = 'SET_USER',
  SET_READY = 'SET_READY',
  SET_LOGGED_OUT = 'SET_LOGGED_OUT'
}

export interface IUser {
  _id: string
  email: string
  role: string
}

export interface IUserState {
  user: IUser | null
  ready: boolean
  loggedOut: boolean
}

interface ISetUser {
  type: UserActionTypes.SET_USER,
  payload: IUser | null
}

interface ISetReady {
  type: UserActionTypes.SET_READY
}

interface ISetLoggedOut {
  type: UserActionTypes.SET_LOGGED_OUT,
  payload: boolean
}

export type UserAction = ISetUser | ISetReady | ISetLoggedOut