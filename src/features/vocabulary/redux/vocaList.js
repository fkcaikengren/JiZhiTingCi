
import {  handleActions } from 'redux-actions';
import * as vl from './action/vocaListAction'
import { LOGOUT } from '../../mine/redux/action/mineAction'

const defaultState ={
    //是否处于编辑状态
    onEdit:false
}


export const vocaList = (state = defaultState, action) => {
    switch(action.type){
        case vl.TOGGLE_EDIT : 
            return { ...state,  onEdit:!state.onEdit}
        case LOGOUT :
            return defaultState
        default:
            return state
    }
}

