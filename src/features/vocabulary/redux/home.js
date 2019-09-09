
import {  handleActions } from 'redux-actions';
import * as ha from './action/homeAction'

const defaultState ={
    //任务数组
    tasks:[],
    //状态
    isLoadPending:false,
    
}


export const home =  handleActions({
  
    //加载任务
    [ha.LOAD_TASKS] : (state, action) => {
        return { ...state, tasks:action.payload.tasks};
    },
    //更新任务
    [ha.UPDATE_TASK] : (state, action) => {
        const task = action.payload.task
        const tasks = state.tasks.map((item, i)=>{
            if(item.taskOrder === task.taskOrder && item.status === task.status){
                console.log('copy task')
                return action.payload.task
            }else{
                return item
            }
        })
        return {...state, tasks}
        
    },

}, defaultState);

