import { IHospital } from '../types/hospitals'

const getServicesFromCurrentHospital = (hospital: IHospital | null) => {
  if(!hospital) {
    return []
  }
  return hospital.serviceList.map(list => list.services.flat()).flat()
}

export default getServicesFromCurrentHospital