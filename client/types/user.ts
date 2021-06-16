export enum UserActionTypes {
  SET_USER = 'SET_USER',
  LOG_OUT = 'LOG_OUT',
  SET_READY = 'SET_READY'
}

export interface IUser {
  _id: string
  email: string
  role: string
}

export interface IUserState {
  token: string | null
  user: IUser | null
  ready: boolean
}

interface ISetUser {
  type: UserActionTypes.SET_USER,
  payload: {
    token: string
    user: IUser
  }
}

interface ILogOut {
  type: UserActionTypes.LOG_OUT
}

interface ISetReady {
  type: UserActionTypes.SET_READY
}

export type UserAction = ISetUser | ILogOut | ISetReady