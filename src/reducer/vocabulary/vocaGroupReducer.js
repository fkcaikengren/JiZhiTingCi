import {  handleActions } from 'redux-actions';
import * as vg from '../../action/vocabulary/vocaGroupAction';

const defaultState ={

    //生词本数据
    vocaGroups:[],
}


export const vocaGroup =  handleActions({

    [vg.LOAD_VOCA_GROUPS] : (state, action) => {
        return { ...state,  vocaGroups: action.payload.vocaGroups};
    },
   
}, defaultState);