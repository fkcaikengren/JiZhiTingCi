
import * as Constant from './constant'
import VocaTaskDao from '../service/VocaTaskDao'
import { NavigationActions, StackActions } from 'react-navigation'
import { store } from '../../../redux/store'
import ArticleService from '../../reading/service/ArticleService'

export default class VocaUtil {


    /**
     * 浅拷贝VocaTask数组
     * @param  tasks 
     * @returns  新的VocaTask数组
     */
    static copyTasks(tasks) {
        const copyTasks = []
        for (let task of tasks) {
            copyTasks.push({
                taskOrder: task.taskOrder,
                status: task.status,
                vocaTaskDate: task.vocaTaskDate,
                progress: task.progress,
                curIndex: task.curIndex,
                leftTimes: task.leftTimes,
                delayDays: task.delayDays,
                createTime: task.createTime,
                wordCount: task.wordCount,
                listenTimes: task.listenTimes,
                testTimes: task.testTimes,
                taskWords: task.taskWords,
                taskArticles: task.taskArticles
            })
        }
        return copyTasks
    }

    /**
     *  深拷贝VocaTask
     * @param task 
     * @returns  新的VocaTask
     * */
    static copyTaskDeep(task, setTestWrongNumZero = false) {
        let copyTask = {
            taskOrder: task.taskOrder,
            status: task.status,
            vocaTaskDate: task.vocaTaskDate,
            progress: task.progress,
            curIndex: task.curIndex,
            leftTimes: task.leftTimes,
            delayDays: task.delayDays,
            createTime: task.createTime,
            wordCount: task.wordCount,
            listenTimes: task.listenTimes,
            testTimes: task.testTimes,
            taskWords: [],
            taskArticles: []
        }
        for (let tw of task.taskWords) {
            copyTask.taskWords.push({
                word: tw.word,
                passed: tw.passed,
                wrongNum: tw.wrongNum,
                testWrongNum: setTestWrongNumZero ? 0 : tw.testWrongNum,
            })
        }
        for (let ta of task.taskArticles) {
            copyTask.taskArticles.push({
                id: ta.id,
                score: ta.score
            })
        }
        return copyTask
    }


    /**
     * 深拷贝Article数组
     * @param article
     * @returns {Array}
     */
    static copyArticleDeep(article) {
        return {
            id: article.id,
            articleUrl: article.articleUrl,
            optionUrl: article.optionUrl,
            answerUrl: article.answerUrl,
            analysisUrl: article.analysisUrl,
            name: article.name,
            note: article.note,
            type: article.type,
            startWordId: article.startWordId,
            endWordId: article.endWordId
        }
    }



    /**
     *  按顺序获取下一个状态
     * @param oldStatus
     * @returns {*}
     */
    static getNextStatus(oldStatus) {
        let status = oldStatus
        switch (oldStatus) {
            case Constant.STATUS_0:
                status = Constant.STATUS_1
                break
            case Constant.STATUS_1:
                status = Constant.STATUS_2
                break
            case Constant.STATUS_2:
                status = Constant.STATUS_4
                break
            case Constant.STATUS_4:
                status = Constant.STATUS_7
                break
            case Constant.STATUS_7:
                status = Constant.STATUS_15
                break
            case Constant.STATUS_15:
                status = Constant.STATUS_200
                break
            default:
                break;
        }
        return status
    }

