import { IHospital } from '../types/hospitals'

import sortByName from './sortByName'

const getServicesFromCurrentHospital = (hospital: IHospital | null) => {
  if(!hospital) {
    return []
  }
  return hospital.serviceList
    .map(list => list.services.flat()).flat()
    .sort(sortByName)
}

export default getServicesFromCurrentHospital