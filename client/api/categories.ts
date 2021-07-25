import { Dispatch } from 'redux'
import axios from 'axios'
import message from 'antd/lib/message'

import { setCategories, setCategoriesLoading, createCategory, updateCategory, removeCategory } from '../store/actions/categories'

import catchError from '../utils/catchError'

import { CategoriesAction } from '../types/categories'

export const fetchCategories = () => (dispatch: Dispatch<CategoriesAction>) => {
  dispatch(setCategoriesLoading(true))
  axios.get('/api/categories')
    .then(({ data }) => dispatch(setCategories(data.categories)))
    .catch(catchError)
    .finally(() => dispatch(setCategoriesLoading(false)))
}

export const fetchCreateCategory = (category: FormData) => (dispatch: Dispatch<CategoriesAction>) => {
  axios.post('/api/categories', category)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(createCategory(data.category))
    })
    .catch(catchError)
}

export const fetchUpdateCategory = (id: string, category: FormData) => (dispatch: Dispatch<CategoriesAction>) => {
  axios.put(`/api/categories/${id}`, category)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(updateCategory(data.category))
    })
    .catch(catchError)
}

export const fetchRemoveCategory = (id: string) => (dispatch: Dispatch<CategoriesAction>) => {
  axios.delete(`/api/categories/${id}`)
    .then(({ data }) => {
      message.success(data.message)
      dispatch(removeCategory(id))
    })
    .catch(catchError)
}