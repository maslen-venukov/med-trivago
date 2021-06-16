import { combineReducers } from 'redux'

import categories from './categories'
import search from './search'
import user from './user'

const rootReducer = combineReducers({
  categories,
  search,
  user
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer