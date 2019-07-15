import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise';


import reducers from '../features/vocabulary/redux'


let store = createStore(reducers, applyMiddleware(promiseMiddleware, logger))
export default store