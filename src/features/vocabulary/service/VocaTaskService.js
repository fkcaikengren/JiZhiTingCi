
import * as Constant from '../common/constant'
import _util from '../../../common/util'
import VocaUtil from '../common/vocaUtil'
import VocaTaskDao from "./VocaTaskDao";
import _ from 'lodash'
import * as CConstant from "../../../common/constant";
import { store } from '../../../redux/store'
import ArticleDao from '../../reading/service/ArticleDao';

/**
    在dao层进行进一步的数据格式处理, 同时把数据完全拷贝出来
 */
export default class VocaTaskService {

    constructor() {
        this.vtd = VocaTaskDao.getInstance()
        this.vtd.open()

        this.artDao = ArticleDao.getInstance()
        this.artDao.open()
    }
    /**
     * 关闭数据库
     */
    closeRealm() {
        this.vtd.close()
    }



    /**
    * 保存用户的任务数据
    *   把leftTimes设置为系统配置值
    *   同时修改bookWord的learned
    * @param vocaTasks
    * @param bookWords
    */
    saveUserVocaTasks(vocaTasks, bookWords) {
        const learnedWords = []
        for (let task of vocaTasks) {
            for (let tWord of task.taskWords) {
                learnedWords.push(tWord.word)
            }
        }

        try {
            this.vtd.realm.write(() => {
                for (let task of vocaTasks) {
                    if (task.status === Constant.STATUS_0) {
                        task.leftTimes = 3
                    } else {
                        task.leftTimes = store.getState().mine.configReviewPlayTimes
                    }
                    this.vtd.realm.create('VocaTask', task)
                }

                for (let bWord of bookWords) {
                    bWord.learned = learnedWords.includes(bWord.word)
                    this.vtd.realm.create('BookWord', bWord);
                }
            })
            console.log('saveUserVocaTasks 保存成功，结束！')
        } catch (e) {
            console.log('saveUserVocaTasks 保存失败！')
            console.log(e)
        }
    }

    /**
    * 获取今日任务
    *       任务顺序，大原则按taskOrder递增，新学产生的1复任务放末尾
    *       判断是否出现中断学习, 中断>13天（8+5=13），则重学。中断<=13,模拟学习产生数据
    * @param lastLearnDate 上一次学习时间（timestap）
    * @param taskCount  任务数量
    * @param taskWordCount 任务单词数量。
    * @param n 默认是0，表示今天
    * @returns 
    */
    getTodayTasks(lastLearnDate, taskCount, taskWordCount, n = 0) {

        let d = 1
        if (lastLearnDate) {
            d = parseInt((_util.getDayTime(n) - lastLearnDate) / CConstant.DAY_MS)
            console.log('------日期差：-------')
            console.log(d)
            if (d < 0) {
                //VocaTask未过时 (不会调用该函数， 如果调用该函数则应该抛出异常)
                throw new Error('getTodayTasks 错误: lastLearnDate 大于今日零点时间戳！')
            } else if (d > 1 && d <= 13) {
                //迭代模拟学习
                for (let day = d; day >= 2; day--) {
                    console.log(`模拟之前第${day - 1}天学习。。。。。`)
                    this.getTodayTasks(_util.getDayTime((n - day)), taskCount, taskWordCount, 1 - day)
                }
            } else if (d > 13) {
                //重学所有非200的任务,删除
                console.log('---------------删除所有非200任务----------')
                const deleteTasks = this.vtd.getNotFinishedTasks()
                this.vtd.modify(() => {
                    for (let dTask of deleteTasks) {
                        this.vtd.realm.delete(dTask)
                    }
                })
            }
            // d==0表示当天退出重登录
            // d==1表示未中断过学习
        }


        //1. 计算
        if (d > 0) {
            this.calculateTasks(taskCount, taskWordCount, n)
        }
        //2. 获取今日任务
        const storedTasks = this.vtd.getTasksByDay(n)
        console.log('----获取今日任务，长度：-----')
        console.log(storedTasks.length)
        let copyTasks = []
        let reviewTasks = []
        //3. 包装（包括深拷贝）
        for (let task of storedTasks) {
            let copyTask = VocaUtil.copyTaskDeep(task, true)
            copyTask.taskType = Constant.TASK_VOCA_TYPE  //标记为单词任务
            copyTasks.push(copyTask)
            if (copyTask.status === Constant.STATUS_0) {

                //生成1复任务
                const reviewTask = VocaUtil.copyTaskDeep(copyTask, true);
                reviewTask.taskType = Constant.TASK_VOCA_TYPE  //标记为单词任务
                reviewTask.status = Constant.STATUS_1
                reviewTask.progress = Constant.IN_REVIEW_PLAY
                reviewTask.leftTimes = store.getState().mine.configReviewPlayTimes
                reviewTasks.push(reviewTask)
            }

        }
        //4. 顺序调整（新学放开头，新学变成的1复放末尾）
        let newTasks = [], otherTasks = []
        for (let t of copyTasks) {
            if (t.status === Constant.STATUS_0) {
                newTasks.push(t)
            } else {
                otherTasks.push(t)
            }
        }
        return newTasks.concat(otherTasks).concat(reviewTasks)
    }

