import { Dispatch } from 'redux'
import axios from 'axios'

import catchError from '../../utils/catchError'

import { CategoriesActionTypes, ICategory, CategoriesAction } from '../../types/categories'

export const setCategories = (payload: ICategory[]): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES,
  payload
})

const setCategoriesLoading = (payload: boolean): CategoriesAction => ({
  type: CategoriesActionTypes.SET_CATEGORIES_LOADING,
  payload
})

export const fetchCategories = () => (dispatch: Dispatch<CategoriesAction>) => {
  dispatch(setCategoriesLoading(true))
  axios.get('/api/categories')
    .then(({ data }) => dispatch(setCategories(data.categories)))
    .catch(catchError)
    .finally(() => dispatch(setCategoriesLoading(false)))
}