import { combineReducers } from 'redux'

import user from './user'
import search from './search'
import categories from './categories'
import hospitals from './hospitals'
import registerLinks from './registerLinks'
import services from './services'
import socket from './socket'

const rootReducer = combineReducers({
  user,
  search,
  categories,
  hospitals,
  registerLinks,
  services,
  socket
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer