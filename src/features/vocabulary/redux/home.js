
import {  handleActions } from 'redux-actions';
import * as ha from './action/homeAction'

const defaultState ={
    //任务数组
    tasks:[],
    //状态
    isLoadPending:false,
    //是否需要同步
    shouldUpload:true,
    //同步数据的状态
    isUploading:false,
}

export const home =  (state=defaultState, action) => {
    switch(action.type){
        //加载任务
        case ha.LOAD_TASKS:
            return { ...state, tasks:action.payload.tasks};
        case ha.LOAD_TASKS_START :
            return { ...state,  isLoadPending:true}
        case ha.LOAD_TASKS_SUCCEED : 
            console.log('-----------load tasks----------')
            console.log(action.payload.tasks)
            return { ...state,tasks:action.payload.tasks, isLoadPending:false};
        //更新任务
        case ha.UPDATE_TASK :
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
        //上传同步任务
        case ha.UPLOAD_TASKS_START :
            return { ...state,  isUploading:true}
        case ha.UPLOAD_TASKS_SUCCEED : 
            return { ...state, isUploading:false, shouldUpload:false}
        case ha.UPLOAD_TASKS_FAIL : 
            return { ...state, isUploading:false, shouldUpload:false}

        default:
            return state
    }
}
