import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setServices, setServicesLoading, addService, removeService } from '../store/actions/services'

import catchError from '../utils/catchError'

import { IShortService, ServicesAction } from '../types/services'

export const fetchHospitalServices = () => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.get('/api/services/hospital')
    .then(({ data }) => dispatch(setServices(data.services)))
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchAddService = (data: IShortService) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.post('/api/services', data)
    .then(({ data }) => {
      dispatch(addService(data.service))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}

export const fetchRemoveService = (id: string) => (dispatch: Dispatch<ServicesAction>) => {
  dispatch(setServicesLoading(true))
  axios.delete(`/api/services/${id}`)
    .then(({ data }) => {
      dispatch(removeService(id))
      message.success(data.message)
    })
    .catch(catchError)
    .finally(() => dispatch(setServicesLoading(false)))
}