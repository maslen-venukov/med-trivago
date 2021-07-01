import { Dispatch } from 'redux'
import axios from 'axios'

import { setCategories, setCategoriesLoading } from '../store/actions/categories'

import catchError from '../utils/catchError'

import { CategoriesAction } from '../types/categories'

export const fetchCategories = () => (dispatch: Dispatch<CategoriesAction>) => {
  dispatch(setCategoriesLoading(true))
  axios.get('/api/categories')
    .then(({ data }) => dispatch(setCategories(data.categories)))
    .catch(catchError)
    .finally(() => dispatch(setCategoriesLoading(false)))
}