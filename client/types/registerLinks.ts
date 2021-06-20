export interface IRegisterLink {
  _id: string
  link: string
  email: string
  createdAt: Date
}

export interface IRegisterLinksState {
  registerLinks: IRegisterLink[]
  loading: boolean
}

export enum RegisterLinksActionTypes {
  SET_REGISTER_LINKS = 'SET_REGISTER_LINKS',
  SET_REGISTER_LINKS_LOADING = 'SET_REGISTER_LINKS_LOADING',
  CREATE_REGISTER_LINK = 'CREATE_REGISTER_LINK',
  REMOVE_REGISTER_LINK = 'REMOVE_REGISTER_LINK'
}

interface ISetRegisterLinks {
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS,
  payload: IRegisterLink[]
}

interface ISetRegisterLinksLoading {
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS_LOADING,
  payload: boolean
}

interface ICreateRegisterLink {
  type: RegisterLinksActionTypes.CREATE_REGISTER_LINK,
  payload: IRegisterLink
}

interface IRemoveRegisterLink {
  type: RegisterLinksActionTypes.REMOVE_REGISTER_LINK,
  payload: string
}

export type RegisterLinksAction = ISetRegisterLinks | ISetRegisterLinksLoading | ICreateRegisterLink | IRemoveRegisterLink