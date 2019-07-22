

import { combineReducers } from "redux";
// import {navReducer} from '../../navigator/WordNav';
const vocaPlay = require('../features/vocabulary/redux/vocaPlay');
const vocaLib = require('../features/vocabulary/redux/vocaLib');
const home = require('../features/vocabulary/redux/home');

const reducers =  combineReducers({
    // nav:navReducer,
    ...vocaPlay,
    ...vocaLib,
    ...home,
});

export default reducers;