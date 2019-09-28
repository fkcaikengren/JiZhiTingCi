
const Realm = require('realm');

export default class VocaDao{
    
    constructor(){
        this.realm = null
    }


    //单例模式
    static getInstance() {
        if(!this.instance) {
            this.instance = new VocaDao();
        }
        return this.instance;
    }

    /** 打开数据库 */
    async open(){
        try{
            console.log('打开voca.realm')
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
        let wordInfos = this.realm.objects('WordInfo').filtered('word BEGINSWITH "'+searchText+'" AND inflection_type != "transform"');
        let data = []
        //放到集合里，如果和上一个重复，对上一个进行叠加产生一个新的对象
        for(let wi of wordInfos){
            data.push(wi)
            if(data.length >= 8){
                console.log('break at 8')
                break;
            }
        }
        return data;
    }

    /**
     * @description 
     * @memberof VocaDao
     */
    lookWordInfo = (word,i=1)=>{
        console.log(word)
        let wordObj = null
        try{
            //查询单词基本信息
            let wordInfos = this.realm.objects('WordInfo').filtered('word="'+word+'"'); //数组
            if(wordInfos[0]){
                if(wordInfos[0].inflection_type === "transform"){       //处理变形词
                    const res = this.realm.objects('WordInfo').filtered('id='+wordInfos[0].inflections);
                    if(res[0]){
                        wordObj=res[0]
                    }
                }else{
                    wordObj=wordInfos[0]
                }
            }else{
                if(i===1){
                    //首字母小写查询
                    wordObj = this.lookWordInfo(word.toLowerCase(),2)
                }
            }

        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordInfo() Error')
        }
        return wordObj
    }

    /**
     *  查询单词的变形词
     * @param word
     * @returns {Array}
     */
    getTransforms = (word)=> {
        let arr = []
        const res = this.realm.objects('WordInfo').filtered('word="' + word + '"')
        if (res.length > 0) {
            const inflections = res[0].inflections.split(',')
            //根据inflections 查询衍生词
            for (let i of inflections) {
                if (i && i !== '') {
                    console.log(parseInt(i))
                    const res2 = this.realm.objects('WordInfo').filtered('id=' + parseInt(i) + ' AND inflection_type="transform"')
                    if (res2.length > 0) {
                        arr.push(res2[0].word)
                    }
                }
            }
        }
        return arr
    }

    /**
     * @description 获取单词详情
     * @memberof VocaDao
     */
    getWordInfo = (word)=>{
        let wordObj = null
        try{
            //查询单词基本信息
            let wordInfos = this.realm.objects('WordInfo').filtered('word="'+word+'" AND inflection_type != "transform"'   ); //数组
            if(wordInfos[0]){
                wordObj=wordInfos[0]
            }

        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordInfo() Error')
        }
        return wordObj
    }


    /**
     * 批量查询
     * @param words
     * @returns [] 返回一个数组
     */
    getWordInfos = (words)=>{
        const arr = []
        try{
            const len = words.length
            if(len && len>0){
                //拼接
                let str = ''
                for(let i in words){
                    if(i==(len-1)){
                        str += 'word="'+words[i]+'"';
                    }else{
                        str += 'word="'+words[i]+'" OR ';
                    }
                }
                let wordInfos = this.realm.objects('WordInfo').filtered('('+str+') AND inflection_type != "transform"'   ); //数组
                //排序
                for(let word of words){
                    for(let wi of wordInfos){
                        if(wi.word === word){
                            arr.push(wi)
                        }
                    }
                }
               
            }

        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordInfos() Error')
        }
        return arr
    }

    /**
     *  查询单词词根信息
     * @param word
     * @returns {object}
     */
    getWordRoot = (id)=>{
        let wordObj = null
        try{
            //查询单词基本信息
            let wordRoot = this.realm.objects('WordRoot').filtered('id='+id ); //数组
            if(wordRoot[0]){
                wordObj=wordRoot[0]
            }

        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordRoot() Error')
        }
        return wordObj
    }

    /**
     *  批量查询单词词根信息
     * @param idStr id字符串
     * @returns {Array}
     */
    getWordRoots = (idStr, max=0, isLimit=false)=>{
        const arr = []
        try{
            if(idStr && idStr !== ''){
                const ids = idStr.split(',')
                for(let id of ids){
                    let wordRoot = this.realm.objects('WordRoot').filtered('id='+parseInt(id) ); //数组
                    if(wordRoot[0]){
                        arr.push(wordRoot[0])
                    }

                    if(isLimit){
                        if(arr.length>=max){
                            break
                        }
                    }
                }
            }

        }catch (e) {
            console.log(e)
            console.log('VocaDao : getWordRoot() Error')
        }
        return arr
    }
}


