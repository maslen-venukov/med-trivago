import { CategoriesActionTypes, ICategory, CategoriesAction } from '../../types/categories'

export const setCategories = (payload: ICategory[]): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES,
  payload
})

export const setCategoriesLoading = (payload: boolean): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload
})

export const createCategory = (payload: ICategory): CategoriesAction => ({
  type: CategoriesActionTypes.CREATE_CATEGORY,
  payload
})

export const updateCategory = (payload: ICategory): CategoriesAction => ({
  type: CategoriesActionTypes.UPDATE_CATEGORY,
  payload
})

export const removeCategory = (payload: string): CategoriesAction => ({
  type: CategoriesActionTypes.REMOVE_CATEGORY,
  payload
})