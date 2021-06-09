import { ISearchState, SearchAction, SearchActionTypes } from '../../types/search'

const initialState: ISearchState = {
  q: '',
  filters: {
    cat: '',
    minp: '',
    maxp: ''
  },
  sort: {
    p: ''
  }
}

const search = (state = initialState, action: SearchAction): ISearchState => {
  switch(action.type) {
    case SearchActionTypes.SET_QUERY:
      return {
        ...state,
        q: action.payload
      }

    case SearchActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: action.payload
      }

    case SearchActionTypes.SET_SORT:
      return {
        ...state,
        sort: action.payload
      }

    default:
      return state
  }
}

export default search