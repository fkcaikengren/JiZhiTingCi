import {createActions} from 'redux-actions'
const Realm = require('realm');

import * as Dao from '../../dao/vocabulary/VocaTaskDao'
import * as VocaDao from '../../dao/vocabulary/VocaDao'
import {IN_PLAY , IN_CARD , IN_TEST1 , IN_RETEST1 , IN_TEST2, IN_RETEST2,} from '../../constant'

    
//任务信息和任务单词
export const LOAD_TASK = 'LOAD_TASK'
//跳到下一个
export const NEXT_WORD = 'NEXT_WORD'  
    //完成轮播
export const FINISH_PLAY = 'FINISH_PLAY'
    //完成卡片学习
export const FINISH_CARD_LEARN = 'FINISH_CARD_LEARN'
    //完成测试1
export const FINISH_TEST1 = 'FINISH_TEST1'
    //完成测试2
export const FINISH_TEST2 = 'FINISH_TEST2'
    //改变（生成）测试选项
export const CHANGE_OPTIONS = 'CHANGE_OPTIONS'
    //选择答案
export const SELECT_ANSWER = 'SELECT_ANSWER'
    //重置
export const RESET = 'RESET'



export const {loadTask, nextWord,  finishPlay, finishCardLearn, changeOptions, selectAnswer,reset } = createActions({
    [LOAD_TASK]: async (taskOrder)=>{ //加载数据
        let task = {}
        try{
            task = await Dao.loadTask(taskOrder);
        }catch(err){
            console.log('learnCardAction:加载任务失败');
            console.log(err)
        }
        
        task.isSync =  false        //isSync属性：是否同步
        task.learnStatus = IN_TEST1  //目前所处的阶段[轮播，卡片，测试1，重测1，测试2，重测2]

        
        //查询任务的的单词信息
        Realm.open({path: 'voca.realm'})
        .then(realm => {
            for(let w of task.words){      //遍历每个单词
                //testWrongNum 属性： 学习测试中的错误次数
                w.testWrongNum = 0; 
                console.log(w.word);
                wordInfos = realm.objects('WordInfo').filtered('word="'+w.word+'"'); 
                //音标
                w.enPhonetic  = wordInfos[0]?wordInfos[0].en_phonetic:''
                w.enPronUrl = wordInfos[0]?wordInfos[0].en_pron_url:''
                w.amPhonetic = wordInfos[0]?wordInfos[0].am_phonetic:''
                w.amPronUrl  = wordInfos[0]?wordInfos[0].am_pron_url:''


                //词性数组
                let trans = []
                for(let wi of wordInfos){   

                    trans.push({
                        wordId : wi.id,             //单词id
                        property : wi.property,     //词性
                        tran : wi.tran              //释义
                    });

                }

                //inflections,衍生词和变形词
                let transformations = []
                if(wordInfos[0]){
                    let ids = wordInfos[0].inflections.split(',')
                    for(let id of ids){
                        let transformWord = realm.objects('WordInfo').filtered('id="'+id+'" AND inflection_type = "transform"')[0]
                        if(transformWord){
                            transformations.push(transformWord.word)
                        }
                    }
                }
                w.transformations = transformations
                    
                

                //第一个释义和例句
                if(wordInfos[0] ){
                    let id = wordInfos[0].id
                    let def0 = realm.objects('WordDef').filtered('word_id="'+id+'"')[0];
                    w.def = ''
                    if(def0){
                        w.def = def0.def
                        if(def0.id){
                            let defId = def0.id
                            w.sentence = realm.objects('WordSentence').filtered('def_id="'+defId+'"')[0].sentence
                        }
                    }
                }
                
                w.trans = trans;
            }
        })
        .catch(error => {
            //有页面提示 读取失败
            console.log('有提示 读取失败')
            console.log(error);
        });
        return {task}
    },
    [NEXT_WORD]: ()=>{
    },
    [FINISH_PLAY]: ()=>{    //完成轮播

    },
    [FINISH_CARD_LEARN] :()=>{  //完成卡片学习(进入测试)

    },
    [CHANGE_OPTIONS] : (options, answerIndex)=>{  //改变测试选项 options:选项数组
        //生成测试选项时，同时重置选择状态
        const selectedIndex = -1
        const selectedStatus = 0
        return {options, answerIndex, selectedIndex, selectedStatus}
    },
    [SELECT_ANSWER]: (selectedIndex, selectedStatus)=>{  //选择答案
        return {selectedIndex, selectedStatus}
    },
    [RESET] : () =>{

    }
});