    /**
     * 产生新的单词任务
     * @param  vocaTaskDate 任务开启日期
     * @param taskCount  任务数量
     * @param taskWordCount 任务单词数
     * @return 返回深拷贝的VocaTask数组
     */
    genNewTasks(vocaTaskDate, taskCount, taskWordCount) {
        //1. 生成taskOrder
        let taskOrder = this.vtd.getLastTaskOrder() + 1
        //2. 包装未学的单词
        const bookWords = this.vtd.getNotLearnedBookWords()
        const bWordsLength = bookWords.length
        let isEnd = false
        if (bWordsLength > 0) { //如果存在未学单词
            const vocaTasks = []
            let wordIds = []
            for (let tc = 0; tc < taskCount; tc++) {
                if (isEnd) {
                    break
                }
                // 2.1获取任务单词
                const taskWords = []
                for (let i = 0; i < taskWordCount; i++) {
                    //当单词数组长度不够
                    if (bWordsLength <= (tc * taskWordCount + i)) {
                        isEnd = true
                        break
                    }

                    const { word, wordId } = bookWords[(tc * taskWordCount) + i]
                    taskWords.push({ word, wordId })
                    wordIds.push(wordId)
                }
                //2.2获取今日任务的文章
                let taskArticles = []
                if (taskWords.length > 0) {
                    console.log(`${taskWords[0].wordId}----->${taskWords[taskWords.length - 1].wordId}`)
                    taskArticles = this.artDao.getTodayArticles(taskWords[0].wordId, taskWords[taskWords.length - 1].wordId)
                    taskArticles = taskArticles.map((article, index) => {
                        return {
                            id: article.id,
                            score: -1,
                        }
                    })
                }
                //2.3 包装
                vocaTasks.push({
                    taskOrder: taskOrder++, //完成一次自加
                    vocaTaskDate,
                    wordCount: taskWords.length,
                    taskWords,
                    taskArticles,
                })
            }
            //3. 修改单词learned
            this.vtd.modifyBookWordsLearnedById(wordIds, true)
            //4. 保存VocaTask
            this.vtd.saveVocaTasks(vocaTasks)

            //5. 添加至上传任务
            for (let task of vocaTasks) {
                Storage.save({
                    key: 'notSyncTasks',
                    id: CConstant.COMMAND_CREATE_TASK.split('_').join('-') + task.taskOrder,
                    data: {
                        command: CConstant.COMMAND_CREATE_TASK,
                        data: {
                            ...task,
                            taskWords: task.taskWords.map((item, i) => ({ word: item.word }))
                        }
                    }
                })
            }
        }

    }


