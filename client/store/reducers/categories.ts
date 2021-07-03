import { ICategoriesState, CategoriesAction, CategoriesActionTypes } from '../../types/categories'

import sortByName from '../../utils/sortByName'
import updateState from '../../utils/updateState'

const initialState: ICategoriesState = {
  categories: [],
  loading: false
}

const categories = (state = initialState, action: CategoriesAction): ICategoriesState => {
  switch(action.type) {
    case CategoriesActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }

    case CategoriesActionTypes.SET_CATEGORIES_LOADING:
      return {
        ...state,
        loading: action.payload
      }

    case CategoriesActionTypes.CREATE_CATEGORY:
      return {
        ...state,
        categories: [action.payload, ...state.categories].sort(sortByName)
      }

    case CategoriesActionTypes.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories
          .map(category => updateState(category, action.payload))
          .sort(sortByName)
      }

    case CategoriesActionTypes.REMOVE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload)
      }

    default:
      return state
  }
}

export default categories