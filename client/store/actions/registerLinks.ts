import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { RegisterLinksActionTypes, IRegisterLink, RegisterLinksAction } from '../../types/registerLinks'

export const setRegisterLinks = (payload: IRegisterLink[]): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS,
  payload
})

const setRegisterLinksLoading = (payload: boolean): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS_LOADING,
  payload
})

const createRegisterLinks = (payload: IRegisterLink): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.CREATE_REGISTER_LINK,
  payload
})

const removeRegisterLink = (payload: string): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.REMOVE_REGISTER_LINK,
  payload
})

export const fetchRegisterLinks = (token: string) => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.get('/api/register-links', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setRegisterLinks(data.registerLinks)))
    .catch(catchError)
    .finally(() => dispatch(setRegisterLinksLoading(false)))
}

export const fetchCreateRegisterLink = (email: string, token: string, cb: () => void) => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.post('/api/register-links', { email }, {
    headers: { Authorization: token }
  })
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

export const fetchRemoveRegisterLink = (id: string, token: string) => (dispatch: Dispatch<RegisterLinksAction>) => {
  dispatch(setRegisterLinksLoading(true))
  axios.delete(`/api/register-links/${id}`, {
    headers: { Authorization: token }
  })
    .then(({ data }) => {
      dispatch(removeRegisterLink(id))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setRegisterLinksLoading(false)))
}