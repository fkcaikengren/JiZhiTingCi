
import {  handleActions } from 'redux-actions';
import * as ha from './action/homeAction'

const defaultState ={
    //任务数组
    tasks:[],
    //状态
    isLoadPending:false,
}


export const home =  handleActions({
  
    [ha.LOAD_TASKS] : (state, action) => {
        return { ...state, tasks:action.payload.tasks};
    },

}, defaultState);

