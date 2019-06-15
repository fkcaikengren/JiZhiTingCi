
const Realm = require('realm');



export const searchWord = (searchText)=>{
    return new Promise((resolve, reject)=>{
       Realm.open({path:'voca.realm'})
       .then(realm=>{
            //不区分大小写，查询以searchText开头的
            let wordObjs = realm.objects('WordInfo').filtered('word BEGINSWITH "'+searchText+'" AND inflection_type = "prototype"'); 
            let data = []
            let d = null
            let preWord = {}
            //放到集合里，如果和上一个重复，对上一个进行叠加产生一个新的对象
            for(let wo of wordObjs){
                let myTran = `${wo.property}. ${wo.tran}`
                if(wo.word === preWord){
                    //删除上一个
                    let pre = data.pop()
                    d = {
                        word: wo.word,
                        enPhonetic: wo.en_phonetic,
                        trans: wo.tran?`${pre.trans}；${myTran}`:'',
                    }
                }else{
                    d = {
                        word: wo.word,
                        enPhonetic: wo.en_phonetic,
                        trans: wo.tran?myTran:'',
                    }
                }
                preWord = wo.word
                data.push(d);

                if(data.length >= 8){
                    console.log('break at 8')
                    break;
                }
            }
            return resolve(data);
       })
       .catch(err=>{
           console.log('查询单词失败')
           console.log(err)
           return reject(err)
       })


    })
}

export const getWordDetail = (word)=>{
    return new Promise((resolve, reject) =>{


        Realm.open({path:'voca.realm'})
        .then(realm=>{
            //查询单词基本信息
            let wordInfos = realm.objects('WordInfo').filtered('word="'+word+'"'); //数组
            let wordObj = { //构成一级对象
                word:word,
                properties:[]
            };
            for(let wi of wordInfos){


                //查询单词英英释义
                let wordDefs = realm.objects('WordDef').filtered('word_id="'+wi.id+'"'); 
                let propertyObj = {//构建二级对象
                    property:wi.property,
                    enPhonetic:wi.en_phonetic,
                    amPhonetic:wi.am_phonetic,
                    defs:[]
                }
                for(let wd of wordDefs){


                    //查询单词句子
                    let sens = realm.objects('WordSentence').filtered('def_id="'+wd.id+'"')
                    let sentenceObj = {
                        def:wd.def,
                        defTran:wd.def_tran,
                        syn: wd.syn,
                        phrase: wd.phrase,
                        sentences:[]
                    }
                    sentenceObj.sentences = sens;

                    propertyObj.defs.push(sentenceObj);
                }


                wordObj.properties.push(propertyObj);
            }

            console.log(wordObj);
            return resolve(wordObj);
        })
    });
    
}


// getWordDetail('abandon')
// { word: 'abandon',
//   properties:[ 
//         { id: 1, property: 'v', defs: [Array] },
//         { id: 2, property: 'n', defs: [Array] } 
//     ]
//  }
// -----------------------------------------
// defs:[
//     [   { sentences: Results { [0]: [RealmObject] } },
//         { sentences: Results { [0]: [RealmObject], [1]: [RealmObject] } },
//         { sentences:Results { [0]: [RealmObject], [1]: [RealmObject], [2]: [RealmObject] } },
//         { sentences: Results { [0]: [RealmObject], [1]: [RealmObject] } },
//         { sentences: Results { [0]: [RealmObject] } },
//         { sentences: Results {} } 
//     ],
//     [   { sentences: Results { [0]: [RealmObject] } } ]
// ]
