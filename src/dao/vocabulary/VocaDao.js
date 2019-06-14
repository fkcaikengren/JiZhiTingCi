
const Realm = require('realm');


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
