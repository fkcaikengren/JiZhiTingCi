import {  handleActions } from 'redux-actions';
import * as vpAction from './action/vocaPlayAction';
import {Themes} from '../common/vocaConfig'
import * as Constant from '../common/constant'

/**
 *  总结：
 *  1. state的一级变量不可以直接修改，但是二级变量可以直接修改。
 *     例如：task不可以在state里直接修改，但是task的words可以直接修改 
 */


const defaultState ={

    //任务,包含了单词列表 (不进行持久化)
    task:{
        words:[]
    },
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
    themeId: 2,
    //任务列表面板是否打开
    tasksModalOpened:false,
     //加载状态
    isLoadPending:false,
    //刷新
    refresh:false
}


export const vocaPlay =  handleActions({

    //加载任务
    [vpAction.LOAD_TASK_START] : (state, action) => ({ ...state, isLoadPending:true }),                             //开始加载任务
    [vpAction.LOAD_TASK_SUCCEED] : (state, action) => ({ ...state, 
        task:action.task, 
        curIndex:action.task.curIndex,
        isLoadPending:false }),         //任务加载成功
    //暂停、播放
    [vpAction.CHANGE_PLAY_TIMER] : (state, action) => ({ ...state, autoPlayTimer:action.payload.autoPlayTimer }),
    //更新当前单词
    [vpAction.CHANGE_CUR_INDEX] : (state, action) => {
        const isStudyMode = action.payload.isStudyMode
        const beforeCount = state.task.wordCount
        const index = state.curIndex
        let leftTimes = state.task.leftTimes
        let newTask = state.task
        //播放到最后一个单词
        if(index+1 === beforeCount){
            leftTimes--
        }
        
        if(isStudyMode){//1.学习模式下的轮播 -> 记录curIndex,leftTimes 拷贝task给下一阶段

            newTask = {...state.task, curIndex:action.payload.curIndex, leftTimes}
        }
        //2.普通模式轮播
        //do nothing
        return { ...state, task:newTask, curIndex:action.payload.curIndex, }
        
    },
    //改变播放间隔
    [vpAction.CHANGE_INTERVAL] : (state, action) => ({ ...state, interval:action.payload.interval }),
    //是否显示单词
    [vpAction.TOGGLE_WORD] : (state, action) => ({ ...state, showWord:!state.showWord }),
    //是否显示翻译
    [vpAction.TOGGLE_TRAN] : (state, action) => ({ ...state, showTran:!state.showTran }),
    //改变主题
    [vpAction.CHANGE_THEME] : (state, action) => ({ ...state, themeId:action.payload.themeId }),
    [vpAction.TOGGLE_TASK_MODAL]: (state, action) => ({ ...state, tasksModalOpened:action.payload.tasksModalOpened }),
    [vpAction.PASS_WORD]: (state, action) => {
        const isStudyMode = action.payload.isStudyMode
        let beforeCount = state.task.wordCount
        let index = state.curIndex
        let newTask = state.task

        //后面修改，可以实现统一-----------------------------------------------------
        for(let w of state.task.words){ 
            if(w.word === action.payload.word){ //pass
                if(isStudyMode){                                //1.学习模式下的轮播
                    w.passed = true
                 
                }else if(!isStudyMode ){                        //2.普通模式轮播
                    //保存至Realm
                    if(action.payload.taskDao){
                        action.payload.taskDao.modify(()=>{     
                            w.passed = true
                        })
                    }
                }
            }
        }
        
        //pass最后一个单词，修改下标
        if(index+1 === beforeCount){
            index = 0
        }

        //保存至Realm
        if(action.payload.taskDao){
            action.payload.taskDao.modifyTask({
                taskOrder:state.task.taskOrder,
                wordCount:beforeCount-1,
            })
        }

        return { ...state, 
            task:{...newTask,wordCount:beforeCount-1,curIndex:index,}, 
            curIndex:index
        }
    },
}, defaultState);