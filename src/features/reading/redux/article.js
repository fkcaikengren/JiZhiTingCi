import { handleActions } from 'redux-actions';
import * as aAction from './action/articleAction'
import { LOGOUT } from '../../mine/redux/action/mineAction'
import { BgThemes } from '../common/readConfig'




const defaultState = {


    //主题数组
    bgThemes: BgThemes,
    //当前主题下标
    themeIndex: 2,
    //字体大小
    fontRem: 1,

    articleId: null,
    showKeyWords: true,       //是否显示关键词
    articleText: '',          //文章文本 （字符串）
    keyWords: [],             //关键词 （数组）
    options: [],              //问题选项 （数组）

    analysisText: '',        // 解析文本（字符串）
    rightAnswers: null,      //正确答案（对象）

    userAnswerMap: new Map(), //用户的答案 （Map）
    isLoadPending: false,      //article加载状态
    isAnalysisLoadPending: false,      //analysis加载状态

    isLoadFail: false,        //数据加载失败
    isWebLoading: false       //网页是否正加载
}


export const article = handleActions({
    //加载文章
    [aAction.LOAD_ARTICLE_START]: (state, action) => ({
        ...state,
        isLoadPending: true,
        isWebLoading: true
    }),
    [aAction.LOAD_ARTICLE_SUCCEED]: (state, action) => ({
        ...state,
        articleId: action.articleId,
        articleText: action.articleText,
        keyWords: action.keyWords,
        options: action.options,
        isLoadPending: false
    }),
    [aAction.LOAD_ARTICLE_FAIL]: (state, action) => ({
        ...state,
        isLoadPending: false,
        isWebLoading: false,
        isLoadFail: true
    }),
    //加载解析和正确答案
    [aAction.LOAD_ANALYSIS_START]: (state, action) => ({
        ...state,
        isAnalysisLoadPending: true,
        isWebLoading: true
    }),
    [aAction.LOAD_ANALYSIS_SUCCEED]: (state, action) => ({
        ...state,
        analysisText: action.analysisText,
        rightAnswers: action.rightAnswers,
        isAnalysisLoadPending: false
    }),
    [aAction.LOAD_ANALYSIS_FAIL]: (state, action) => ({
        ...state,
        isAnalysisLoadPending: false,
        isWebLoading: false,
    }),

    //改变加载状态
    [aAction.CHANGE_WEB_LOADING]: (state, action) => ({
        ...state,
        isWebLoading: action.payload.isWebLoading,
    }),
    [aAction.CHANGE_LOADING_FAIL]: (state, action) => ({
        ...state,
        isLoadFail: action.payload.isLoadFail,
    }),

    //改变主题背景
    [aAction.CHANGE_BGTHEME]: (state, action) => ({ ...state, themeIndex: action.payload.themeIndex }),
    //改变字号
    [aAction.CHANGE_FONT_SIZE]: (state, action) => ({ ...state, fontRem: action.payload.fontRem }),
    //是否显示关键字
    [aAction.TOGGLE_KEY_WORDS]: (state, action) => ({ ...state, showKeyWords: !state.showKeyWords }),
    //改变用户答案
    [aAction.CHANGE_USER_ANSWER_MAP]: (state, action) => ({ ...state, userAnswerMap: action.payload.userAnswerMap }),
    //退出登录
    [LOGOUT]: (state, action) => defaultState
}, defaultState);