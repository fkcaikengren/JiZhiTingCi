
import * as Constant from '../common/constant'
import _util from '../../../common/util'
import VocaUtil from '../common/vocaUtil'
import VocaTaskDao from "./VocaTaskDao";
import _ from 'lodash'
import * as CConstant from "../../../common/constant";
import { store } from '../../../redux/store'

/**
 *  Created by Jacy on 19/07/22.
    在dao层进行进一步的数据格式处理, 同时把数据完全拷贝出来

 */
export default class VocaTaskService {

    constructor() {
        this.vtd = VocaTaskDao.getInstance()
        this.vtd.open()
    }
    /**
     * 关闭数据库
     */
    closeRealm = () => {
        this.vtd.close()
    }


    /**
     * 获取今日任务：任务顺序，大原则按taskOrder递增，新学产生的1复任务放末尾
     *      注：判断是否出现中断学习, 中断>13天（8+5=13），则重学。中断<=13,模拟学习产生数据
     * @param storedTasks 单词任务数组。如果第一次，rawTasks应为null
     * @param taskCount 计划单词任务数量
     * @param lastLearnDate 上一次学习时间（timestap）
     * @param n 默认是0，表示今天。
     * @returns {*[]|*}
     */
    getTodayTasks = (storedTasks, taskCount, lastLearnDate, n = 0) => {
        let today = _util.getDayTime(n)
        if (storedTasks) { //若不是第一次获取今日任务
            const d = (today - lastLearnDate) / CConstant.DAY_MS
            console.log('------日期差：-------')
            console.log(d)
            if (d < 1) {
                //tasks未过时 (不会调用该函数， 如果调用该函数则应该抛出异常)
                throw new Error('getTodayTasks 错误: lastLearnDate 大于等于今日零点时间戳！')
            } else if (d === 1) {
            } else if (d > 1 && d <= 13) {
                //模拟学习: 从-d(即0-d) 到 -1 循环
                for (let j = (0 - d); j < -1; j++) {
                    console.log('循环j: ' + j)
                    //step1. 获取当天任务
                    const todayTasks = this.getTodayTasks(storedTasks, taskCount, _util.getDayTime(j), j + 1)
                    //step2.学习：不产生任何学习数据
                    //step3.计算、保存任务
                    storedTasks = VocaUtil.filterRawTasks(todayTasks)
                    if (storedTasks.length > 0) {
                        this.vtd.modifyTasks(storedTasks)
                    }
                    this.storeTasks(storedTasks)
                }
            } else if (d > 13) {
                //重学
                this.vtd.modify(() => {
                    const rtasks = this.vtd.getReviewedTasks()
                    for (let rt of rtasks) {
                        rt.status = Constant.STATUS_0
                        rt.delayDays = 0
                        rt.vocaTaskDate = 0
                        rt.progress = Constant.IN_LEARN_PLAY
                        rt.leftTimes = Constant.LEARN_PLAY_TIMES
                    }
                })
            }

            //0.生成今日新学任务
            // const copyStoredTasks = VocaUtil.copyTasks(storedTasks)
            //根据taskOrder从数据库中读
            const latestTasks = storedTasks.map((st, i) => {
                return this.vtd.getTaskByOrder(st.taskOrder)
            })
            let leftCount = 0
            this.vtd.modify(() => {
                leftCount = this.calculateTasks(latestTasks)
            })
            // this.vtd.modifyTasks(copyStoredTasks)
            if (leftCount <= 0 || d > 13) {           //如果不存在遗留任务,才生成新任务 (若d>13, 则重学)
                this.vtd.modify(() => {
                    let newTasks = this.vtd.getNotLearnedTasks()
                    if (newTasks.length > 0) {                    //如果还存在未学任务
                        for (let i = 0; (i < taskCount && i < newTasks.length); i++) {
                            newTasks[i].vocaTaskDate = _util.getDayTime(n) //今日零点
                        }
                    }
                })
            }

        }

        //1. 查询
        const tasks = this.vtd.getTodayTasks(n)
        console.log('----获取今日任务，长度：-----')
        console.log(tasks.length)
        let copyTasks = []
        let reviewTask = null
        let reviewTasks = []
        //2. 深拷贝
        for (let task of tasks) {
            let copyTask = VocaUtil.copyTaskDeep(task)
            copyTask.taskType = Constant.TASK_VOCA_TYPE  //标记为单词任务
            for (let copyWord of copyTask.words) {
                copyWord.testWrongNum = 0
            }
            copyTasks.push(copyTask)
            //生成1复任务
            if (copyTask.status === Constant.STATUS_0) {
                reviewTask = _.cloneDeep(copyTask);
                reviewTask.status = Constant.STATUS_1
                reviewTask.progress = Constant.IN_REVIEW_PLAY
                reviewTask.leftTimes = store.getState().mine.configReviewPlayTimes
                reviewTasks.push(reviewTask)
            }

        }
        //3.顺序调整: 新学放开头，新学生成的1复放末尾
        let newTasks = [], otherTasks = []
        for (let t of copyTasks) {
            if (t.status === Constant.STATUS_0) {
                newTasks.push(t)
            } else {
                otherTasks.push(t)
            }
        }
        let sortedTasks = newTasks.concat(otherTasks).concat(reviewTasks)
        return sortedTasks

    }


