export interface ICategory {
  _id: string
  name: string
}

export interface ICategoriesState {
  categories: ICategory[]
  loading: boolean
}

export enum CategoriesActionTypes {
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING'
}

interface ISetCategories {
  type: CategoriesActionTypes.SET_CATEGORIES,
  payload: ICategory[]
}

interface ISetCategoriesLoading {
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload: boolean
}

export type CategoriesAction = ISetCategories | ISetCategoriesLoading