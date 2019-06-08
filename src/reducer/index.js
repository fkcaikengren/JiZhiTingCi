import { combineReducers } from "redux";
// import {navReducer} from '../../navigator/WordNav';
const vocaPlay = require('./vocabulary/vocaPlayReducer');
const home = require('./vocabulary/homeReducer');



const reducers =  combineReducers({
    // nav:navReducer,
    ...vocaPlay,
    ...home,
});

export default reducers;