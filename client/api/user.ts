import { NextRouter } from 'next/router'
import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setLoggedOut, setReady, setUser } from '../store/actions/user'

import catchError from '../utils/catchError'

import { UserAction } from '../types/user'

export const login = (email: string, password: string, cb: () => void, error: () => void) => (dispatch: Dispatch<UserAction>) => {
  axios.post('/api/users/login', {
    email,
    password
  })
    .then(({ data }) => {
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
    .finally(() => dispatch(setReady()))
    .catch(console.log)
}