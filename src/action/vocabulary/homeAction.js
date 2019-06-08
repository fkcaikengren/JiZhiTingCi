

import { createActions } from 'redux-actions';

export const LOAD_TASK_LISTS = 'LOAD_TASK_LISTS';                //1加载任务列表



export const {loadTaskLists} = createActions({
    [LOAD_TASK_LISTS]: () => {
        let taskLists = [
            {
                id:1,
                name: '任务1'
            },{
                id:2,
                name: '任务2'
            },
        ];
        return {taskLists};
    },
    
   
  });

