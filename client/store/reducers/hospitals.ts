import { IHospitalsState, HospitalsAction, HospitalsActionTypes } from '../../types/hospitals'

const initialState: IHospitalsState = {
  hospitals: [],
  loading: false
}

const hospitals = (state = initialState, action: HospitalsAction): IHospitalsState => {
  switch(action.type) {
    case HospitalsActionTypes.SET_HOSPITALS:
      return {
        ...state,
        hospitals: action.payload
      }

    case HospitalsActionTypes.SET_HOSPITALS_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case HospitalsActionTypes.REMOVE_HOSPITAL:
      return {
        ...state,
        hospitals: state.hospitals.filter(hospital => hospital._id !== action.payload)
      }

    default:
      return state
  }
}

export default hospitals