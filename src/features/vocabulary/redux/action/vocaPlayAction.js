

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
export const GET_WORD_INFO = 'GET_WORD_INFO';         //查词
export const PASS_WORD = 'PASS_WORD';                 //Pass单词



//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadTask, changePlayTimer, changeCurIndex, changeInterval, toggleWord, toggleTran,loadThemes, changeTheme,
  resetPlayList } = createActions({

    //加载任务  
    [LOAD_TASK] : (mode, task, vocaDao, taskDao)=>{ 
      return {mode, task, vocaDao, taskDao};
    },
    //暂停、播放
    [CHANGE_PLAY_TIMER]: (autoPlayTimer)=>{ 
      return { autoPlayTimer};
    },
    //更新当前单词
    [CHANGE_CUR_INDEX]: (curIndex)=> {
      console.info(`当前单词index`);
      return { curIndex };
    },
    //改变播放间隔
    [CHANGE_INTERVAL]: (interval)=>{
      return {interval};
    },
    //是否显示单词
    [TOGGLE_WORD]: ()=>{
      return {};
    },
    //是否显示翻译
    [TOGGLE_TRAN]: ()=>{
      return {};
    },
    //加载主题
    [LOAD_THEMES]: ()=>{ 
      const themes = [{
          id: 1,
          name: '蓝色',
          bgColor: '#9999ff'
      },{
          id: 1,
          name: '粉红',
          bgColor: 'pink'
      }]
      return { themes};
    },
    //改变主题
    [CHANGE_THEME]: (themeId)=>{ 
      return { themeId};
    },


   
  });

