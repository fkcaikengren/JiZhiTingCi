import { createActions } from 'redux-actions';


export const LOAD_TASKS = 'LOAD_TASKS'                              //加载任务
export const LOAD_TASKS_START = 'LOAD_TASKS_START'                  //加载任务
export const LOAD_TASKS_SUCCEED = 'LOAD_TASKS_SUCCEED'              //加载任务
export const LOAD_TASKS_FAIL = 'LOAD_TASKS_FAIL'                     //加载任务

export const UPDATE_TASK = 'UPDATE_TASK'            //更新任务

export const UPLOAD_TASK = 'UPLOAD_TASK'          //上传同步任务
export const UPLOAD_TASK_START = 'UPLOAD_TASK_START'
export const UPLOAD_TASK_SUCCEED = 'UPLOAD_TASK_SUCCEED'
export const UPLOAD_TASK_FAIL = 'UPLOAD_TASK_FAIL'


//修改阅读得分
export const UPDATE_SCORE = 'UPDATE_SCORE'


//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTasks, updateTask, uploadTask, updateScore} = createActions({
    //加载任务
    [LOAD_TASKS]: (storedTasks, taskCount, lastLearnDate)=>{
        return {storedTasks, taskCount, lastLearnDate}
    },
   
    //更新任务
    [UPDATE_TASK]: (task)=>{
        return {task}
    },

    //上传同步任务（一次上传一个任务）
    [UPLOAD_TASK]: (storedTask) =>{
        return {storedTask}
    },

    [UPDATE_SCORE] : (userArticle)=>{
        return {userArticle}
    }
});
