
import { combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

import { home } from '../features/vocabulary/redux/home'
import { vocaLib } from '../features/vocabulary/redux/vocaLib'
import { appReducer } from './appReducer'
import { navReducer } from '../navigation/AppWithNavigationState'
const vocaPlay = require('../features/vocabulary/redux/vocaPlay');
const vocaList = require('../features/vocabulary/redux/vocaList')

const article = require("../features/reading/redux/article");

/** 实现某个reducer的某个状态不想要被持久化 */
const homeConfig = {
    key: 'home',
    storage: AsyncStorage,
    blacklist: ['isLoadPending', 'shouldUpload', 'isUploading']
};
const homeReducer = persistReducer(homeConfig, home)

const vocalibConfig = {
    key: 'vocaLib',
    storage: AsyncStorage,
    blacklist: ['isLoadPending', 'books']
}
const vocaLibReducer = persistReducer(vocalibConfig, vocaLib)

const reducers = combineReducers({
    nav: navReducer,
    home: homeReducer,
    vocaLib: vocaLibReducer,
    app: appReducer,
    ...vocaPlay,
    ...vocaList,
    //文章模块
    ...article
});

export default reducers;