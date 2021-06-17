import { combineReducers } from 'redux'

import user from './user'
import search from './search'
import categories from './categories'
import hospitals from './hospitals'

const rootReducer = combineReducers({
  user,
  search,
  categories,
  hospitals
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer