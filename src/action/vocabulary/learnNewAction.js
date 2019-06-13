import {createActions} from 'redux-actions'
import * as Dao from '../../dao/vocabulary/VocaTaskDao'
import {IN_PLAY , IN_CARD , IN_TEST1 , IN_RETEST1 , IN_TEST2, IN_RETEST2,} from '../../constant'

    
//任务信息和任务单词
export const LOAD_TASK = 'LOAD_TASK'
//跳到下一个
export const NEXT_WORD = 'NEXT_WORD'
    
    //完成轮播
export const FINISH_PLAY = 'FINISH_PLAY'

    //完成卡片学习
export const FINISH_CARD_LEARN = 'FINISH_CARD_LEARN'

    //完成测试1
export const FINISH_TEST1 = 'FINISH_TEST1'

    //完成测试2
export const FINISH_TEST2 = 'FINISH_TEST2'
    



export const {loadTask, nextWord,  finishPlay, finishCardLearn} = createActions({
    [LOAD_TASK]: async (taskOrder)=>{ //加载数据
        let task = {}
        try{
            task = await Dao.loadTask(taskOrder);
        }catch(err){
            console.log('learnCardAction:加载任务失败');
            console.log(err)
        }
        
        task.isSync =  false   //isSync属性：是否同步
        task.learnStatus = IN_CARD  //目前所处的阶段[轮播，卡片，测试1，重测1，测试2，重测2]
        
        for(let w of task.words){ //testWrongNum 属性： 学习测试中的错误次数
            w.testWrongNum = 0;
        }
        return {task}
    },
    [NEXT_WORD]: ()=>{
    },
    [FINISH_PLAY]: ()=>{    //完成轮播

    },
    [FINISH_CARD_LEARN] :()=>{  //完成卡片学习
       
    }
});