import { createActions } from 'redux-actions';


export const LOAD_TASKS = 'LOAD_TASKS'                      //加载任务

//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTasks} = createActions({
    //加载任务
    [LOAD_TASKS]: (tasks)=>{
        return {tasks}
    },
   
    
});
