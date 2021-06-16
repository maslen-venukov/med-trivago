import { Dispatch } from 'react'
import axios from 'axios'
import message from 'antd/lib/message'

import { IUser, UserAction, UserActionTypes } from '../../types/user'

const setUser = (payload: { token: string, user: IUser }): UserAction => ({
  type: UserActionTypes.SET_USER,
  payload
})

const logOut = (): UserAction => ({
  type: UserActionTypes.LOG_OUT
})

const setReady = (): UserAction => ({
  type: UserActionTypes.SET_READY
})

export const logIn = (email: string, password: string, cb: () => void) => (dispatch: Dispatch<UserAction>) => {
  axios.post('/api/users/login', {
    email,
    password
  })
    .then(({ data }) => {
      dispatch(setUser(data))
      message.success('Авторизация выполнена успешно')
      cb()
    })
    .catch(e => message.error(e.response.data.message))
}

export const auth = (token: string) => (dispatch: Dispatch<UserAction>) => {
  axios.get('/api/users/auth', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setUser(data)))
    .catch(e => {
      console.log(e.response.data.message)
      dispatch(logOut())
    })
    .finally(() => dispatch(setReady()))
}