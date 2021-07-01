import { RegisterLinksActionTypes, IRegisterLink, RegisterLinksAction } from '../../types/registerLinks'

export const setRegisterLinks = (payload: IRegisterLink[]): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS,
  payload
})

export const setRegisterLinksLoading = (payload: boolean): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.SET_REGISTER_LINKS_LOADING,
  payload
})

export const createRegisterLinks = (payload: IRegisterLink): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.CREATE_REGISTER_LINK,
  payload
})

export const removeRegisterLink = (payload: string): RegisterLinksAction => ({
  type: RegisterLinksActionTypes.REMOVE_REGISTER_LINK,
  payload
})