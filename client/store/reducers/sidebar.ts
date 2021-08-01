import { ISidebarState, SidebarAction, SidebarActionTypes } from '../../types/sidebar'

const initialState: ISidebarState = {
  mobile: false,
  visible: false
}

const sidebar = (state = initialState, action: SidebarAction): ISidebarState => {
  switch(action.type) {
    case SidebarActionTypes.SET_MOBILE:
      return {
        ...state,
        mobile: action.payload
      }

    case SidebarActionTypes.SET_VISIBLE:
      return {
        ...state,
        visible: action.payload
      }

    default:
      return state
  }
}

export default sidebar