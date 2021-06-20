import { IRegisterLinksState, RegisterLinksAction, RegisterLinksActionTypes } from '../../types/registerLinks'

const initialState: IRegisterLinksState = {
  registerLinks: [],
  loading: false
}

const registerLinks = (state = initialState, action: RegisterLinksAction): IRegisterLinksState => {
  switch(action.type) {
    case RegisterLinksActionTypes.SET_REGISTER_LINKS:
      return {
        ...state,
        registerLinks: action.payload
      }

    case RegisterLinksActionTypes.SET_REGISTER_LINKS_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case RegisterLinksActionTypes.CREATE_REGISTER_LINK: {
      const existingLink = state.registerLinks.find(link => link.email === action.payload.email)
      const registerLinks = existingLink
        ? state.registerLinks
          .map(link => link.email === existingLink.email ? action.payload : link)
          .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
        : [action.payload, ...state.registerLinks]
      return {
        ...state,
        registerLinks
      }
    }

    case RegisterLinksActionTypes.REMOVE_REGISTER_LINK:
      return {
        ...state,
        registerLinks: state.registerLinks.filter(link => link._id !== action.payload)
      }

    default:
      return state
  }
}

export default registerLinks