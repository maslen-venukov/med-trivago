import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setServices, setServicesLoading, createService, updateService, removeService } from '../store/actions/services'

import catchError from '../utils/catchError'

import { IShortService, ServicesAction } from '../types/services'

export const fetchHospitalServices = () => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.get('/api/services/hospital')
    .then(({ data }) => dispatch(setServices(data.services)))
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchCreateService = (data: IShortService) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.post('/api/services', data)
    .then(({ data }) => {
      dispatch(createService(data.service))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchUpdateService = (id: string, data: IShortService) => (dispatch: Dispatch<ServicesAction>) => {
  axios.put(`/api/services/${id}`, data)
    .then(({ data }) => {
      dispatch(updateService(data.service))
      message.success(data.message)
    })
    .catch(catchError)
}

export const fetchRemoveService = (id: string) => (dispatch: Dispatch<ServicesAction>) => {
  axios.delete(`/api/services/${id}`)
    .then(({ data }) => {
      dispatch(removeService(id))
      message.success(data.message)
    })
    .catch(catchError)
}