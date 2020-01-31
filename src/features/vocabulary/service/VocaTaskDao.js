import _util from "../../../common/util";
const Realm = require('realm')
import * as Constant from "../common/constant";

// 1. 任务表
const VocaTaskSchema = {
    name: 'VocaTask',
    primaryKey: 'taskOrder',
    properties: {
        taskOrder: 'int',                      //任务序号
        //任务状态 [0,1,2,4,7,15,200 ] 代表[待学，1复，2复，4复，7复，15复，完成]
        status: { type: 'int', optional: true, default: 0 },
        //任务执行日期
        vocaTaskDate: 'int?',
        //任务进度
        progress: { type: 'string', optional: true, default: 'IN_LEARN_PLAY' },
        //进行中的当前单词下标
        curIndex: { type: 'int', optional: true, default: 0 },
        //剩下的遍数
        leftTimes: { type: 'int', optional: true, default: Constant.LEARN_PLAY_TIMES }, //默认是新学阶段，3遍轮播
        //延迟天数
        delayDays: { type: 'int', optional: true, default: 0 },
        //创建时间
        createTime: { type: 'int', optional: true, default: Date.now() },
        //未被pass的单词数量
        wordCount: 'int?',
        //听的遍数
        listenTimes: { type: 'int', optional: true, default: 0 },
        //测试遍数
        testTimes: { type: 'int', optional: true, default: 0 },
        //任务单词数组
        taskWords: 'TaskWord[]',
        //任务文章数组
        taskArticles: 'TaskArticle[]',
    }
};


// 2. 任务单词表
const TaskWordSchema = {
    name: 'TaskWord',
    primaryKey: 'word',
    properties: {
        word: 'string',
        passed: { type: 'bool', optional: true, default: false },
        wrongNum: { type: 'int', optional: true, default: 0 },
    }
};

// 3. 任务文章表
const TaskArticleSchema = {
    name: 'TaskArticle',
    primaryKey: 'id',
    properties: {
        id: 'string',                                          //文章id
        score: { type: 'int', optional: true, default: 0 },     //得分
    }
};

// 4. 单词书单词表
const BookWordSchema = {
    name: 'BookWord',
    primaryKey: 'wordId',
    properties: {
        wordId: 'int',
        word: "string?",
        learned: { type: 'bool', optional: true, default: false },
    }
};


export default class VocaTaskDao {

