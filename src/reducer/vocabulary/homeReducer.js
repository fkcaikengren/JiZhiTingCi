import {  handleActions } from 'redux-actions';
import * as homeAction from '../../action/vocabulary/homeAction';

const defaultState ={

    //1 查看任务列表
    taskLists:[
        {
            id:1,
            name: '任务1'
        },
    ]
    
}


export const home =  handleActions({

    [homeAction.LOAD_TASK_LISTS] : (state, action) => ({ ...state, wordList:action.payload.taskLists }),

}, defaultState);