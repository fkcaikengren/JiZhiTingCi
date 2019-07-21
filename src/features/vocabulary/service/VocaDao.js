
const Realm = require('realm');

export default class VocaDao{
    
    constructor(props){
        this.realm = null
    }
    /** 打开数据库 */
    async open(){
        try{
            this.realm  = await Realm.open({path: 'voca.realm'})
        }catch(err){
            console.log('Error: 打开realm数据库失败, 创建VocaDao对象失败')
            console.log(err)
        }
        return this.realm;
    }
    /** 数据库是否打开的 */
    isOpen(){
        return (this.realm !== null)
    }
    /**关闭数据库 */
    close = ()=>{
        if(this.realm && !this.realm.isClosed){
            this.realm.close()
            this.realm = null
        }
    }

    /**
     * @description 查词（模糊查询匹配的前8个单词）
     * @memberof VocaDao
     */
    searchWord = (searchText)=>{
        //不区分大小写，查询以searchText开头的
        let wordObjs = this.realm.objects('WordInfo').filtered('word BEGINSWITH "'+searchText+'" AND inflection_type = "prototype"'); 
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
        return data;
    }



    /**
     * @description 获取单词详情
     * @memberof VocaDao
     */
    getWordDetail = (word)=>{
        //查询单词基本信息
        let wordInfos = this.realm.objects('WordInfo').filtered('word="'+word+'"'); //数组
        let wordObj = { //构成一级对象
            word:word,
            properties:[]
        };
        for(let wi of wordInfos){

            //查询单词英英释义
            let wordDefs = this.realm.objects('WordDef').filtered('word_id="'+wi.id+'"'); 
            let propertyObj = {//构建二级对象
                property:wi.property,
                enPhonetic:wi.en_phonetic,
                amPhonetic:wi.am_phonetic,
                enPronUrl:wi.en_pron_url,
                amPronUrl:wi.am_pron_url,
                defs:[]
            }
            for(let wd of wordDefs){


                //查询单词句子
                let sens = this.realm.objects('WordSentence').filtered('def_id="'+wd.id+'"')
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
        return wordObj
    }

    /**
     * @description 查询任务的单词信息，补充进去
     * @memberof VocaDao
     */
    writeInfoToTask = (task)=>{
        for(let w of task.taskWords){      //遍历每个单词
            //testWrongNum 属性： 学习测试中的错误次数
            w.testWrongNum = 0; 
            console.log(w.word);
            wordInfos = this.realm.objects('WordInfo').filtered('word="'+w.word+'"'); 
            //音标
            w.enPhonetic  = wordInfos[0]?wordInfos[0].en_phonetic:''
            w.enPronUrl = wordInfos[0]?wordInfos[0].en_pron_url:''
            w.amPhonetic = wordInfos[0]?wordInfos[0].am_phonetic:''
            w.amPronUrl  = wordInfos[0]?wordInfos[0].am_pron_url:''


            //词性数组
            let trans = []
            let tran = ''
            for(let wi of wordInfos){   

                trans.push({
                    wordId : wi.id,             //单词id
                    property : wi.property,     //词性
                    tran : wi.tran              //释义
                });
                tran = tran+wi.property+'. '+ wi.tran+'；'
            }

            //inflections,衍生词和变形词
            let transformations = []
            if(wordInfos[0]){
                let ids = wordInfos[0].inflections.split(',')
                for(let id of ids){
                    let transformWord = this.realm.objects('WordInfo').filtered('id="'+id+'" AND inflection_type = "transform"')[0]
                    if(transformWord){
                        transformations.push(transformWord.word)
                    }
                }
            }
            w.transformations = transformations
                
            //第一个释义和例句
            if(wordInfos[0] ){
                let id = wordInfos[0].id
                let def0 = this.realm.objects('WordDef').filtered('word_id="'+id+'"')[0];
                w.def = ''
                if(def0){
                    w.def = def0.def
                    if(def0.id){
                        let defId = def0.id
                        w.sentence = this.realm.objects('WordSentence').filtered('def_id="'+defId+'"')[0].sentence
                    }
                }
            }
            
            w.trans = trans;
            w.tran = tran
        }
    }

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
