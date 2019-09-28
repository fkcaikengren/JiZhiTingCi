
import {  handleActions } from 'redux-actions';
import * as ha from './action/homeAction'
import _util from "../../../common/util";
import * as Constant from "../common/constant";

const defaultState ={
    //任务数组
    tasks:[],
    //上一次学习
    lastLearnDate:null,
    //状态
    isLoadPending:false,
    //是否需要同步
    shouldUpload:true,
    //上传同步的状态
    isUploading:false,
    //上传同步失败
    isUploadFail:false,


}

export const home =  (state=defaultState, action) => {
    switch(action.type){
        //加载任务
        case ha.LOAD_TASKS_START :
            return { ...state,  isLoadPending:true}
        case ha.LOAD_TASKS_SUCCEED : 
            console.log('-----------loadTasks----加载完后设置lastLearnDate :------')
            console.log(_util.getDayTime(0))
            return { ...state,tasks:action.payload.tasks,
                isLoadPending:false,
                shouldUpload:false,
                isUploadFail:false,
                lastLearnDate:_util.getDayTime(0)
            };
        //更新任务
        case ha.UPDATE_TASK :
            let isNewFinish = false
            const task = action.payload.task
            const tasks = state.tasks.map((item, i)=>{
                if(item.taskOrder === task.taskOrder && item.status === task.status){ //要更新的
                    if(task.status === Constant.STATUS_0 && task.progress === Constant.IN_LEARN_FINISH){ //新学完成
                        isNewFinish = true
                    }else{
                        task.isSyncLocal = false
                        task.isSync = false
                    }
                    return task
                }else{
                    return item
                }
            })

            if(isNewFinish){
                //改其对于的 1复为需要同步
                for(let t of tasks){
                    if(t.taskOrder === task.taskOrder && t.status === Constant.STATUS_1){
                        console.log('--------修改 1复 sync------------')
                        console.log()
                        t.isSyncLocal = false
                        t.isSync = false
                        break
                    }
                }
            }
            return {...state, tasks, shouldUpload:action.payload.shouldUpload}
        //上传同步任务
        case ha.UPLOAD_TASKS_START :
            return { ...state,  isUploading:true}
        case ha.UPLOAD_TASKS_SUCCEED :
            console.log('--------保存后，上传后的tasks:------------------')
            // console.log(state.tasks)
            return { ...state, isUploading:false, shouldUpload:false, isUploadFail:false}
        case ha.UPLOAD_TASKS_FAIL :
            console.log('--------上传失败后的 tasks: -------------')
            // console.log(state.tasks)
            return { ...state, isUploading:false, shouldUpload:false, isUploadFail:true}
        //是否上传同步
        case ha.SET_SHOULD_UPLOAD:
            //获取 需要上传的id,设置其isSync=false, isSyncLocal=false。 为空则不变。
            return { ...state, shouldUpload:action.payload.shouldUpload}
        default:
            return state
    }
}