    /**
     * 计算前一天的任务
     * @param {*} taskCount 
     * @param {*} taskWordCount 
     * @param n 0表示今天，-n表示前n天，n表示后n天
     */
    calculateTasks(taskCount, taskWordCount, n = 0) {
        // 1.读取前一天任务
        const storedTasks = this.vtd.getTasksByDay(n - 1)
        // 2.修改前一天任务
        let leftCount = 0
        let relearnWords = []
        if (storedTasks.length > 0) //当以前有任务时
            this.vtd.modify(() => {
                for (let storedTask of storedTasks) {
                    let isDeleted = false
                    if (storedTask.progress.startsWith('IN_LEARN') && storedTask.progress !== Constant.IN_LEARN_FINISH) {      //新学未完成
                        //重学
                        relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                        isDeleted = true
                        console.log('未完成新学')
                    } else if (storedTask.progress === Constant.IN_REVIEW_FINISH) {    //完成复习
                        switch (storedTask.status) {
                            case Constant.STATUS_1:
                                storedTask.vocaTaskDate += _util.getDaysMS(1)
                                break
                            case Constant.STATUS_2:
                                storedTask.vocaTaskDate += _util.getDaysMS(2)
                                break
                            case Constant.STATUS_4:
                                storedTask.vocaTaskDate += _util.getDaysMS(3)
                                break
                            case Constant.STATUS_7:
                                storedTask.vocaTaskDate += _util.getDaysMS(8)
                                break
                            default:
                                break;
                        }
                        storedTask.status = VocaUtil.getNextStatus(storedTask.status)
                        storedTask.delayDays = 0
                        console.log('完成复习')
                    } else if (storedTask.progress.startsWith('IN_REVIEW')) {         //未完成复习
                        storedTask.vocaTaskDate += _util.getDaysMS(1)
                        switch (storedTask.status) {
                            case Constant.STATUS_1:
                                if (storedTask.delayDays < Constant.DELAY_DAYS_1) {
                                    storedTask.delayDays += 1
                                    leftCount++
                                } else {//重学
                                    relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                                    isDeleted = true
                                }
                                break
                            case Constant.STATUS_2:
                                if (storedTask.delayDays < Constant.DELAY_DAYS_2) {
                                    storedTask.delayDays += 1
                                    leftCount++
                                } else {//重学
                                    relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                                    isDeleted = true
                                }
                                break
                            case Constant.STATUS_4:
                                if (storedTask.delayDays < Constant.DELAY_DAYS_4) {
                                    storedTask.delayDays += 1
                                    leftCount++
                                } else {//重学
                                    relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                                    isDeleted = true
                                }
                                break
                            case Constant.STATUS_7:
                                if (storedTask.delayDays < Constant.DELAY_DAYS_7) {
                                    storedTask.delayDays += 1
                                    leftCount++
                                } else {//重学
                                    relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                                    isDeleted = true
                                }
                                break
                            case Constant.STATUS_15:
                                if (storedTask.delayDays < Constant.DELAY_DAYS_15) {
                                    storedTask.delayDays += 1
                                    leftCount++
                                } else {//重学
                                    relearnWords = relearnWords.concat(storedTask.taskWords.map((item, i) => item.word))
                                    isDeleted = true
                                }
                                break
                            default:
                                break;
                        }
                        console.log('未完成复习')
                    }

                    if (isDeleted) {
                        console.log('----重学任务删除：taskOrder: ' + storedTask.taskOrder)
                        Storage.save({
                            key: 'notSyncTasks',
                            id: CConstant.COMMAND_DELETE_TASK.split('_').join('-') + storedTask.taskOrder,
                            data: {
                                command: CConstant.COMMAND_DELETE_TASK,
                                data: storedTask
                            }
                        })
                        this.vtd.realm.delete(storedTask.taskArticles)
                        this.vtd.realm.delete(storedTask.taskWords)
                        this.vtd.realm.delete(storedTask)
                    } else {
                        storedTask.curIndex = 0
                        if (storedTask.status == Constant.STATUS_200) { //完成
                            storedTask.progress = Constant.IN_REVIEW_FINISH
                            storedTask.leftTimes = 0
                        } else {                                            //延迟
                            storedTask.progress = Constant.IN_REVIEW_PLAY
                            storedTask.leftTimes = store.getState().mine.configReviewPlayTimes
                        }
                    }
                }
            })
        // 重学的标记learned=false 并删除该任务
        // console.log(relearnWords)
        this.vtd.modifyBookWordsLearnedByWord(relearnWords, false)
        // 3.生成新任务
        if (leftCount <= 1) { //任务遗留数量<=1时
            this.genNewTasks(_util.getDayTime(n), taskCount, taskWordCount)
        }
    }






    /**
     *  获取错误单词列表
     * @returns {Array}
     */
    getWrongList() {
        let wrongArr = []
        try {
            for (let i = 6; i >= 1; i--) {
                //查询
                const words = i === 6 ? this.vtd.getWordsGEWrongNum(i) : this.vtd.getWordsEqWrongNum(i)
                const arr = []
                for (let w of words) {
                    arr.push({
                        isHeader: false,
                        checked: false,
                        word: w.word,
                    })
                }
                if (arr.length > 0) {
                    wrongArr.push({
                        isHeader: true,
                        checked: false,
                        title: i === 6 ? `答错超过5次, 共${words.length}词` : `答错${i}次, 共${words.length}词`
                    })
                    wrongArr = wrongArr.concat(arr)
                }
            }

        } catch (e) {
            console.log(e)
            console.log('获取错词列表失败')
        }

        return wrongArr
    }

