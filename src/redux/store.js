
import {createStore, applyMiddleware,compose} from 'redux';
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import {navigationReduxMiddleware} from '../navigation/AppWithNavigationState'
import reducers from './reducer'
import rootSaga from './rootSaga'


//创建saga中间件
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(applyMiddleware(navigationReduxMiddleware,sagaMiddleware, logger));

export const store = createStore(reducers, enhancer);

//运行saga中间件
sagaMiddleware.run(rootSaga, store);









/**  持久化 */
// const persistConfig = {
//     key: 'root',
//     storage: AsyncStorage,
//     //blacklist的最终对象是最底层的blacklist,这个TaskReducer3下面还有一个blacklist: ['undo'],
//     //因此，undo这个属性不会被持久化
//     blacklist: ['TaskReducer3'] 
//   }

  
// export const persistedReducer = persistReducer(persistConfig, reducers)
// export const store = createStore(persistedReducer, enhancer);
// export const persistor = persistStore(store);


