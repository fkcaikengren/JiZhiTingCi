
import {  handleActions } from 'redux-actions';
import * as vl from './action/vocaListAction'

const defaultState ={
    //是否处于编辑状态
    onEdit:false
}


export const vocaList =  handleActions({

    [vl.TOGGLE_EDIT] : (state, action) => {
        return { ...state,  onEdit:!state.onEdit};
    },

}, defaultState);