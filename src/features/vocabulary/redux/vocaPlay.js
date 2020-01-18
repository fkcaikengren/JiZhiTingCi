
import * as vpAction from './action/vocaPlayAction';
import { Themes } from '../common/vocaConfig'
import * as Constant from '../common/constant'
import { LOGOUT } from '../../mine/redux/action/mineAction'

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
    normalType: Constant.BY_REAL_TASK, //默认是真实task 构建播放内容

}

export const vocaPlay = (state = defaultState, action) => {
    switch (action.type) {
        //加载任务      
        case vpAction.LOAD_TASK:
            return {
                ...state,
                task: action.payload.task,
                curIndex: action.payload.task.curIndex,
                showWordInfos: action.payload.showWordInfos,
            };
        case vpAction.UPDATE_PLAY_TASK:
            return {
                ...state,
                task: action.payload.task,
                curIndex: action.payload.task.curIndex,
                showWordInfos: action.payload.showWordInfos,
            };
        //暂停、播放
        case vpAction.CHANGE_PLAY_TIMER:
            return {
                ...state, autoPlayTimer: action.payload.autoPlayTimer
            };
        //更新当前单词
        case vpAction.CHANGE_CUR_INDEX:
            const newTask = {
                ...state.task,
                curIndex: action.payload.curIndex,
                listenTimes: action.payload.listenTimes
            }
            return {
                ...state, task: newTask, curIndex: action.payload.curIndex,
            };
        //改变播放间隔
        case vpAction.CHANGE_INTERVAL:
            return {
                ...state, interval: action.payload.interval
            };
        //是否显示单词
        case vpAction.TOGGLE_WORD:
            if (action.payload.showWord === null) {
                return {
                    ...state,
                    showWord: !state.showWord
                }
            } else {
                return {
                    ...state,
                    showWord: action.payload.showWord
                }
            }
        //是否显示翻译
        case vpAction.TOGGLE_TRAN:
            if (action.payload.showTran === null) {
                return {
                    ...state,
                    showTran: !state.showTran
                }
            } else {
                return {
                    ...state,
                    showTran: action.payload.showTran
                }
            }
        //改变背景
        case vpAction.CHANGE_BG:
            return {
                ...state, bgPath: action.payload.bgPath, showBlur: false
            };
        //是否模糊
        case vpAction.SHOW_BLUR:
            return {
                ...state, showBlur: action.payload.showBlur
            };

        //改变主题
        case vpAction.CHANGE_THEME:
            return {
                ...state, themeId: action.payload.themeId
            };
        // 是否显示任务面板
        case vpAction.TOGGLE_TASK_MODAL:
            return {
                ...state, tasksModalOpened: action.payload.tasksModalOpened
            };
        //Pass单词
        case vpAction.PASS_WORD:
            return {
                ...state, ...action.payload
            };

        // 改变normal_type
        case vpAction.CHANGE_NORMAL_TYPE:
            return {
                ...state, normalType: action.payload.normalType
            };
        // 清空任务
        case vpAction.CLEAR_PLAY:
            return {
                ...defaultState,
                bgPath: state.bgPath,
                interval: state.interval,
                showTran: state.showTran,
                showWord: state.showWord,
                showBlur: state.showBlur,
            };
        //退出登录
        case LOGOUT:
            return defaultState;
        default:
            return state;
    }


}