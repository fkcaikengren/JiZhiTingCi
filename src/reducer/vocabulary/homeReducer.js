import {  handleActions } from 'redux-actions';
import * as ha from '../../action/vocabulary/homeAction';

const defaultState ={

    //1 查看任务列表
    taskList: [{}],
    stickyHeaderIndices: [0]
}


export const home =  handleActions({

    [ha.LOAD_TASK_LISTS] : (state, action) => (
        { ...state, ...action.payload }
    ),

}, defaultState);