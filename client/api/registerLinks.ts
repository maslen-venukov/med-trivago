import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { createRegisterLinks, removeRegisterLink, setRegisterLinks, setRegisterLinksLoading } from '../store/actions/registerLinks'

import catchError from '../utils/catchError'

import { RegisterLinksAction } from '../types/registerLinks'

export const fetchRegisterLinks = () => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.get('/api/register-links')
    .then(({ data }) => dispatch(setRegisterLinks(data.registerLinks)))
    .catch(catchError)
    .finally(() => dispatch(setRegisterLinksLoading(false)))
}

export const fetchCreateRegisterLink = (email: string, cb: () => void) => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.post('/api/register-links', { email })
    .then(({ data }) => {
      dispatch(createRegisterLinks(data.registerLink))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => {
      dispatch(setRegisterLinksLoading(false))
      cb()
    })
}

export const fetchRemoveRegisterLink = (id: string) => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.delete(`/api/register-links/${id}`)
    .then(({ data }) => {
      dispatch(removeRegisterLink(id))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setRegisterLinksLoading(false)))
}