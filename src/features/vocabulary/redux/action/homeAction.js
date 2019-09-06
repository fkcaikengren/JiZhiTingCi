import { createActions } from 'redux-actions';


export const LOAD_TASKS = 'LOAD_TASKS'                      //加载任务
export const UPDATE_TASK = 'UPDATE_TASK'

//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTasks, updateTask} = createActions({
    //加载任务
    [LOAD_TASKS]: (tasks)=>{
        return {tasks}
    },
   
    //更新任务
    [UPDATE_TASK]: (task)=>{
        return {task}
    }
    
});
