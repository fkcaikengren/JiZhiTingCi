import {  handleActions } from 'redux-actions';
import * as gv from '../../action/vocabulary/groupVocaAction';

const defaultState ={

    // 生词表
    groupName:'',
    groupVocas:[],
}


export const groupVoca =  handleActions({

   
    [gv.LOAD_GROUP_VOCAS]: (state, action)=>{             //加载生词本的所有生词
        return {...state, groupName:action.payload.groupName, groupVocas:action.payload.groupVocas}
    }
}, defaultState);