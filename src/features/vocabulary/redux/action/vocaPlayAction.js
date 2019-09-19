

import { createActions } from 'redux-actions';


export const LOAD_TASK = 'LOAD_TASK';                     //加载任务           
export const UPDATE_PLAY_TASK = 'UPDATE_PLAY_TASK'        //修改播放任务
export const CHANGE_SHOW_WORD_INFOS = 'CHANGE_SHOW_WORD_INFOS'  //改变要显示的单词信息数组         

export const CHANGE_PLAY_TIMER = 'CHANGE_PLAY_TIMER';             //暂停播放
export const CHANGE_CUR_INDEX = 'CHANGE_CUR_INDEX';               // 更新当前单词
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';                 //控制时间间隔
export const TOGGLE_WORD = 'TOGGLE_WORD';             //控制英文单词显示
export const TOGGLE_TRAN = 'TOGGLE_TRAN';             //控制中文释义显示
export const LOAD_THEMES = 'LOAD_THEMES';             //查看主题
export const CHANGE_THEME = 'CHANGE_THEME'            //改变主题
export const TOGGLE_TASK_MODAL = 'TOGGLE_TASK_MODAL'  //打开关闭任务列表
export const PASS_WORD = 'PASS_WORD';                 //Pass单词

export const CHANGE_NORMAL_TYPE = 'CHANGE_NORMAL_TYPE' //修改normal播放模式的类型




//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTask, updatePlayTask, changeShowWordInfos, changePlayTimer, changeCurIndex, changeInterval, toggleWord, toggleTran, 
  changeTheme,passWord , changeNormalType} = createActions({

    //加载任务  
    [LOAD_TASK] : (task,showWordInfos)=>{
      return {task,showWordInfos};
    },
    [UPDATE_PLAY_TASK] : (task,showWordInfos)=>{
      return {task,showWordInfos};
    },
    //改变需要显示的单词信息数组
    [CHANGE_SHOW_WORD_INFOS]: (showWordInfos)=>{
      return {showWordInfos}
    },
    //暂停、播放
    [CHANGE_PLAY_TIMER]: (autoPlayTimer)=>{ 
      return { autoPlayTimer};
    },
    //更新当前单词
    [CHANGE_CUR_INDEX]: (curIndex)=> {
      return { curIndex };
    },
    //改变播放间隔
    [CHANGE_INTERVAL]: (interval)=>{
      return {interval};
    },
    //是否显示单词
    [TOGGLE_WORD]: (showWord=null)=>{
      return {showWord}
    },
    //是否显示翻译
    [TOGGLE_TRAN]: (showTran=null)=>{
      return {showTran}
    },
    //改变主题
    [CHANGE_THEME]: (themeId)=>{ 
      return { themeId};
    },
    
    //pass单词
    [PASS_WORD] : (word)=>{
      return {word}
    },
    [CHANGE_NORMAL_TYPE] : (normalType)=>{
      return {normalType}
    }
   
  });

