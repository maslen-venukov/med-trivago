import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { HospitalsActionTypes, IHospital, HospitalsAction } from '../../types/hospitals'

export const setHospitals = (payload: IHospital[]): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS,
  payload
})

const setHospitalsLoading = (payload: boolean): HospitalsAction => ({
  type: HospitalsActionTypes.SET_HOSPITALS_LOADING,
  payload
})

export const fetchHospitals = (token: string) => (dispatch: Dispatch<HospitalsAction>) => {
  dispatch(setHospitalsLoading(true))
  axios.get('/api/hospitals', {
    headers: { Authorization: token }
  })
    .then(({ data }) => dispatch(setHospitals(data.hospitals)))
    .catch(e => message.error(e.response.data?.message || 'Ошибка при загрузке мед. учреждений'))
    .finally(() => dispatch(setHospitalsLoading(false)))
}