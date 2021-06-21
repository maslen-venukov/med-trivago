import { Dispatch } from 'redux'
import axios from 'axios'

import catchError from '../../utils/catchError'

import { ServicesActionTypes, IService, ServicesAction } from '../../types/services'

export const setServices = (payload: IService[]): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES,
  payload
})

const setServicesLoading = (payload: boolean): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES_LOADING,
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