    /**
     *  计算任务进度 0表示开始，100表示完成
     * @param task
     * @returns {number} 返回一个0-100的数字
     */
    static calculateProcess(task) {
        let num = 0
        if (task.status === Constant.STATUS_0) {  //新学任务
            switch (task.progress) {
                case Constant.IN_LEARN_PLAY:        //轮播10 point:
                    let p = Math.floor(10 / Constant.LEARN_PLAY_TIMES)
                    for (let i = Constant.LEARN_PLAY_TIMES; i >= 0; i--) {
                        if (task.leftTimes == i) {
                            num = p * (Constant.LEARN_PLAY_TIMES - i)
                            break;
                        }
                    }
                    break
                case Constant.IN_LEARN_CARD:        //卡片30 point
                    num = Math.floor((task.curIndex / task.wordCount) * 30) + 10
                    break
                case Constant.IN_LEARN_TEST_1:      //1测 30 point
                    num = Math.floor((task.curIndex / task.wordCount) * 30) + 40
                    break
                case Constant.IN_LEARN_RETEST_1:
                    num = 70
                    break
                case Constant.IN_LEARN_TEST_2:      //2测 25 point
                    num = Math.floor((task.curIndex / task.wordCount) * 25) + 70
                    break
                case Constant.IN_LEARN_RETEST_2:
                    num = 95
                    break
                case Constant.IN_LEARN_FINISH:    //完成
                    num = 100
                    break
                default:
                    break;
            }
        } else {                                       //复习任务
            switch (task.progress) {
                case Constant.IN_REVIEW_PLAY:        //轮播70 point:
                    const rplayTimes = store.getState().mine.configReviewPlayTimes
                    let p = Math.floor(70 / rplayTimes)
                    for (let i = rplayTimes; i >= 0; i--) {
                        if (task.leftTimes == i) {
                            num = p * (rplayTimes - i)
                            break;
                        }
                    }
                    break
                case Constant.IN_REVIEW_TEST:       //复习测试 25point
                    num = Math.floor((task.curIndex / task.wordCount) * 25) + 70
                    break
                case Constant.IN_REVIEW_RETEST:       //复习测试 25point
                    num = 95
                    break
                case Constant.IN_REVIEW_FINISH:    //复习完成
                    num = 100
                    break
                default:
                    break;
            }
        }
        return num;
    }


    /**
     *  生成Task的名词
     * @param taskOrder
     * @returns {string}
     */
    static genTaskName(taskOrder) {
        if (taskOrder === Constant.VIRTUAL_TASK_ORDER) {
            return '爱听词'
        }
        if (taskOrder) {
            let name = ''
            if (taskOrder < 10) {
                name = '00' + taskOrder
            } else if (taskOrder < 100) {
                name = '0' + taskOrder
            } else {
                name = '' + taskOrder
            }
            return 'List-' + name
        } else {
            return ''
        }

    }


