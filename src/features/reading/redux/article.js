import {  handleActions } from 'redux-actions';
import * as aAction from './action/articleAction'
import {BgThemes} from '../common/readConfig'




const defaultState ={

    
    //主题数组
    bgThemes:BgThemes,
    //当前主题下标
    themeIndex: 2,
    //字体大小
    fontRem:1,
    //是否显示关键词
    showKeyWords:true,
     //加载状态
    isLoadPending:false,

}


export const article =  handleActions({

    //加载任务
    [aAction.CHANGE_BGTHEME] : (state, action) => ({ ...state, themeIndex:action.payload.themeIndex }),  
    [aAction.CHANGE_FONT_SIZE] : (state, action) => ({ ...state, fontRem:action.payload.fontRem })  ,
    [aAction.TOGGLE_KEY_WORDS]: (state, action) => ({ ...state, showKeyWords:!state.showKeyWords }),                    //开始加载任务
   
}, defaultState);