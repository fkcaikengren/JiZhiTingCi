import {  handleActions } from 'redux-actions';
import * as vpAction from './action/vocaPlayAction';
import {Themes} from '../common/vocaConfig'

const defaultState ={

    //任务,包含了单词列表 (不进行持久化)
    task:{
        words:[]
    },
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
}


export const vocaPlay =  handleActions({

    //加载任务
    [vpAction.LOAD_TASK_START] : (state, action) => ({ ...state, isLoadPending:true }),                             //开始加载任务
    [vpAction.LOAD_TASK_SUCCEED] : (state, action) => ({ ...state, task:action.task, isLoadPending:false }),         //任务加载成功
    //暂停、播放
    [vpAction.CHANGE_PLAY_TIMER] : (state, action) => ({ ...state, autoPlayTimer:action.payload.autoPlayTimer }),
    //更新当前单词
    [vpAction.CHANGE_CUR_INDEX] : (state, action) => ({ ...state, task:{...state.task, curIndex:action.payload.curIndex} }),
    //改变播放间隔
    [vpAction.CHANGE_INTERVAL] : (state, action) => ({ ...state, interval:action.payload.interval }),
    //是否显示单词
    [vpAction.TOGGLE_WORD] : (state, action) => ({ ...state, showWord:!state.showWord }),
    //是否显示翻译
    [vpAction.TOGGLE_TRAN] : (state, action) => ({ ...state, showTran:!state.showTran }),
    //改变主题
    [vpAction.CHANGE_THEME] : (state, action) => ({ ...state, themeId:action.payload.themeId }),
    [vpAction.TOGGLE_TASK_MODAL]: (state, action) => ({ ...state, tasksModalOpened:action.payload.tasksModalOpened }),
    
}, defaultState);