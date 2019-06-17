import { combineReducers } from "redux";
// import {navReducer} from '../../navigator/WordNav';
const vocaPlay = require('./vocabulary/vocaPlayReducer');
const vocaLib = require('./vocabulary/vocaLibReducer');

const reducers =  combineReducers({
    // nav:navReducer,
    ...vocaPlay,
    ...vocaLib,
});

export default reducers;