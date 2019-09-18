import { createActions } from 'redux-actions';


export const LOAD_TASKS = 'LOAD_TASKS'                              //加载任务
export const LOAD_TASKS_START = 'LOAD_TASKS_START'                  //加载任务
export const LOAD_TASKS_SUCCEED = 'LOAD_TASKS_SUCCEED'              //加载任务
export const LOAD_TASKS_FAIL = 'LOAD_TASKS_FAIL'                     //加载任务

export const UPDATE_TASK = 'UPDATE_TASK'            //更新任务

export const UPLOAD_TASKS = 'UPLOAD_TASKS'          //上传同步任务 
export const UPLOAD_TASKS_START = 'UPLOAD_TASKS_START'
export const UPLOAD_TASKS_SUCCEED = 'UPLOAD_TASKS_SUCCEED'
export const UPLOAD_TASKS_FAIL = 'UPLOAD_TASKS_FAIL'

//设置是否上传同步
export const SET_SHOULD_UPLOAD = 'SET_SHOULD_UPLOAD'


//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTasks, updateTask, uploadTasks, setShouldUpload} = createActions({
    //加载任务
    [LOAD_TASKS]: (tasks)=>{
        return {tasks}
    },
   
    //更新任务
    [UPDATE_TASK]: (task)=>{
        return {task}
    },

    //上传同步任务
    [UPLOAD_TASKS]: (tasks) =>{
        console.log(tasks)
        return {tasks}
    },
    //
    [SET_SHOULD_UPLOAD]: (shouldUpload)=>{
        return {shouldUpload}
    }
    
});
