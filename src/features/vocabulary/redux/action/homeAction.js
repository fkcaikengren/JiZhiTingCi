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

//修改阅读得分
export const UPDATE_SCORE = 'UPDATE_SCORE'


//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTasks, updateTask, uploadTasks, updateScore} = createActions({
    //加载任务
    [LOAD_TASKS]: (storedTasks, taskCount, lastLearnDate)=>{
        return {storedTasks, taskCount, lastLearnDate}
    },
   
    //更新任务
    [UPDATE_TASK]: (task, shouldUpload=true)=>{
        return {task, shouldUpload}
    },

    //上传同步任务
    [UPLOAD_TASKS]: (storedTasks) =>{
        return {storedTasks}
    },

    [UPDATE_SCORE] : (userArticle)=>{
        return {userArticle}
    }
});
