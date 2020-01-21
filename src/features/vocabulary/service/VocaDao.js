
import { store } from '../../../redux/store'
import { VOCA_PRON_TYPE_EN } from '../common/constant';
const Realm = require('realm');

export default class VocaDao {

    constructor() {
        this.realm = null
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new VocaDao();
        }
        return this.instance;
    }

    /** 打开数据库 */
    async open() {
        try {
            if (!this.realm)
                this.realm = await Realm.open({ path: 'voca.realm' })
        } catch (err) {
            console.log('Error: 打开realm数据库失败, 创建VocaDao对象失败')
            console.log(err)
        }
        return this.realm;
    }
    /** 数据库是否打开的 */
    isOpen() {
        return (this.realm !== null)
    }
    /**关闭数据库 */
    close() {
        if (this.realm && !this.realm.isClosed) {
            this.realm.close()
            this.realm = null
        }
    }

    /**
     * @function  查词（模糊查询匹配的前8个单词）
     *            分3种查询：用单词查询，用短语查询；用中文查询；
     * @param searchText
     * @return 返回一个数组
     */
    searchWord(searchText) {
        if (!searchText)
            return []
        const word = searchText.replace(/^(\s*)/, '')
        let wordInfos = []
        const data = []
        let isPhr = false
        // 英文查询
        if (word[0].match(/[a-zA-Z]/)) {
            isPhr = word.includes(' ')
            if (isPhr) {//短语
                wordInfos = this.realm.objects('PhraseInfo').filtered('phrase CONTAINS "' + word + '"');
            } else {            //单词
                wordInfos = this.realm.objects('WordInfo').filtered('word BEGINSWITH "' + word + '"');
            }
        } else {
            // 中文查询
            wordInfos = this.realm.objects('WordInfo').filtered('trans CONTAINS "' + word + '"');
            for (let wi of wordInfos) {
                const trans = wi.trans
                if (trans.match(new RegExp("[^\u4e00-\u9fa5（）]+" + word + "[^\u4e00-\u9fa5（）]+"))) {
                    data.push(this._adaptVocaInfo(wi, isPhr))
                }
                if (data.length >= 8) {
                    console.log('break at 8')
                    break;
                }
            }

        }
        if (data.length === 0) {
            for (let wi of wordInfos) {
                data.push(this._adaptVocaInfo(wi, isPhr))
                if (data.length >= 8) {
                    console.log('break at 8')
                    break;
                }
            }
        }
        return data;
    }

    /**
     * @function 查词
     *          通过单词的变形可以查询到原型
     * @param word
     * @param flag 
     * @return 返回一个对象
     */
    _lookWordInfo(word, flag = 1) {
        let wordObj = null
        try {
            //查询单词基本信息
            let wordInfos = this.realm.objects('WordInfo').filtered('word="' + word + '"'); //数组
            if (wordInfos[0]) {
                wordObj = wordInfos[0]
            } else {
                //从变形词中找
                const transformObj = this.realm.objects('WordTransform').filtered('transform="' + word + '"')[0];
                if (transformObj) {
                    wordObj = this.realm.objects('WordInfo').filtered('word="' + transformObj.proto + '"')[0]
                } else {
                    //首字母小写查询
                    if (flag === 1 && word.match(/^[A-Z]/)) {
                        wordObj = this._lookWordInfo(word.toLowerCase(), 2)
                    }
                }

            }

        } catch (e) {
            console.log(e)
            console.log('VocaDao : lookWordInfo() Error')
        }
        return wordObj
    }

    /**
     * @function 点击查词
     *          通过单词的变形可以查询到原型
     * @param word
     * @return 返回一个对象
     */
    lookWordInfo(word) {
        if (!word || word.trim() === '') {
            return null
        }
        word = word.trim()
        const obj = this._lookWordInfo(word)

        return this._adaptVocaInfo(obj, false)
    }

    /**
        * @function 查询单词(短语)详情
        * @param word
        * @return 返回一个数组
        */
    getWordInfo(word) {
        if (!word || word.trim() === '') {
            return null
        }
        word = word.trim()
        const isPhr = word.includes(' ')
        const queryKey = isPhr ? 'phrase="' : 'word="'
        const queryField = isPhr ? 'PhraseInfo' : 'WordInfo'
        let obj = null
        let wordInfos = this.realm.objects(queryField).filtered(queryKey + word + '"'); //数组
        if (wordInfos[0]) {
            obj = wordInfos[0]
        }
        return this._adaptVocaInfo(obj, isPhr)
    }

    /**
     * @function 批量查询单词(短语)详情
     * @param words
     * @return 返回一个数组
     */
    getWordInfos(words) {
        console.log("---1---")
        console.log(words)
        //验证
        if (!words || words.length === 0)
            return []
        if (typeof words === "string") {
            words = words.split(',').map((item, i) => {
                return item.trim()
            })
        }
        console.log("---2---")
        console.log(words)
        // 词汇类型判断/是否是短语
        const arr = []
        const isPhr = words[0].includes(' ')
        const queryKey = isPhr ? 'phrase="' : 'word="'
        const queryField = isPhr ? 'PhraseInfo' : 'WordInfo'

        try {
            const len = words.length
            if (len && len > 0) {
                //拼接
                let str = ''
                for (let i in words) {
                    if (i == (len - 1)) {
                        str += queryKey + words[i] + '"';
                    } else {
                        str += queryKey + words[i] + '" OR ';
                    }
                }
                let wordInfos = this.realm.objects(queryField).filtered('(' + str + ')'); //数组
                //排序
                for (let word of words) {
                    let temp = null
                    for (let wi of wordInfos) {
                        const compareWord = isPhr ? wi.phrase : wi.word
                        if (compareWord === word) {
                            temp = wi
                            break
                        }
                    }
                    if (temp) {
                        //构建适配短语和单词的对象
                        arr.push(this._adaptVocaInfo(temp, isPhr))
                    } else {
                        arr.push({
                            word: word
                        })
                    }

                }
            }

        } catch (e) {
            console.log(e)
            console.log('VocaDao : getWordInfos() Error')
        }
        return arr
    }

    /**
     * @function 获取未pass的单词信息
     * @param {*} words 
     * @param {*} wordInfos 
     */
    getShowWordInfos(words, wordInfos = null) {
        if (!words) {
            return []
        }
        const showWordInfos = []
        if (wordInfos === null) {
            wordInfos = this.getWordInfos(words.map((item, index) => item.word))
        }
        for (let i in words) {
            //过滤
            if (words[i].passed === false) {
                showWordInfos.push(wordInfos[i])
            }
        }
        return showWordInfos
    }


    getTransforms(word) {
        if (!word) {
            return []
        }
        const transforms = this.realm.objects("WordTransform").filtered('proto="' + word + '"');
        const arr = transforms.map((item, i) => {
            return item.transform
        })
        return arr
    }

    // 适配
    _adaptVocaInfo(obj, isPhr) {
        if (!obj) {
            return {} //空对象避免null错误
        }
        const isEnPron = store.getState().mine.configVocaPronType === VOCA_PRON_TYPE_EN
        let transObj = null
        try {
            transObj = isPhr ? null : JSON.parse(obj.trans)
        } catch (err) {
            console.log(obj.trans)
            console.log("vocaDao: 解析trans失败")
            console.log(err)
        }
        const data = {
            word: isPhr ? obj.phrase : obj.word,             //单词
            //默认音标和发音
            phonetic: isPhr ? obj.phonetic : (isEnPron ? obj.en_phonetic : obj.am_phonetic),
            pron_url: isPhr ? obj.pron_url : (isEnPron ? obj.en_pron_url : obj.am_pron_url),
            //美式和英式
            en_phonetic: isPhr ? null : obj.en_phonetic,
            en_pron_url: isPhr ? null : obj.en_pron_url,
            am_phonetic: isPhr ? null : obj.am_phonetic,
            am_pron_url: isPhr ? null : obj.am_pron_url,

            def: isPhr ? null : obj.def,                            //英英释义
            def_pron_url: isPhr ? null : obj.def_pron_url,          //英英释义发音
            sentence: isPhr ? obj.sen : obj.sentence,               //例句
            sen_tran: obj.sen_tran,                                 //例句翻译
            sen_pron_url: obj.sen_pron_url,                         //例句发音

            phrases: isPhr ? [] : obj.phrases,                      //短语 
            translation: isPhr ? obj.tran : this._transToText(transObj),     //综合翻译
            trans: transObj,                                                //词性翻译
            examples: obj.examples,                                         //影视例句
            transforms: isPhr ? [] : obj.transforms                          //变形
        }
        return data
    }

    // 负责将翻译转为字符串
    _transToText = (tranObj) => {
        if (!tranObj || tranObj === '') {
            return ''
        }
        let translation = ''
        try {
            if (tranObj) {
                for (let k in tranObj) {
                    translation += `${k}. ${tranObj[k]} `
                }
            }
        } catch (e) {
            console.log(e)
        }
        return translation
    }




}
