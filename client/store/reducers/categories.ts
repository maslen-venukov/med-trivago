import { ICategoriesState, CategoriesAction, CategoriesActionTypes } from '../../types/categories'

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

    default:
      return state
  }
}

export default categories