    constructor() {
        this.realm = null
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new VocaTaskDao();
        }
        return this.instance;
    }

    /**
     * 打开数据库
     * @returns {Promise<null>}
     */
    async open() {
        try {
            if (!this.realm) {
                this.realm = await Realm.open({ path: 'VocaTask.realm', schema: [BookWordSchema, TaskWordSchema, TaskArticleSchema, VocaTaskSchema] })
                // console.log(this.realm)
            }
        } catch (err) {
            console.log('VocaTaskDao: 创建VocaTask.realm数据库失败')
            console.log(err)
        }
        return this.realm;
    }

    /**
     * 判断数据库是否关闭
     * @returns {boolean}
     */
    isOpen() {
        return (this.realm !== null)
    }

    /**
     * 关闭数据库
     */
    close() {
        if (this.realm && !this.realm.isClosed) {
            this.realm.close()
            this.realm = null
        }
    }

    /**
     * 保存任务数据
     * @param vocaTasks
     */
    saveVocaTasks(vocaTasks) {
        try {
            this.realm.write(() => {
                for (let task of vocaTasks) {
                    this.realm.create('VocaTask', task)
                }
            })
            console.log('VocaTasks 保存成功，结束！')
        } catch (e) {
            console.log('VocaTasks 保存失败！')
            console.log(e)
        }
    }

    /**
     * 保存单词书单词
     * @param vocaTasks
     * @return 成功返回true
     */
    saveBookWords(bookWords) {
        let success = true
        try {
            this.realm.write(() => {
                for (let bWord of bookWords) {
                    this.realm.create('BookWord', bWord);
                }
            })
            console.log('BookWords 保存成功，结束！')
        } catch (e) {
            success = false
            console.log('BookWords 保存失败！')
            console.log(e)
        }
        return success
    }


    /**
     * 批量修改对象数据
     * @param tasks
     */
    modifyTasks(tasks) {
        try {
            this.realm.write(() => {
                for (let task of tasks) {
                    this.realm.create('VocaTask', task, true);
                }
                console.log('modifyTasks: 批量修改task成功')
            })
        } catch (e) {
            console.log('批量修改task数据失败')
            console.log(e)
        }
    }

    /**
     * 修改修改对象数据
     * @param task
     */
    modifyTask(task) {
        try {
            this.realm.write(() => {
                this.realm.create('VocaTask', task, true);
            })
        } catch (e) {
            console.log('VocaTaskDao : 修改Task失败')
            console.log(e)
        }
    }

    /** 修改任务的单词 */
    modifyTaskWord(taskWord) {
        try {
            this.realm.write(() => {
                this.realm.create('TaskWord', taskWord, true);
            })
        } catch (e) {
            console.log('VocaTaskDao : 修改TaskWord失败')
            console.log(e)
        }
    }

    /**
     * 修改任务文章
     * @param  taskArticle 
     */
    modifyTaskArticle(taskArticle) {
        try {
            this.realm.write(() => {
                this.realm.create('TaskArticle', taskArticle, true);
            })
        } catch (e) {
            console.log('VocaTaskDao : 修改TaskArticle失败')
            console.log(e)
        }
    }

    /**
     * 根据wordId批量修改BookWord的learned
     * @param {*} wordIds 
     * @param {*} learned 
     */
    modifyBookWordsLearnedById(wordIds, learned) {
        if (wordIds && wordIds.length > 0) {
            const len = wordIds.length
            const queryKey = 'wordId='
            let str = ''
            for (let i in wordIds) {
                if (i == (len - 1)) {
                    str += queryKey + wordIds[i];
                } else {
                    str += queryKey + wordIds[i] + ' OR ';
                }
            }
            try {
                this.realm.write(() => {
                    const bookWords = this.realm.objects('BookWord').filtered(str)
                    for (let bw of bookWords) {
                        bw.learned = learned
                    }
                })
            } catch (e) {
                console.log(' modifyBookWordsLearnedById, 修改learned失败')
                console.log(e)
            }
        }

    }

    /**
     * 根据word批量修改BookWord的learned
     * @param {*} words 
     * @param {*} learned 
     */
    modifyBookWordsLearnedByWord(words, learned) {
        if (words && words.length > 0) {
            const len = words.length
            const queryKey = 'word='
            let str = ''
            for (let i in words) {
                if (i == (len - 1)) {
                    str += queryKey + '"' + words[i] + '"';
                } else {
                    str += queryKey + '"' + words[i] + '" OR ';
                }
            }
            try {
                this.realm.write(() => {
                    const bookWords = this.realm.objects('BookWord').filtered(str)
                    for (let bw of bookWords) {
                        bw.learned = learned
                    }
                })
            } catch (e) {
                console.log(' modifyBookWordsLearnedByWord, 修改learned失败')
                console.log(e)
            }
        }

    }

    /**自定义修改 */
    modify(fn) {
        this.realm.write(fn)
    }




    /**
     * 获取最后一个VocaTask的TaskOrder
     * @returns 返回TaskOrder，当无VocaTask数据时返回0
     */
    getLastTaskOrder() {
        const vocaTasks = this.realm.objects('VocaTask')
        if (vocaTasks.length > 0) {
            const resultTasks = vocaTasks.sorted('taskOrder', true); //降序
            return resultTasks[0].taskOrder
        } else {
            return 0
        }
    }


    /**
     * 获取已学的单词
     * @returns {Realm.Results<any>}查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
    getLearnedBookWords() {
        return this.realm.objects('BookWord').filtered('learned = true') || []
    }


    /**
     * 获取未学的单词
     * @returns {Realm.Results<any>}
     */
    getNotLearnedBookWords() {
        return this.realm.objects('BookWord').filtered('learned = false') || []
    }

    /**
     * 获取两个wordId之间的单词
     * @param {*} startWordId 起始wordId
     * @param {*} endWordId 结束wordId
     * @returns {Realm.Results<any>}
     */
    getBookWordsByWordId(startWordId, endWordId) {
        return this.realm.objects('BookWord').filtered('wordId >= ' + startWordId + ' AND wordId <= ' + endWordId)
    }

    /**
     * 根据日期获取任务
     * @param nth 0表示今天，-n表示前n天，n表示后n天
     * @returns 查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
    getTasksByDay(nth = 0) {
        let today = _util.getDayTime(nth)
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = ' + today + 'SORT(taskOrder ASC)')
        return vocaTasks;
    }





    /**
     * 查询未完成的任务
     * @return 查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
    getNotFinishedTasks() {
        return this.realm.objects('VocaTask').filtered('status != 200')
    }
    /**
     * 获取已学任务
     * @return  {Realm.Results<any>}
     */
    getLearnedTasks() {
        return this.realm.objects('VocaTask').filtered('status > 0 SORT(taskOrder ASC)')
    }

    /**
     * 获取新学任务
     * @returns {Realm.Results<any>}
     */
    getNewLearnTasks() {
        return this.realm.objects('VocaTask').filtered('status = 0 SORT(taskOrder ASC)')
    }


    /** 根据错词频数查询单词 */
    getWordsEqWrongNum(num) {
        return this.realm.objects('TaskWord').filtered('wrongNum = ' + num)

    }
    /** 查询错误频数大于num 的所有单词*/
    getWordsGEWrongNum(num) {
        return this.realm.objects('TaskWord').filtered('wrongNum >= ' + num)
    }


    /**
     * 根据taskOrder获取任务
     * @param taskOrder
     * @returns {any} 如果不存在，返回undefined
     */
    getTaskByOrder(taskOrder) {
        return this.realm.objects('VocaTask').filtered('taskOrder = ' + taskOrder)[0]
    }


    /**
     * 查询出某个单词 
     * @param {*} word 单词
     * @returns 任务的单词信息
     */
    getWord(word) {
        return this.realm.objects('TaskWord').filtered('word = "' + word + '"')
    }


    /**
     *  清空所有任务和单词，清空数据库
     */
    deleteAllTasks() {
        this.realm.write(() => {
            this.realm.deleteAll();
        })
    }

}

