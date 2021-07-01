import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setHospitals, setHospitalsLoading, setCurrentHospital, removeHospital } from '../store/actions/hospitals'
import { setUser } from '../store/actions/user'

import catchError from '../utils/catchError'

import { HospitalsAction, IRegisterHospitalData, IAddCategoryData } from '../types/hospitals'
import { UserAction } from '../types/user'

export const fetchHospitals = () => (dispatch: Dispatch<HospitalsAction>) => {
  dispatch(setHospitalsLoading(true))
  axios.get('/api/hospitals')
    .then(({ data }) => dispatch(setHospitals(data.hospitals)))
    .catch(catchError)
    .finally(() => dispatch(setHospitalsLoading(false)))
}

export const fetchCurrentHospital = () => (dispatch: Dispatch<HospitalsAction>) => {
  axios.get('/api/hospitals/user')
    .then(({ data }) => dispatch(setCurrentHospital(data.hospital)))
    .catch(catchError)
}

export const registerHospital = (data: IRegisterHospitalData, cb: () => void) => (dispatch: Dispatch<HospitalsAction | UserAction>) => {
  axios.post('/api/hospitals', data)
    .then(({ data }) => {
      dispatch(setUser(data.user))
      message.success('Регистрация выполнена успешно')
      cb()
    })
    .catch(catchError)
}

export const fetchRemoveHospital = (id: string) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.delete(`/api/hospitals/${id}`)
    .then(({ data }) => {
      dispatch(removeHospital(id))
      message.success(data.message)
    })
    .catch(catchError)
}

export const fetchAddActiveCategory = (data: IAddCategoryData) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.post('/api/hospitals/service-lists', data)
    .then(({ data }) => {
      dispatch(setCurrentHospital(data.hospital))
      message.success(data.message)
    })
    .catch(catchError)
}

export const fetchRemoveActiveCategory = (categoryId: string) => (dispatch: Dispatch<HospitalsAction>) => {
  axios.delete(`/api/hospitals/service-lists/${categoryId}`)
    .then(({ data }) => dispatch(setCurrentHospital(data.hospital)))
    .catch(catchError)
}