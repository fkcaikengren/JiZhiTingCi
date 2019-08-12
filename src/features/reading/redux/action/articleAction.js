import { createActions } from 'redux-actions';

export const LOAD_ARTICLE = 'LOAD_ARTICLE'                          //加载文章
export const LOAD_ARTICLE_START = 'LOAD_ARTICLE_START'
export const LOAD_ARTICLE_SUCCEED = 'LOAD_ARTICLE_SUCCEED'
export const LOAD_ARTICLE_FAIL = 'LOAD_ARTICLE_FAIL'


export const LOAD_ANALYSIS = 'LOAD_ANALYSIS'                            //加载解析
export const LOAD_ANALYSIS_START = 'LOAD_ANALYSIS_START'                      //加载解析
export const LOAD_ANALYSIS_SUCCEED = 'LOAD_ANALYSIS_SUCCEED'                    //加载解析
export const LOAD_ANALYSIS_FAIL = 'LOAD_ANALYSIS_FAIL'

export const CHANGE_WEB_LOADING = 'CHANGE_WEB_LOADING'

export const CHANGE_BGTHEME = 'CHANGE_BGTHEME'                          //改变背景主题
export const CHANGE_FONT_SIZE = 'CHANGE_FONT_SIZE'                      //改变字号
export const TOGGLE_KEY_WORDS = 'TOGGLE_KEY_WORDS'                      //控制显示关键词
export const CHANGE_USER_ANSWER_MAP = 'CHANGE_USER_ANSWER_MAP'                //改变用户答案


//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadArticle , loadAnalysis, changeWebLoading,  changeBgtheme, changeFontSize, toggleKeyWords, changeUserAnswerMap} = createActions({
     //加载文章
    [LOAD_ARTICLE]:(vocaLibName, articleCode)=>{
        return { vocaLibName, articleCode}
    },
    [LOAD_ANALYSIS]:(vocaLibName, articleCode)=>{
        return { vocaLibName, articleCode}
    },
    //改变网页加载状态
    [CHANGE_WEB_LOADING]: (isWebLoading)=>{
        return {isWebLoading}
    },
    //改变主题
    [CHANGE_BGTHEME]: (index)=>{
        return {themeIndex:index}
    },
    //改变字号
   [CHANGE_FONT_SIZE]: (fontRem)=>{
        return {fontRem}
   },
   [TOGGLE_KEY_WORDS]: ()=>{
       return {}
   },
   [CHANGE_USER_ANSWER_MAP]: (userAnswerMap)=>{
        return {userAnswerMap}
   }
    
});
