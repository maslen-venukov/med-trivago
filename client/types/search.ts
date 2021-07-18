import { IService } from './services'

export interface ISearchResult {
  name: string
  min: number
  services: IService[]
}

export interface IFilters {
  cat: string
  city: string
  minp: string | number
  maxp: string | number
}

export type Sort = 'desc' | 'asc' | ''

export interface ISort {
  p: Sort
}

export interface ISearchState {
  q: string
  filters: IFilters
  sort: ISort
}

export enum SearchActionTypes {
  SET_QUERY = 'SET_QUERY',
  SET_FILTERS = 'SET_FILTERS',
  SET_SORT = 'SET_SORT'
}

interface ISetQuery {
  type: SearchActionTypes.SET_QUERY,
  payload: string
}

interface ISetFilters {
  type: SearchActionTypes.SET_FILTERS,
  payload: IFilters
}

interface ISetSort {
  type: SearchActionTypes.SET_SORT,
  payload: ISort
}

export type SearchAction = ISetQuery | ISetFilters | ISetSort