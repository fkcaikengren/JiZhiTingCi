

import { createActions } from 'redux-actions';
import * as Dao from '../../dao/vocabulary/VocaTaskDao';


export const LOAD_TASK_LISTS = 'LOAD_TASK_LISTS';                //1加载任务列表



export const {loadTaskLists} = createActions({
    [LOAD_TASK_LISTS]: async () => {
        
        // return {taskLists:data};

        //数据预处理
        let vocaTasks = await Dao.loadVocaTasks();


        this.taskList = [
            {},
            {status:-1, title:'今日新学'},
            {status:10,taskOrder: 1, playDuration: 180,vocaTaskDate: 1559378082410, finished:true,},
            {status:10,taskOrder: 2, playDuration: 180,vocaTaskDate: 1559378082410, finished:false},
            {status:-1, title:'新学复习'},
            {status:11,taskOrder: 1, playDuration: 180,vocaTaskDate: 1559378082410, locked:false, finished:false},
            {status:12,taskOrder: 1, playDuration: 180,vocaTaskDate: 1559378082410, locked:true, finished:false},
            {status:11,taskOrder: 2, playDuration: 180,vocaTaskDate: 1559378082410, locked:true, finished:false},
            {status:12,taskOrder: 2, playDuration: 180,vocaTaskDate: 1559378082410, locked:true, finished:false},
            {status:-1, title:'往日回顾'},
            {status:22,taskOrder: 1, playDuration: 180,vocaTaskDate: 1559378082410, finished:false},
        ];

        let stickyHeaderIndices = [0,1,4, 9]

        return {taskList, stickyHeaderIndices};
    },
    
   
  });

