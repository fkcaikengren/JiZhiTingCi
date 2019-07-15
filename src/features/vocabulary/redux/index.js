import { combineReducers } from "redux";
// import {navReducer} from '../../navigator/WordNav';
const vocaPlay = require('./vocaPlay');
const vocaLib = require('./vocaLib');

const reducers =  combineReducers({
    // nav:navReducer,
    ...vocaPlay,
    ...vocaLib,
});

export default reducers;