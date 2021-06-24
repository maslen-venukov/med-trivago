import { Dispatch } from 'react'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { IUser, UserAction, UserActionTypes } from '../../types/user'
import { NextRouter } from 'next/router'

export const setUser = (payload: IUser | null): UserAction => ({
  type: UserActionTypes.SET_USER,
  payload
})

const setReady = (): UserAction => ({
  type: UserActionTypes.SET_READY
})

export const setLoggedOut = (payload: boolean): UserAction => ({
  type: UserActionTypes.SET_LOGGED_OUT,
  payload
})

export const login = (email: string, password: string, cb: () => void, error: () => void) => (dispatch: Dispatch<UserAction>) => {
  axios.post('/api/users/login', {
    email,
    password
  })
    .then(({ data }) => {
      console.log(data)
      dispatch(setUser(data.user))
      message.success(data.message)
      cb()
    })
    .catch(e => {
      catchError(e)
      error()
    })
}

export const logout = (router: NextRouter) => (dispatch: Dispatch<UserAction>) => {
  axios.post('/api/users/logout')
    .then(({ data }) => {
      router.push('/')
      message.success(data.message)
      dispatch(setLoggedOut(true))
      dispatch(setUser(null))
    })
    .catch(catchError)
}

export const auth = () => (dispatch: Dispatch<UserAction>) => {
  axios.get('/api/users/auth')
    .then(({ data }) => dispatch(setUser(data.user)))
    .catch(e => console.log(e.response.data.message))
    .finally(() => dispatch(setReady()))
}