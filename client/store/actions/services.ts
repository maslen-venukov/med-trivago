import { ServicesActionTypes, IService, ServicesAction } from '../../types/services'

export const setServices = (payload: IService[]): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES,
  payload
})

export const setServicesLoading = (payload: boolean): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES_LOADING,
  payload
})

export const addService = (payload: IService): ServicesAction => ({
  type: ServicesActionTypes.ADD_SERVICE,
  payload
})

export const removeService = (payload: string): ServicesAction => ({
  type: ServicesActionTypes.REMOVE_SERVICE,
  payload
})