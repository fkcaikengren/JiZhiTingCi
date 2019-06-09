

import { createActions } from 'redux-actions';

export const LOAD_LIST = 'LOAD_LIST';                //1下/上一首（播放指定列表）
export const CHANGE_CUR_INDEX = 'CHANGE_CUR_INDEX';    //2 顺序播放单词
export const TOGGLE_PLAY = 'TOGGLE_PLAY';              //3暂停/播放
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';      //4控制时间间隔
export const GET_LEARNED_LISTS = 'GET_LEARNED_LISTS';          //5查看已学列表
export const TOGGLE_WORD = 'TOGGLE_WORD';         //6控制英文单词显示
export const TOGGLE_TRAN = 'TOGGLE_TRAN';         //7控制中文释义显示
export const LOAD_THEMES = 'LOAD_THEMES';        //8查看主题
export const CHANGE_THEME = 'CHANGE_THEME'          //9改变主题
export const GET_WORD_INFO = 'GET_WORD_INFO';        //10查词
export const PASS_WORD = 'PASS_WORD';              //11Pass单词





export const {loadList,togglePlay, toggleWord, toggleTran,loadThemes, changeTheme, changeCurIndex} = createActions({
    [LOAD_LIST]: () => {
        const wordList = [{
            id: 0,
            word: 'accommodation',
            tran: 'adj. 坏的',
          }, {
            id: 1,
            word: 'acute',
            tran: 'adj. 好的',
          },{
            id: 2,
            word: 'calorie',
            tran: 'adj. 流行的',
          }, {
            id: 3,
            word: 'decent',
            tran: 'v. 谢谢',
          },{
            id: 4,
            word: 'ensue',
            tran: 'n. 吉他',
          }, {
            id: 5,
            word: 'feeble',
            tran: 'n. 苹果',
          },{
            id: 6,
            word: 'harmony',
            tran: 'adj. 死亡的',
          }, {
            id: 7,
            word: 'hostile',
            tran: 'v. xx',
          },{
            id: 8,
            word: 'limp',
            tran: 'n. 其他',
          },{
            id: 9,
            word: 'maintain',
            tran: 'adj. 哈哈',
          }, {
            id: 10,
            word: 'notion',
            tran: 'v. 嘻嘻',
          },{
            id: 11,
            word: 'poverty',
            tran: 'v. 嘻嘻',
          },{
            id: 12,
            word: 'premier',
            tran: 'v. 嘻嘻',
          }];
          return {wordList};
    },
    [TOGGLE_PLAY]: ()=>{

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
    [CHANGE_CUR_INDEX]: (curIndex)=> {
      console.info(`当前单词index`);
      return { curIndex };
    },
   
  });

