

import { createActions } from 'redux-actions';
const Realm = require('realm')




export const LOAD_REVIEW_LIST = 'LOAD_REVIEW_LIST';     //1下/上一首（播放指定列表）
export const LOAD_LEARN_LIST = 'LOAD_LEARN_LIST';     //1下/上一首（播放指定列表）

export const CHANGE_CUR_INDEX = 'CHANGE_CUR_INDEX';    //2 顺序播放单词
export const CHANGE_PLAY_TIMER = 'CHANGE_PLAY_TIMER';              //3暂停/播放
export const CHANGE_INTERVAL = 'CHANGE_INTERVAL';      //4控制时间间隔
export const GET_LEARNED_LISTS = 'GET_LEARNED_LISTS';          //5查看已学列表
export const TOGGLE_WORD = 'TOGGLE_WORD';         //6控制英文单词显示
export const TOGGLE_TRAN = 'TOGGLE_TRAN';         //7控制中文释义显示
export const LOAD_THEMES = 'LOAD_THEMES';        //8查看主题
export const CHANGE_THEME = 'CHANGE_THEME'          //9改变主题
export const GET_WORD_INFO = 'GET_WORD_INFO';        //10查词
export const PASS_WORD = 'PASS_WORD';              //11Pass单词

export const RESET_PLAY_LIST = 'RESET_PLAY_LIST'


//驼峰式命名，不可以更改(与变量名必须对应)

export const {loadReviewList, loadLearnList, changePlayTimer,changeInterval, toggleWord, toggleTran,loadThemes, changeTheme, changeCurIndex,
  resetPlayList } = createActions({

    [LOAD_REVIEW_LIST]: (wordList) => {      //加载复习单词列表
          console.log('wordList')
          console.log(wordList)
          return {wordList,  isDataLoaded:true};
    },
    [LOAD_LEARN_LIST] : ()=>{ //加载新学单词列表
      let wordList = [{
        id: 0,
        word: 'accommodation',
        tran: '',
      }, {
        id: 1,
        word: 'acute',
        tran: '',
      },{
        id: 2,
        word: 'calorie',
        tran: '',
      }, {
        id: 3,
        word: 'decent',
        tran: '',
      },{
        id: 4,
        word: 'ensue',
        tran: '',
      }, {
        id: 5,
        word: 'feeble',
        tran: '',
      },{
        id: 6,
        word: 'harmony',
        tran: '',
      }, {
        id: 7,
        word: 'hostile',
        tran: '',
      },{
        id: 8,
        word: 'limp',
        tran: '',
      },{
        id: 9,
        word: 'maintain',
        tran: '',
      }, {
        id: 10,
        word: 'notion',
        tran: '',
      },{
        id: 11,
        word: 'poverty',
        tran: '',
      },{
        id: 12,
        word: 'premier',
        tran: '',
      }];

      //realm查询单词解释
      
      openVocaRealm((realm)=>{
        for(let w of wordList){
          let wordInfos = realm.objects('WordInfo').filtered('word="'+w.word+'"'); //数组
          let trans = '';
          for(let info of wordInfos){
            trans = `${trans} ${info.property}. ${info.tran}；`
          }
          w.tran = trans;
        }
      });
      
      console.log(wordList)
      return {wordList,  isDataLoaded:true};
    },
    [CHANGE_PLAY_TIMER]: (autoPlayTimer)=>{
      return {autoPlayTimer};
    },
    [CHANGE_INTERVAL]: (interval)=>{
      return {interval};
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


    //重置播放列表(清空)
    [RESET_PLAY_LIST]: ()=>{

    }
    
   
  });

