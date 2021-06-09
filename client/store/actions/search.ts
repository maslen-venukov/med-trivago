import { SearchActionTypes, IFilters, ISort, SearchAction } from '../../types/search'

export const setQuery = (payload: string): SearchAction => ({
  type: SearchActionTypes.SET_QUERY,
  payload
})

export const setFilters = (payload: IFilters): SearchAction => ({
  type: SearchActionTypes.SET_FILTERS,
  payload
})

export const setSort = (payload: ISort): SearchAction => ({
  type: SearchActionTypes.SET_SORT,
  payload
})