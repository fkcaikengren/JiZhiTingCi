

import { combineReducers } from "redux";


import {navReducer} from '../navigation/AppWithNavigationState';
const home = require('../features/vocabulary/redux/home');
const vocaPlay = require('../features/vocabulary/redux/vocaPlay');
const vocaLib = require('../features/vocabulary/redux/vocaLib');
const vocaList = require('../features/vocabulary/redux/vocaList')

const article = require("../features/reading/redux/article");

const reducers =  combineReducers({
    nav:navReducer,
    ...home,
    ...vocaPlay,
    ...vocaLib,
    ...vocaList,

    //文章模块
    ...article
});

export default reducers;