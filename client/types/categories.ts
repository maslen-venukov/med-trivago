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
  SET_CATEGORIES_LOADING = 'SET_CATEGORIES_LOADING',
  CREATE_CATEGORY = 'CREATE_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  REMOVE_CATEGORY = 'REMOVE_CATEGORY'
}

interface ISetCategories {
  type: CategoriesActionTypes.SET_CATEGORIES,
  payload: ICategory[]
}

interface ISetCategoriesLoading {
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload: boolean
}

interface ICreateCategory {
  type: CategoriesActionTypes.CREATE_CATEGORY,
  payload: ICategory
}

interface IUpdateCategory {
  type: CategoriesActionTypes.UPDATE_CATEGORY,
  payload: ICategory
}

interface IRemoveCategory {
  type: CategoriesActionTypes.REMOVE_CATEGORY,
  payload: string
}


export type CategoriesAction = ISetCategories | ISetCategoriesLoading | ICreateCategory | IUpdateCategory | IRemoveCategory