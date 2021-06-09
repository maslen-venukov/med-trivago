import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { CategoriesActionTypes, ICategory, CategoriesAction } from '../../types/categories'

const setCategories = (payload: ICategory[]): CategoriesAction => ({
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
    .catch(e => message.error(e.response.data?.message || 'Ошибка при загрузке категорий'))
    .finally(() => setCategoriesLoading(false))
}