import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setUser } from './user'

import catchError from '../../utils/catchError'

import { HospitalsActionTypes, IHospital, HospitalsAction, IRegisterHospitalData } from '../../types/hospitals'
import { UserAction } from '../../types/user'

export const setHospitals = (payload: IHospital[]): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS,
  payload
})

const setHospitalsLoading = (payload: boolean): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS_LOADING,
  payload
})

const removeHospital = (payload: string): HospitalsAction => ({
  type: HospitalsActionTypes.REMOVE_HOSPITAL,
  payload
})

export const fetchHospitals = (token: string) => (dispatch: Dispatch<HospitalsAction>) => {
  dispatch(setHospitalsLoading(true))
  axios.get('/api/hospitals', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setHospitals(data.hospitals)))
    .catch(catchError)
    .finally(() => dispatch(setHospitalsLoading(false)))
}

export const registerHospital = (data: IRegisterHospitalData, cb: () => void) => (dispatch: Dispatch<HospitalsAction | UserAction>) => {
  axios.post('/api/hospitals', data)
    .then(({ data }) => {
      const { token, user } = data
      dispatch(setUser({ token, user }))
      message.success('Регистрация выполнена успешно')
      cb()
    })
    .catch(catchError)
}

export const fetchRemoveHospital = (id: string, token: string) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.delete(`/api/hospitals/${id}`, {
    headers: { Authorization: token }
  })
    .then(({ data }) => {
      dispatch(removeHospital(id))
      message.success(data.message)
    })
    .catch(catchError)
}