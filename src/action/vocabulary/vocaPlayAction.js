

import { createActions } from 'redux-actions';

export const LOAD_LIST = 'LOAD_LIST';                //1下/上一首（播放指定列表）
export const CHANGE_WORD_INDEX = 'CHANGE_WORD_INDEX';    //2 顺序播放单词
export const TOGGLE_PLAY = 'TOGGLE_PLAY';              //3暂停/播放
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';      //4控制时间间隔
export const GET_LEARNED_LISTS = 'GET_LEARNED_LISTS';          //5查看已学列表
export const TOGGLE_WORD = 'TOGGLE_WORD';         //6控制英文单词显示
export const TOGGLE_TRAN = 'TOGGLE_TRAN';         //7控制中文释义显示
export const LOAD_THEMES = 'LOAD_THEMES';        //8查看主题
export const CHANGE_THEME = 'CHANGE_THEME'          //9改变主题
export const GET_WORD_INFO = 'GET_WORD_INFO';        //10查词
export const PASS_WORD = 'PASS_WORD';              //11Pass单词





export const {loadList, toggleWord, toggleTran,loadThemes, changeTheme, changeWordIndex} = createActions({
    [LOAD_LIST]: () => {
        const wordList = [{
            id: 1,
            word: 'bad',
            tran: 'adj. 坏的',
          }, {
            id: 2,
            word: 'good',
            tran: 'adj. 好的',
          },{
            id: 3,
            word: 'popular',
            tran: 'adj. 流行的',
          }, {
            id: 4,
            word: 'thank',
            tran: 'v. 谢谢',
          }];
          return {wordList};
    },
    [TOGGLE_WORD]: ()=>{

    },
    [TOGGLE_TRAN]: ()=>{

    },
    [LOAD_THEMES]: ()=>{ //加载主题
      const themes = [{
          id: 1,
          name: '蓝色',
          bgColor: '#9999ff'
      },{
          id: 1,
          name: '粉红',
          bgColor: 'pink'
      }]
      return {themes};
    },
    [CHANGE_THEME]: (themeId)=>{ //改变主题
      return {themeId};
    },
    [CHANGE_WORD_INDEX]: (wordIndex)=> {
      console.info(`当前单词index`);
      return { wordIndex };
    },
   
  });

