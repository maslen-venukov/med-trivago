import { CategoriesActionTypes, ICategory, CategoriesAction } from '../../types/categories'

export const setCategories = (payload: ICategory[]): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES,
  payload
})

export const setCategoriesLoading = (payload: boolean): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload
})