import { createActions } from 'redux-actions';


export const LOAD_TASKS = 'LOAD_TASKS'                              //加载任务
export const LOAD_TASKS_START = 'LOAD_TASKS_START'                  //加载任务
export const LOAD_TASKS_SUCCEED = 'LOAD_TASKS_SUCCEED'              //加载任务
export const LOAD_TASKS_FAIL = 'LOAD_TASKS_FAIL'                     //加载任务

export const UPDATE_TASK = 'UPDATE_TASK'            //更新任务

export const SYNC_TASK = 'SYNC_TASK'          //上传同步任务
export const SYNC_TASK_START = 'SYNC_TASK_START'
export const SYNC_TASK_SUCCEED = 'SYNC_TASK_SUCCEED'
export const SYNC_TASK_FAIL = 'SYNC_TASK_FAIL'


//修改阅读得分
export const UPDATE_SCORE = 'UPDATE_SCORE'

const fn = (payload) => {
    return payload
}

//驼峰式命名，不可以更改(与变量名必须对应)
export const { loadTasks, updateTask, syncTask, updateScore } = createActions({
    //加载任务
    [LOAD_TASKS]: fn,

    //更新任务
    [UPDATE_TASK]: fn,

    //上传同步任务
    [SYNC_TASK]: fn,

    // 更新分数
    [UPDATE_SCORE]: fn
});
