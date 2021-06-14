export interface IService {
  _id?: string
  name: string
  price: number
  category: string
  hospital: {
    name: string
    address: string
    phone: string
  }
}