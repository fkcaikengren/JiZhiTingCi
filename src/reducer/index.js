import { combineReducers } from "redux";
// import {navReducer} from '../../navigator/WordNav';
const vocaPlay = require('./vocabulary/vocaPlayReducer');
const home = require('./vocabulary/homeReducer');
const vocaGroup = require('./vocabulary/vocaGroupReducer');
const groupVoca = require('./vocabulary/groupVocaReducer');
const vocaLib = require('./vocabulary/vocaLibReducer');
const learnNew = require('./vocabulary/learnNewReducer');

const reducers =  combineReducers({
    // nav:navReducer,
    ...vocaPlay,
    ...home,
    ...vocaGroup,
    ...groupVoca,
    ...vocaLib,
    ...learnNew
});

export default reducers;