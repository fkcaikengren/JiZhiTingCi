import { handleActions } from 'redux-actions';

import * as vpAction from './action/vocaPlayAction';
import { Themes } from '../common/vocaConfig'
import VocaUtil from '../common/vocaUtil';
import VocaTaskDao from '../service/VocaTaskDao';
import * as Constant from '../common/constant'


/**
 *  总结：
 *  1. state的一级变量不可以直接修改，但是二级变量可以直接修改。
 *     例如：task不可以在state里直接修改，但是task的words可以直接修改 
 */


const defaultState = {

    //任务,包含了单词列表 
    task: {
        words: []
    },
    showWordInfos: [],
    //当前下标
    curIndex: 0,
    //是否播放, <=0表示暂停，>0表示播放
    autoPlayTimer: 0,
    //时间间隔
    interval: 1.4,
    //是否显示英文单词
    showWord: true,
    //是否显示中文释义
    showTran: true,
    //背景图地址
    bgPath: '',
    //显示blur
    showBlur: false,
    //主题数组
    themes: Themes,
    //当前主题id
    themeId: 1,
    //加载状态
    isLoadPending: false,

    //normal播放模式的类型
    normalType: Constant.BY_REAL_TASK,  //默认是真实task 构建播放内容

}


export const vocaPlay = handleActions({

    //加载任务         
    [vpAction.LOAD_TASK]: (state, action) => ({
        ...state,
        task: action.payload.task,
        curIndex: action.payload.task.curIndex,
        showWordInfos: action.payload.showWordInfos,
    }),
    [vpAction.UPDATE_PLAY_TASK]: (state, action) => {
        return {
            ...state,
            task: action.payload.task,
            curIndex: action.payload.task.curIndex,
            showWordInfos: action.payload.showWordInfos,
        }
    },
    //暂停、播放
    [vpAction.CHANGE_PLAY_TIMER]: (state, action) => ({ ...state, autoPlayTimer: action.payload.autoPlayTimer }),
    //更新当前单词
    [vpAction.CHANGE_CUR_INDEX]: (state, action) => {

        const newTask = { ...state.task, curIndex: action.payload.curIndex, listenTimes: action.payload.listenTimes }
        return { ...state, task: newTask, curIndex: action.payload.curIndex, }

    },
    //改变播放间隔
    [vpAction.CHANGE_INTERVAL]: (state, action) => ({ ...state, interval: action.payload.interval }),
    //是否显示单词
    [vpAction.TOGGLE_WORD]: (state, action) => {
        if (action.payload.showWord === null) {
            return { ...state, showWord: !state.showWord }
        } else {
            return { ...state, showWord: action.payload.showWord }
        }

    },
    //是否显示翻译
    [vpAction.TOGGLE_TRAN]: (state, action) => {
        if (action.payload.showTran === null) {
            return { ...state, showTran: !state.showTran }
        } else {
            return { ...state, showTran: action.payload.showTran }
        }
    },
    //改变背景
    [vpAction.CHANGE_BG]: (state, action) => ({ ...state, bgPath: action.payload.bgPath, showBlur: false }),
    //是否模糊
    [vpAction.SHOW_BLUR]: (state, action) => ({ ...state, showBlur: action.payload.showBlur }),
    //改变主题
    [vpAction.CHANGE_THEME]: (state, action) => ({ ...state, themeId: action.payload.themeId }),
    [vpAction.TOGGLE_TASK_MODAL]: (state, action) => ({ ...state, tasksModalOpened: action.payload.tasksModalOpened }),
    //Pass单词
    [vpAction.PASS_WORD]: (state, action) => ({ ...state, ...action.payload }),

    [vpAction.CHANGE_NORMAL_TYPE]: (state, action) => ({ ...state, normalType: action.payload.normalType }),
    // 清空任务
    [vpAction.CLEAR_PLAY]: (state, vpAction) => {
        return {
            ...defaultState,
            bgPath: state.bgPath,
            interval: state.interval,
            showTran: state.showTran,
            showWord: state.showWord,
            showBlur: state.showBlur,
        }
    }

}
    , defaultState);