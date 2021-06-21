import { IServicesState, ServicesAction, ServicesActionTypes } from '../../types/services'

const initialState: IServicesState = {
  services: [],
  loading: false
}

const services = (state = initialState, action: ServicesAction): IServicesState => {
  switch(action.type) {
    case ServicesActionTypes.SET_SERVICES:
      return {
        ...state,
        services: action.payload
      }

    case ServicesActionTypes.SET_SERVICES_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    default:
      return state
  }
}

export default services