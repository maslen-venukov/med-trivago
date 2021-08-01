import { SidebarAction, SidebarActionTypes } from '../../types/sidebar'

export const setMobile = (payload: boolean): SidebarAction => ({
  type: SidebarActionTypes.SET_MOBILE,
  payload
})

export const setVisible = (payload: boolean): SidebarAction => ({
  type: SidebarActionTypes.SET_VISIBLE,
  payload
})