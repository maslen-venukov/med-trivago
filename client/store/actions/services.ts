import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import catchError from '../../utils/catchError'

import { ServicesActionTypes, IService, ServicesAction, IShortService } from '../../types/services'

export const setServices = (payload: IService[]): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES,
  payload
})

const setServicesLoading = (payload: boolean): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES_LOADING,
  payload
})

const addService = (payload: IService): ServicesAction => ({
  type: ServicesActionTypes.ADD_SERVICE,
  payload
})

const removeService = (payload: string): ServicesAction => ({
  type: ServicesActionTypes.REMOVE_SERVICE,
  payload
})

export const fetchHospitalServices = (token: string) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.get('/api/services/hospital', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setServices(data.services)))
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchAddService = (data: IShortService, token: string) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.post('/api/services', data, {
    headers: { Authorization: token }
  })
    .then(({ data }) => {
      dispatch(addService(data.service))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchRemoveService = (id: string, token: string) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.delete(`/api/services/${id}`, {
    headers: { Authorization: token }
  })
    .then(({ data }) => {
      dispatch(removeService(id))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}