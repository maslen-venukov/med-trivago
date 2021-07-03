import { ICategoriesState, CategoriesAction, CategoriesActionTypes, ICategory } from '../../types/categories'

const initialState: ICategoriesState = {
  categories: [],
  loading: false
}

const categories = (state = initialState, action: CategoriesAction): ICategoriesState => {
  const sortByName = (a: ICategory, b: ICategory) => a.name.localeCompare(b.name, 'ru')

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
          .map(category => category._id === action.payload._id ? action.payload : category)
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