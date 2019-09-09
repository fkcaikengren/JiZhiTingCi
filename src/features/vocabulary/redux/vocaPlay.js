import {  handleActions } from 'redux-actions';
import * as vpAction from './action/vocaPlayAction';
import {Themes} from '../common/vocaConfig'
import VocaTaskDao from '../service/VocaTaskDao'
import * as Constant from '../common/constant'
import VocaUtil from '../common/vocaUtil';

/**
 *  总结：
 *  1. state的一级变量不可以直接修改，但是二级变量可以直接修改。
 *     例如：task不可以在state里直接修改，但是task的words可以直接修改 
 */


const defaultState ={

    //任务,包含了单词列表 
    task:{
        words:[]
    },
    showWordInfos:[],
    //当前下标
    curIndex:0,
    //是否播放, <=0表示暂停，>0表示播放
    autoPlayTimer:0,
    //时间间隔
    interval:1.0,
    //是否显示英文单词
    showWord:true,
    //是否显示中文释义
    showTran:true,
    //主题数组
    themes:Themes,
    //当前主题id
    themeId: 1,
     //加载状态
    isLoadPending:false,
}


export const vocaPlay =  handleActions({

    //加载任务         
    [vpAction.LOAD_TASK] : (state, action) => ({ ...state, 
        task:action.payload.task, 
        curIndex:action.payload.task.curIndex,
        showWordInfos:action.payload.showWordInfos,
        }),         
    //暂停、播放
    [vpAction.CHANGE_PLAY_TIMER] : (state, action) => ({ ...state, autoPlayTimer:action.payload.autoPlayTimer }),
    //更新当前单词
    [vpAction.CHANGE_CUR_INDEX] : (state, action) => {
        const beforeCount = state.task.wordCount
        const index = state.curIndex
        let leftTimes = state.task.leftTimes
        let newTask = state.task
        //播放到最后一个单词
        if(index+1 === beforeCount){
            
            leftTimes--
        }
        // 学习模式下的轮播 -> 记录curIndex,leftTimes 拷贝task给下一阶段
        newTask = {...state.task, curIndex:action.payload.curIndex, leftTimes}
        return { ...state, task:newTask, curIndex:action.payload.curIndex, }
        
    },
    //改变播放间隔
    [vpAction.CHANGE_INTERVAL] : (state, action) => ({ ...state, interval:action.payload.interval }),
    //是否显示单词
    [vpAction.TOGGLE_WORD] : (state, action) => {
        if(action.payload.showWord === null){
            return { ...state, showWord:!state.showWord }
        }else{
            return { ...state, showWord:action.payload.showWord }
        }
        
    },
    //是否显示翻译
    [vpAction.TOGGLE_TRAN] : (state, action) => {
        if(action.payload.showTran === null){
            return { ...state, showTran:!state.showTran }
        }else{
            return { ...state, showTran:action.payload.showTran }
        }
    },
    //改变主题
    [vpAction.CHANGE_THEME] : (state, action) => ({ ...state, themeId:action.payload.themeId }),
    [vpAction.TOGGLE_TASK_MODAL]: (state, action) => ({ ...state, tasksModalOpened:action.payload.tasksModalOpened }),
    //Pass单词
    [vpAction.PASS_WORD]: (state, action) => {
        let beforeCount = state.task.wordCount
        let index = state.curIndex
        let task = state.task
        const showWordInfos = state.showWordInfos
        const word = action.payload.word

        //修改passed, wordCount, 保存到realm数据库
        const newShowWordInfos = VocaUtil.passWordInTask(task.words,word,task.taskOrder, beforeCount, showWordInfos)
        
        //pass最后一个单词，修改下标
        if(index+1 === beforeCount){
            index = 0
        }

        return { ...state, 
            task:{...task,wordCount:beforeCount-1,curIndex:index,}, 
            curIndex:index,
            showWordInfos:newShowWordInfos
        }
    },
}, defaultState);