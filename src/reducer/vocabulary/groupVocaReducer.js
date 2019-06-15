import {  handleActions } from 'redux-actions';
import * as gv from '../../action/vocabulary/groupVocaAction';

const defaultState ={

    // 生词列表
    sectionsWords:[],
}


export const groupVoca =  handleActions({

   
    [gv.LOAD_SECTIONS_WORDS]: (state, action)=>{             //加载生词本的所有生词
        return {...state, ...action.payload}
    }
}, defaultState);