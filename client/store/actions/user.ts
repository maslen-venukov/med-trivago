import { Dispatch } from 'react'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { IUser, UserAction, UserActionTypes } from '../../types/user'

export const setUser = (payload: { token: string, user: IUser }): UserAction => ({
  type: UserActionTypes.SET_USER,
  payload
})

export const logout = (): UserAction => ({
  type: UserActionTypes.LOG_OUT
})

export const setReady = (): UserAction => ({
  type: UserActionTypes.SET_READY
})

export const login = (email: string, password: string, cb: () => void, error: () => void) => (dispatch: Dispatch<UserAction>) => {
  axios.post('/api/users/login', {
    email,
    password
  })
    .then(({ data }) => {
      const { token, user } = data
      dispatch(setUser({ token, user }))
      message.success(data.message)
      cb()
    })
    .catch(e => {
      catchError(e)
      error()
    })
}

export const auth = (token: string) => (dispatch: Dispatch<UserAction>) => {
  axios.get('/api/users/auth', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setUser(data)))
    .catch(e => {
      console.log(e.response.data.message)
      dispatch(logout())
    })
    .finally(() => dispatch(setReady()))
}