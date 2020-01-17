
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
            console.log('打开voca.realm')
            if (this.realm === null)
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
        // 英文查询
        if (word[0].match(/[a-zA-Z]/)) {

            if (word.includes(' ')) {//短语
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
                    data.push(wi)
                }
                if (data.length >= 8) {
                    console.log('break at 8')
                    break;
                }
            }

        }
        if (data.length === 0) {
            for (let wi of wordInfos) {
                data.push(wi)
                if (data.length >= 8) {
                    console.log('break at 8')
                    break;
                }
            }
        }
        return data;
    }

    /**
     * @function 点击查词
     *          通过单词的变形可以查询到原型
     * @param word
     * @param flag 
     * @return 返回一个对象
     */
    lookWordInfo(word, flag = 1) {
        if (!word || word.trim() === '') {
            return null
        }
        word = word.trim()
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
                        wordObj = this.lookWordInfo(word.toLowerCase(), 2)
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
     * @function 批量查询单词详情
     * @param words
     * @return 返回一个数组
     */
    getWordInfos(words) {

        //验证
        if (!words || words.length < 0)
            return []
        if (typeof words === "string") {
            words = words.split(',').map((item, i) => {
                return item.trim()
            })
        }
        console.log(words)
        const arr = []
        try {
            const len = words.length
            if (len && len > 0) {
                //拼接
                let str = ''
                for (let i in words) {
                    if (i == (len - 1)) {
                        str += 'word="' + words[i] + '"';
                    } else {
                        str += 'word="' + words[i] + '" OR ';
                    }
                }
                let wordInfos = this.realm.objects('WordInfo').filtered('(' + str + ')'); //数组
                //排序
                for (let word of words) {
                    let temp = null
                    for (let wi of wordInfos) {
                        if (wi.word === word) {
                            temp = wi
                            break
                        }
                    }
                    if (temp) {
                        arr.push(temp)
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
     * @function 批量查询短语详情
     * @param phrs
     * @return 返回一个数组
     */
    getPhraseInfos(phrs) {
        //验证
        if (!phrs || phrs.length < 0)
            return []
        if (typeof phrs === "string") {
            phrs = phrs.split(',').map((item, i) => {
                return item.trim()
            })
        }
        console.log(phrs)
        const arr = []
        try {
            const len = phrs.length
            if (len && len > 0) {
                //拼接
                let str = ''
                for (let i in phrs) {
                    if (i == (len - 1)) {
                        str += 'phrase="' + phrs[i] + '"';
                    } else {
                        str += 'phrase="' + phrs[i] + '" OR ';
                    }
                }

                let phrInfos = this.realm.objects('PhraseInfo').filtered('(' + str + ')'); //数组
                //排序
                for (let phr of phrs) {
                    let temp = null
                    for (let pi of phrInfos) {
                        if (pi.phrase === phr) {
                            temp = pi
                            break
                        }
                    }
                    if (temp) {
                        arr.push(temp)
                    } else {
                        arr.push({
                            phrase: phr
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


}
