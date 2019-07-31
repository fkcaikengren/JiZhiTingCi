

import { createActions } from 'redux-actions';

// 加载任务（加载单词列表）
export const LOAD_TASK = 'LOAD_TASK';                       
export const LOAD_TASK_START = 'LOAD_TASK_START';                       
export const LOAD_TASK_SUCCEED = 'LOAD_TASK_SUCCEED';                       
export const LOAD_TASK_FAIL = 'LOAD_TASK_FAIL';                       

export const CHANGE_PLAY_TIMER = 'CHANGE_PLAY_TIMER';             //暂停播放
export const CHANGE_CUR_INDEX = 'CHANGE_CUR_INDEX';               // 更新当前单词
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';                 //控制时间间隔
export const TOGGLE_WORD = 'TOGGLE_WORD';             //控制英文单词显示
export const TOGGLE_TRAN = 'TOGGLE_TRAN';             //控制中文释义显示
export const LOAD_THEMES = 'LOAD_THEMES';             //查看主题
export const CHANGE_THEME = 'CHANGE_THEME'            //改变主题
export const TOGGLE_TASK_MODAL = 'TOGGLE_TASK_MODAL'  //打开关闭任务列表
export const PASS_WORD = 'PASS_WORD';                 //Pass单词

export const GET_WORD_INFO = 'GET_WORD_INFO';         //查词




//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTask, changePlayTimer, changeCurIndex, changeInterval, toggleWord, toggleTran, changeTheme,
  toggleTaskModal,passWord } = createActions({

    //加载任务  
    [LOAD_TASK] : (task, vocaDao, taskDao)=>{
      return { task, vocaDao, taskDao};
    },
    //暂停、播放
    [CHANGE_PLAY_TIMER]: (autoPlayTimer)=>{ 
      return { autoPlayTimer};
    },
    //更新当前单词
    [CHANGE_CUR_INDEX]: (curIndex, isStudyMode)=> {
      return { curIndex,isStudyMode };
    },
    //改变播放间隔
    [CHANGE_INTERVAL]: (interval)=>{
      return {interval};
    },
    //是否显示单词
    [TOGGLE_WORD]: ()=>{
      console.log('toggleWord')
      return {};
    },
    //是否显示翻译
    [TOGGLE_TRAN]: ()=>{
      return {};
    },
    //改变主题
    [CHANGE_THEME]: (themeId)=>{ 
      return { themeId};
    },
    //显示隐藏任务列表面板
    [TOGGLE_TASK_MODAL]: (tasksModalOpened)=>{
      return {tasksModalOpened}
    },
    [PASS_WORD] : (word,status,isStudyMode,taskDao)=>{
      return {word,status,isStudyMode, taskDao}
    },
   
  });

