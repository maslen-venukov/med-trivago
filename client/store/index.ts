import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createWrapper } from 'next-redux-wrapper'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const makeStore = () => createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export const wrapper = createWrapper(makeStore, { debug: true })