
import * as vpAction from './action/vocaPlayAction';
import { Themes } from '../common/vocaConfig'
import * as Constant from '../common/constant'
import { LOGOUT } from '../../mine/redux/action/mineAction'


const defaultState = {

    //任务,包含了单词列表 
    task: {
        taskWords: []
    },
    showWordInfos: [],
    //当前下标
    curIndex: 0,
    //是否播放, <=0表示暂停，>0表示播放
    autoPlayTimer: 0,
    //时间间隔
    interval: 2,
    //是否显示英文单词
    showWord: true,
    //是否显示中文释义
    showTran: true,
    //背景图地址
    bgPath: '',
    //显示blur
    showBlur: true,
    //主题数组
    themes: Themes,
    //当前主题id
    themeId: 1,

    //normal播放模式的类型
    normalType: Constant.BY_REAL_TASK, //默认是真实task 构建播放内容
    //播放方式：[顺序播放,单曲循环]
    howPlay: Constant.PLAY_WAY_SINGLE,  //默认单曲循环

    //播放列表
    playListIndex: -1,          //播放列表的当前index
    playTaskList: [],              //任务播放列表
    playGroupList: [],            //生词播放列表

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
        case vpAction.CHANGE_CUR_INDEX: {
            const newTask = {
                ...state.task,
                curIndex: action.payload.curIndex,
                listenTimes: action.payload.listenTimes
            }
            return {
                ...state, task: newTask, curIndex: action.payload.curIndex,
            };
        }
        // 改变任务的testTimes
        case vpAction.CHANGE_TEST_TIMES: {
            const newTask = {
                ...state.task,
                testTimes: action.payload.testTimes
            }
            return {
                ...state, task: newTask,
            };
        }

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

        //Pass单词
        case vpAction.PASS_WORD:
            return {
                ...state,
                curIndex: action.payload.curIndex,
                task: action.payload.task,
                showWordInfos: action.payload.showWordInfos
            };

        // 修改normalType
        case vpAction.CHANGE_NORMAL_TYPE:
            return {
                ...state, normalType: action.payload.normalType
            };
        // 修改howPlay
        case vpAction.CHANGE_HOW_PLAY:
            return {
                ...state, howPlay: action.payload.howPlay
            };

        //修改播放列表
        case vpAction.CHANGE_PLAY_LIST: {
            const { playListIndex, playTaskList, playGroupList } = action.payload
            return {
                ...state, playListIndex, playTaskList, playGroupList
            }
        }

        //修改播放列表当前下标
        case vpAction.CHANGE_PLAY_LIST_INDEX_START:
            return state
        case vpAction.CHANGE_PLAY_LIST_INDEX_SUCCEED: {
            return {
                ...state,
                curIndex: 0,
                playListIndex: action.payload.playListIndex
            }
        }


        // 清空任务
        case vpAction.CLEAR_PLAY:
            return {
                ...defaultState,
                bgPath: state.bgPath,
                interval: state.interval,
                showTran: state.showTran,
                showWord: state.showWord,
                showBlur: state.showBlur,
                howPlay: state.howPlay,  //默认单曲循环
            };
        //退出登录
        case LOGOUT:
            return defaultState;
        default:
            return state;
    }


}