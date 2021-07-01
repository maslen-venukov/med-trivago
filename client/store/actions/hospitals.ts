import { HospitalsActionTypes, IHospital, HospitalsAction } from '../../types/hospitals'

export const setHospitals = (payload: IHospital[]): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS,
  payload
})

export const setCurrentHospital = (payload: IHospital): HospitalsAction => ({
  type: HospitalsActionTypes.SET_CURRENT_HOSPITAL,
  payload
})

export const setHospitalsLoading = (payload: boolean): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS_LOADING,
  payload
})

export const removeHospital = (payload: string): HospitalsAction => ({
  type: HospitalsActionTypes.REMOVE_HOSPITAL,
  payload
})