    /**
     *  计算存储Tasks
     * @param storedTasks
     */
    storeTasks = (storedTasks) => {
        const copyStoredTasks = VocaUtil.copyTasks(storedTasks)
        this.calculateTasks(copyStoredTasks)
    }


    /**
     *  计算任务（改变任务的学习日期）
     * @param storedTasks 参与计算的单词任务（不包括1复）
     * @returns {number} 返回没有完成的任务数量
     */
    calculateTasks = (storedTasks) => {
        console.log('-----------calculateTasks ---before-----------')
        console.log(storedTasks)
        let leftCount = 0
        for (let storedTask of storedTasks) {
            if (storedTask.progress.startsWith('IN_LEARN') && storedTask.progress !== Constant.IN_LEARN_FINISH) {      //新学未完成
                storedTask.status = Constant.STATUS_0
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
                            storedTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_2:
                        if (storedTask.delayDays < Constant.DELAY_DAYS_2) {
                            storedTask.delayDays += 1
                            leftCount++
                        } else {//重学
                            storedTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_4:
                        if (storedTask.delayDays < Constant.DELAY_DAYS_4) {
                            storedTask.delayDays += 1
                            leftCount++
                        } else {//重学
                            storedTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_7:
                        if (storedTask.delayDays < Constant.DELAY_DAYS_7) {
                            storedTask.delayDays += 1
                            leftCount++
                        } else {//重学
                            storedTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_15:
                        if (storedTask.delayDays < Constant.DELAY_DAYS_15) {
                            storedTask.delayDays += 1
                            leftCount++
                        } else {//重学
                            storedTask.status = Constant.STATUS_0
                        }
                        break
                    default:
                        break;
                }
                console.log('未完成复习')
            }

            storedTask.curIndex = 0
            if (storedTask.status === Constant.STATUS_0) { //重学 or 新学
                storedTask.delayDays = 0
                storedTask.vocaTaskDate = 0
                storedTask.progress = Constant.IN_LEARN_PLAY
                storedTask.leftTimes = Constant.LEARN_PLAY_TIMES
            } else if (storedTask.status == Constant.STATUS_200) { //完成
                storedTask.progress = Constant.IN_REVIEW_FINISH
                storedTask.leftTimes = 0
            } else {
                storedTask.progress = Constant.IN_REVIEW_PLAY
                storedTask.leftTimes = store.getState().mine.configReviewPlayTimes
            }
        }
        console.log('-----------calculateTasks ---after-----------')
        console.log(storedTasks)
        return leftCount
    }




    /**
     *  获取错误单词列表
     * @returns {Array}
     */
    getWrongList = () => {
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
                        content: w,
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
    getPassList = () => {
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
                const words = task.words
                // console.log(words)
                for (let i in words) {
                    if (words[i].passed) {
                        count++
                        passArr.push({
                            isHeader: false,
                            checked: false,
                            content: words[i],
                        })
                        if (!hasPassedWord) {
                            hasPassedWord = true
                        }
                    }
                }
                header.title = `List-${VocaUtil.genTaskName(task.taskOrder)}, 共${count}词`
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
    getLearnedList = () => {
        const learnedArr = []
        try {
            const tasks = this.vtd.getLearnedTasks()
            for (let task of tasks) { //遍历任务
                const words = task.words
                const header = {
                    isHeader: true,
                    checked: false,
                    title: `List-${VocaUtil.genTaskName(task.taskOrder)}, 共${words.length}词`
                }
                learnedArr.push(header)

                for (let i in words) {
                    learnedArr.push({
                        isHeader: false,
                        checked: false,
                        content: words[i],
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
    getNewList = () => {
        const newArr = []
        try {
            const tasks = this.vtd.getNotLearnedTasks()
            for (let task of tasks) { //遍历任务
                const words = task.words
                const header = {
                    isHeader: true,
                    checked: false,
                    title: `${VocaUtil.genTaskName(task.taskOrder)}, 共${words.length}词`
                }
                newArr.push(header)

                for (let i in words) {
                    newArr.push({
                        isHeader: false,
                        checked: false,
                        content: words[i],
                    })
                }
            }
        } catch (e) {
            console.log(e)
            console.log('获取未学单词列表失败')
        }

        return newArr
    }


    /**
     *  统计剩余天数
     */
    countLeftDays = () => {
        let leftDays = 0
        const notLearnTasks = this.vtd.getNotLearnedTasks()
        if (notLearnTasks.length > 0) {
            leftDays = notLearnTasks.length + Constant.LEFT_PLUS_DAYS
        } else {
            // 后期剩余天数
        }
        return leftDays
    }

    /**
     *  统计已学单词数
     * @returns {number}
     */
    countLearnedWords = () => {
        const learnedTasks = this.vtd.getLearnedTasks()
        let sum = 0
        for (let task of learnedTasks) {
            sum += task.words.length
        }
        return sum
    }
}