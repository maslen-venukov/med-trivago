export interface ISidebarState {
  mobile: boolean,
  visible: boolean
}

export enum SidebarActionTypes {
  SET_MOBILE = 'SET_MOBILE',
  SET_VISIBLE = 'SET_VISIBLE'
}

export interface ISetMobile {
  type: SidebarActionTypes.SET_MOBILE,
  payload: boolean
}

export interface ISetVisible {
  type: SidebarActionTypes.SET_VISIBLE,
  payload: boolean
}

export type SidebarAction = ISetMobile | ISetVisible