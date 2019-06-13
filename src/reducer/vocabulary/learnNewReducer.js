import {handleActions} from 'redux-actions'
import * as ln from '../../action/vocabulary/learnNewAction'
import {IN_PLAY , IN_CARD , IN_TEST1 , IN_RETEST1 , IN_TEST2, IN_RETEST2,} from '../../constant'

const defaultState = {

    //任务信息和任务单词
    task:{
    },
    //单词进度, //跳到下一个
    curIndex:0,

    
}


export const learnNew = handleActions({
    [ln.LOAD_TASK]:(state, action) => (             //加载任务数据
        { ...state, ...action.payload }
    ),
    [ln.NEXT_WORD]:(state, action) => ({ ...state, curIndex:state.curIndex+1 }),    //下一个单词
    [ln.FINISH_CARD_LEARN]: (state, action) =>{     //完成卡片学习
        //修改任务数据
        let task = {...state.task, learnStatus:IN_TEST1 }
        return {...state, task, curIndex:0}
    }
        

}, defaultState);