    /**
     * @description 生成一个minNum到maxMum间的随机数 (含头含尾)
     * @memberof VocaUtil
     */
    static randomNum(minNum, maxNum) {
        if ((typeof minNum !== "number") || (typeof maxNum !== "number")) {
            throw new Error('参数类型错误，minNum, maxNum 应该是number')
        }
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    /**
     * 生成一个minNum到maxMum间的随机数数组 (不出现指定数)
     * @param {Number} minNum 
     * @param {Number} maxNum 
     * @param {Array} numArr 不包含的数
     * @param {Number} length 随机数组长度
     */
    static randomArr(minNum, maxNum, numArr, length) {
        //判断错误
        if ((typeof minNum !== "number") || (typeof maxNum !== "number") || (typeof numArr !== "object")) {
            throw new Error('参数类型错误，minNum, maxNum must be number, numArr must be object ')
        }
        let options = []
        for (let i = 0; i < length; i++) { //产生3个选项
            let option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            while (options.includes(option) || numArr.includes(option)) {
                option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            }
            options.push(option)
        }
        return options
    }



    static goPageWithoutStack(navigation, routeName, params = {}) {
        // 抹掉stack，跳转到指定路由
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName, params })
            ]
        });
        navigation.dispatch(resetAction);
    }

    static getNotPassedWords(words) {

        return words.filter((item, i) => {
            if (item.passed === true) {
                return false
            } else {
                return true
            }
        })
    }




    /**
     * pass VocaTask中的单词
     *      需要修改 1.状态中的task的taskWords  2.状态中的showWordInfos  3.realm数据中的pass
     * @returns {words,showInfos} 默认shouldFilter=false，返回 {words,showInfos}；当shouldFilter=false,返回pass的单词
     */
    static passWordInTask(passedWord, task, showWordInfos) {
        const { taskOrder, taskWords } = task
        const taskDao = VocaTaskDao.getInstance()
        let passedIndex = -1
        //1.修改task的taskWords
        console.log('----1.修改task中的pass---单词：' + passedWord)
        task.taskWords = taskWords.map((item, i) => {
            if (item.word === passedWord) {
                passedIndex = i
                return { ...item, passed: true }
            } else {
                return item
            }
        })

        //2.修改showWordInfos
        if (showWordInfos) {
            console.log('----2.修改showWordInfos的pass---')
            showWordInfos = showWordInfos.filter((item, i) => {
                if (item) {
                    if (item.word === passedWord) {
                        return false
                    } else {
                        return true
                    }
                }
            })
        }

        //3.修改realm数据库
        taskDao.modify(() => {
            console.log('----3.修改realm的pass-')
            const goalTask = taskDao.getTaskByOrder(taskOrder)
            goalTask.wordCount = task.wordCount
            for (let tWord of goalTask.taskWords) {
                if (tWord.word === passedWord) {
                    tWord.passed = true
                    break
                }
            }
        })


        return {
            passedIndex, //pass的单词下标
            task,
            showWordInfos,
        }
    }





    /** 
     * 构建一个虚拟Task 
     * words 是task的words
    */
    static genVirtualTask(words, playName, taskOrder = Constant.VIRTUAL_TASK_ORDER) {
        let copyTask = {
            taskOrder,
            playName,
            curIndex: 0,
            taskWords: [],
            listenTimes: 0,
            testTimes: 0
        }
        if (typeof words[0] === 'object') {
            for (let i in words) {
                copyTask.taskWords.push({
                    word: words[i].word,
                    passed: false,
                    wrongNum: words[i].wrongNum,
                    testWrongNum: 0,
                })
            }
        } else if (typeof words[0] === 'string') {
            for (let i in words) {
                copyTask.taskWords.push({
                    word: words[i],
                    passed: false,
                    wrongNum: 0,
                    testWrongNum: 0,
                })
            }
        }
        copyTask.wordCount = copyTask.taskWords.length
        return copyTask
    }


    /**
     * 传入单词任务，获取任务的文章ids
     * @param vocaTasks
     * @returns {string}
     */
    static getUserArticles(vocaTasks) {
        const myArticles = []
        for (let task of vocaTasks) {
            const artiles = JSON.parse(task.articles)
            for (let art of artiles) {
                myArticles.push(art)
            }
        }
        // console.log(myArticles)
        return myArticles
    }



    /**
     * 新学任务数据迁移至1复任务
     * @param newTask  新学任务
     * @returns
     * */
    static updateNewTaskToReviewTask(newTask) {
        let reviewTask = newTask
        for (let task of store.getState().home.tasks) {
            if (task.taskOrder === newTask.taskOrder && task.status === Constant.STATUS_1) {
                reviewTask = task
                break
            }
        }

        const taskWords = newTask.taskWords.map((w, i) => {
            return { ...w, testWrongNum: 0 }
        })
        return {
            ...reviewTask,
            listenTimes: newTask.listenTimes,
            testTimes: newTask.testTimes,
            taskWords: taskWords,
            taskArticles: newTask.taskArticles
        }
    }

    /**
     * 由VocaTask数组生成文章任务数组
     * @param {*} tasks 
     */
    static genArticleTasksByVocaTasks(tasks) {
        const artService = new ArticleService()
        let articleTasks = []
        for (let nTask of tasks) {
            const taskArticles = nTask.taskArticles.map((tArticle, _) => {
                tArticle.taskOrder = nTask.taskOrder
                return tArticle
            })
            articleTasks = articleTasks.concat(artService.getArticlesInfo(taskArticles))
        }
        return articleTasks
    }

    /**
     * 判断任务是否处于今日任务中
     */
    static isLearningInTodayTasks(taskOrder) {
        const todayTasks = store.getState().home.tasks.filter((item, i) => {
            return (item.taskType === Constant.TASK_VOCA_TYPE)
        })
        for (let task of todayTasks) {
            if (task.taskOrder === taskOrder && !task.progress.endsWith('FINISH')) {
                return true
            }
        }
        return false
    }

}




