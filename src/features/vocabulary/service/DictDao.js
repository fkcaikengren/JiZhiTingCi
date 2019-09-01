
const Realm = require('realm');

export default class DictDao{
    
    constructor(){
        this.realm = null
    }


    //单例模式
    static getInstance() {
        if(!this.instance) {
            this.instance = new DictDao();
        }
        return this.instance;
    }

    /** 打开数据库 */
    async open(){
        try{
            this.realm  = await Realm.open({path: 'dict.realm'})
        }catch(err){
            console.log('Error: 打开realm数据库失败, 创建DictDao对象失败')
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
     * @description 获取单词详情
     * @memberof VocaDao
     */
    getWordDetail = (word)=>{
        let wordObj = null
        try{
            //查询单词基本信息
            let wordInfos = this.realm.objects('WordInfo').filtered('word="'+word+'"'); //数组
            wordObj = { //构成一级对象
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
        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordDetail() Error')
        }
        return wordObj
    }

}