    /**
     *  获取PASS列表单词
     * @returns {Array}
     */
    getPassList() {
        const passArr = []
        try {
            //查询
            const tasks = this.vtd.getLearnedTasks()
            // console.log(tasks)
            for (let task of tasks) { //遍历任务
                let hasPassedWord = false
                let count = 0
                const header = {
                    isHeader: true,
                    checked: false,
                    title: ''
                }
                passArr.push(header)
                const words = task.taskWords
                // console.log(words)
                for (let i in words) {
                    if (words[i].passed) {
                        count++
                        passArr.push({
                            isHeader: false,
                            checked: false,
                            word: words[i].word,
                        })
                        if (!hasPassedWord) {
                            hasPassedWord = true
                        }
                    }
                }
                header.title = `${VocaUtil.genTaskName(task.taskOrder)}, 共${count}词`
                //任务中没有passed 单词
                if (!hasPassedWord) {
                    passArr.pop()
                }
            }

        } catch (e) {
            console.log(e)
            console.log('获取PASS列表失败')
        }

        return passArr
    }


    /**
     *  获取已学单词列表 
     * @returns {Array}
     */
    getLearnedList() {
        const learnedArr = []
        try {
            const tasks = this.vtd.getLearnedTasks()
            for (let task of tasks) { //遍历任务
                const words = task.taskWords
                const header = {
                    isHeader: true,
                    checked: false,
                    title: `${VocaUtil.genTaskName(task.taskOrder)}, 共${words.length}词`
                }
                learnedArr.push(header)

                for (let i in words) {
                    learnedArr.push({
                        isHeader: false,
                        checked: false,
                        word: words[i].word,
                    })
                }
            }
        } catch (e) {
            console.log(e)
            console.log('获取已学单词列表失败')
        }

        return learnedArr
    }


    /**
     *  获取未学单词列表
     * @returns {Array}
     */
    getNewList() {
        const newArr = []
        try {
            const newLearnTasks = this.vtd.getNewLearnTasks()       //新学任务
            const notLearnedWords = this.vtd.getNotLearnedBookWords()   //未学单词
            for (let task of newLearnTasks) {
                for (let tWord of task.taskWords) {
                    newArr.push({
                        isHeader: false,
                        checked: false,
                        word: tWord.word,
                    })
                }
            }
            for (let w of notLearnedWords) {
                newArr.push({
                    isHeader: false,
                    checked: false,
                    word: w.word,
                })
            }
        } catch (e) {
            console.log(e)
            console.log('获取未学单词列表失败')
        }

        return newArr
    }


    /**
     * 统计剩余天数
     * @param {Number} taskCount 
     * @param {Number} taskWordCount 
     * @returns {Number} 剩余天数
     */
    countLeftDays(taskCount, taskWordCount) {
        let leftDays = 0
        const notLearnWords = this.vtd.getNotLearnedBookWords()
        const length = notLearnWords.length
        console.log('notLearnWords.length ==== ' + length)
        if (length > 0) {
            // 当存在未学单词时
            leftDays = Math.ceil(length / (taskCount * taskWordCount)) + Constant.LEFT_PLUS_DAYS
        } else {
            // 当不存在未学单词
            const lastTask = this.vtd.realm.objects('VocaTask').sorted('taskOrder', true)[0] //获取最后一个VocaTask
            const { vocaTaskDate, status } = lastTask
            const d = (vocaTaskDate - _util.getDayTime(0)) / CConstant.DAY_MS
            leftDays = d + 15
            switch (status) {
                case Constant.STATUS_200:
                    leftDays = 0
                    break
                case Constant.STATUS_15:
                    leftDays = d + 1
                    break
                case Constant.STATUS_7:
                    leftDays = d + 9
                    break
                case Constant.STATUS_4:
                    leftDays = d + 12
                    break
                case Constant.STATUS_2:
                    leftDays = d + 14
                    break
            }
        }
        return leftDays
    }

    /**
     *  统计已学单词数
     * @returns {Number} 已学单词数量
     */
    countLearnedWords() {
        const learnedTasks = this.vtd.getLearnedTasks()
        let sum = 0
        for (let task of learnedTasks) {
            sum += task.taskWords.length
        }
        return sum
    }

    /**
    *  清空数据库
    */
    deleteAll() {
        this.vtd.deleteAll()
    }
}