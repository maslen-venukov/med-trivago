import { ServicesActionTypes, IService, ServicesAction } from '../../types/services'

export const setServices = (payload: IService[]): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES,
  payload
})

export const setServicesLoading = (payload: boolean): ServicesAction => ({
  type: ServicesActionTypes.SET_SERVICES_LOADING,
  payload
})

export const createService = (payload: IService): ServicesAction => ({
  type: ServicesActionTypes.CREATE_SERVICE,
  payload
})

export const updateService = (payload: IService): ServicesAction => ({
  type: ServicesActionTypes.UPDATE_SERVICE,
  payload
})

export const removeService = (payload: string): ServicesAction => ({
  type: ServicesActionTypes.REMOVE_SERVICE,
  payload
})