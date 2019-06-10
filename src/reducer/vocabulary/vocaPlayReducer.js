import {  handleActions } from 'redux-actions';
import * as vpAction from '../../action/vocabulary/vocaPlayAction';

const defaultState ={

    //1单词列表数据
    wordList:[{
        id: 0,
        word: 'xx',
        tran: 'adj. 坏的',
    },],
    //2当前正在播放的单词id
    curIndex:0,
    //3是否播放
    autoPlayTimer:0,
    //4时间间隔
    interval:1.0,
    //5已学列表id数组
    learnedLists: [{
        id:0,
        info:'12个单词'
    },{
        id:1,
        info:'13个单词'
    }
    ],
    //6是否显示英文单词
    showWord:true,
    //7是否显示中文释义
    showTran:true,
    //8.1主题数组
    themes:[{
        id: 0,
        name: '蓝色',
        bgColor: '#9999ff'
    },{
        id: 1,
        name: '粉红',
        bgColor: 'pink'
    }],
    //8.2当前主题id
    themeId: 0,
    //9.单词信息
    wordInfo:{
        word:'',
        info:{},
    }
}


export const vocaPlay =  handleActions({

    [vpAction.LOAD_LIST] : (state, action) => ({ ...state, wordList:action.payload.wordList }),
    [vpAction.CHANGE_PLAY_TIMER] : (state, action) => ({ ...state, autoPlayTimer:action.payload.autoPlayTimer }),
    [vpAction.TOGGLE_WORD] : (state, action) => ({ ...state, showWord:!state.showWord }),
    [vpAction.TOGGLE_TRAN] : (state, action) => ({ ...state, showTran:!state.showTran }),
    [vpAction.LOAD_THEMES] : (state, action) => ({ ...state, themes:action.payload.themes }),
    [vpAction.CHANGE_THEME] : (state, action) => ({ ...state, themeId:action.payload.themeId }),
    [vpAction.CHANGE_CUR_INDEX] : (state, action) => ({ ...state, curIndex:action.payload.curIndex }),
    [vpAction.CHANGE_INTERVAL] : (state, action) => ({ ...state, interval:action.payload.interval }),
    
}, defaultState);