import { combineReducers } from 'redux'

import categories from './categories'
import search from './search'

const rootReducer = combineReducers({
  categories,
  search
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer