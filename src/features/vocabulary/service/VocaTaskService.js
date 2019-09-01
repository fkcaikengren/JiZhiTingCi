

import * as Constant from '../common/constant'
import _util from '../../../common/util'
import VocaUtil from '../common/vocaUtil'
import VocaTaskDao from "./VocaTaskDao";
import _ from 'lodash'

/**
 *  Created by Jacy on 19/07/22.
    在dao层进行进一步的数据格式处理, 同时把数据完全拷贝出来

 */
export default class VocaTaskService {

    constructor(){
        this.vtd =  VocaTaskDao.getInstance()
        this.vtd.open()
    }
    /**
     * 关闭数据库
     */
    closeRealm = ()=>{
        this.vtd.close()
    }

    /**
     * 保存任务数据
     * @param tasks
     */
    saveVocaTasks(tasks){
        this.vtd.saveVocaTasks(tasks)
    }


    /**
     * 获取今日任务：任务顺序，大原则按taskOrder递增，新学产生的1复任务放末尾
     *      目的：保证任务进度快慢是按照taskOrder递增顺序的
     *     今日任务：新学任务，1复，其他复习任务
     * @returns {any[]}
     */
    getTodayTasks = (oldTasks, n)=>{
        //判断oldTasks 是否过时
        let today = _util.getDayTime(0)
        if(oldTasks && oldTasks[0] && oldTasks[0].vocaTaskDate === today){ //数据未过时
            return oldTasks
        }else{                                 //数据过时，从数据库重新加载
            //1. 查询
            const tasks = this.vtd.getTodayTasks(n)
            let copyTasks = []
            let reviewTask = null
            let reviewTasks = []
            //2. 深拷贝
            for(let task of tasks){
                let copyTask = VocaUtil.copyTask(task)
                copyTasks.push(copyTask)
                //生成1复任务
                if(copyTask.status === Constant.STATUS_0){
                    reviewTask = _.cloneDeep(copyTask);
                    reviewTask.status = Constant.STATUS_1
                    reviewTask.process = Constant.IN_REVIEW_PLAY
                    reviewTask.leftTimes = Constant.REVIEW_PLAY_TIMES
                    reviewTasks.push(reviewTask)
                }

            }

            //3.顺序调整: 新学放开头，新学生成的1复放末尾
            let newTasks = [], otherTasks = []
            for(let t of copyTasks){
                if(t.status === Constant.STATUS_0){
                    newTasks.push(t)
                }else{
                    otherTasks.push(t)
                }
            }
            let sortedTasks = newTasks.concat(otherTasks).concat(reviewTasks)
            return sortedTasks
        }
    }


    /**
     *  筛选出需要存储的任务实体
     * @param rawTasks 原始的任务
     * @returns {*}
     */
    filterTasks = (rawTasks)=>{
        let isFirst = false
        let oldTasks = rawTasks.filter((task, index)=>{
            if(task.status === Constant.STATUS_0 ){     //新学任务
                if(task.process !== Constant.IN_LEARN_FINISH){
                    isFirst = true
                    return true
                }else{
                    return false
                }
            }else{                                      //复习任务
                if(task.status === Constant.STATUS_1  && isFirst){
                    return false
                }else{
                    return true
                }
            }


        })
        return oldTasks
    }


    /**
     * 存储昨日的任务,计算今日的任务
     *      场景：新的一天调用这个函数
     * @param rawTasks 原始任务
     * @param taskCount 计划中的每日任务数量
     * @param nth 第nth天，默认为0，表示今天零点的时间戳（方便模拟测试）
     */
    calculateTasks = (rawTasks, taskCount, nth=0)=>{

        //1. 筛选出需存储的任务
        let oldTasks = this.filterTasks(rawTasks)
        let leftCount = 0
        for(let oldTask of oldTasks){
            if(oldTask.process.startsWith('IN_LEARN') && oldTask.process !== Constant.IN_LEARN_FINISH){      //新学未完成
                oldTask.status = Constant.STATUS_0
                // console.log('未完成新学')
            }else if(oldTask.process === Constant.IN_REVIEW_FINISH ){    //完成复习
                switch(oldTask.status){
                    case Constant.STATUS_1:
                        oldTask.vocaTaskDate += _util.getDaysMS(1)
                        break
                    case Constant.STATUS_2:
                        oldTask.vocaTaskDate += _util.getDaysMS(2)
                        break
                    case Constant.STATUS_4:
                        oldTask.vocaTaskDate += _util.getDaysMS(3)
                        break
                    case Constant.STATUS_7:
                        oldTask.vocaTaskDate += _util.getDaysMS(8)
                        break
                    default:
                        break;
                }
                oldTask.status = VocaUtil.getNextStatus(oldTask.status)
                oldTask.delayDays = 0
                // console.log('完成复习')
            } else if(oldTask.process.startsWith('IN_REVIEW')){         //未完成复习
                oldTask.vocaTaskDate += _util.getDaysMS(1)
                switch(oldTask.status){
                    case Constant.STATUS_1:
                        if(oldTask.delayDays < Constant.DELAY_DAYS_1){
                            oldTask.delayDays += 1
                            leftCount++
                        }else{//重学
                            oldTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_2:
                        if(oldTask.delayDays < Constant.DELAY_DAYS_2){
                            oldTask.delayDays += 1
                            leftCount++
                        }else{//重学
                            oldTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_4:
                        if(oldTask.delayDays < Constant.DELAY_DAYS_4){
                            oldTask.delayDays += 1
                            leftCount++
                        }else{//重学
                            oldTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_7:
                        if(oldTask.delayDays < Constant.DELAY_DAYS_7){
                            oldTask.delayDays += 1
                            leftCount++
                        }else{//重学
                            oldTask.status = Constant.STATUS_0
                        }
                        break
                    case Constant.STATUS_15:
                        if(oldTask.delayDays < Constant.DELAY_DAYS_15){
                            oldTask.delayDays += 1
                            leftCount++
                        }else{//重学
                            oldTask.status = Constant.STATUS_0
                        }
                        break
                    default:
                        break;
                }
                // console.log('未完成复习')
            }

            oldTask.curIndex = 0
            if(oldTask.status == Constant.STATUS_0){ //重学 or 新学
                oldTask.delayDays = 0
                oldTask.vocaTaskDate = 0
                oldTask.process = Constant.IN_LEARN_PLAY
                oldTask.leftTimes = Constant.LEARN_PLAY_TIMES

            }else if(oldTask.status == Constant.STATUS_200){ //完成
                oldTask.process = Constant.IN_REVIEW_FINISH
                oldTask.leftTimes = 0
            }else{
                oldTask.process = Constant.IN_REVIEW_PLAY
                oldTask.leftTimes = Constant.REVIEW_PLAY_TIMES
            }

        }


        //2. 更新旧任务
        this.vtd.modifyTasks(oldTasks)

        //3. 产生新学任务
        if(leftCount<=0){     //如果不存在遗留任务,才生成新任务
            //获取 status==0 的tasks[i]
            this.vtd.modify(()=>{
                let newTasks = this.vtd.getNotLearnedTasks()
                if(newTasks.length > 0){                    //如果还存在未学任务
                    for(let i=0; (i<taskCount && i<newTasks.length); i++){
                        newTasks[i].vocaTaskDate =  _util.getDayTime(nth) //今日零点
                    }
                }
            })
        }
    }


    /**
     *  获取错误单词列表
     * @returns {Array}
     */
    getWrongList = ()=>{
        const wrongArr = []
        try{
            for(let i=6; i>=1; i--){
                //查询
                let words = i===6?this.vtd.getWordsGEWrongNum(i) :this.vtd.getWordsEqWrongNum(i)
                wrongArr.push({
                    isHeader: true,
                    checked:false,
                    title: i===6?`答错超过5次, 共${words.length}词`:`答错${i}次, 共${words.length}词`
                })
                for(let w of words){
                    wrongArr.push({
                        isHeader: false,
                        checked:false,
                        content: w,
                    })
                }
            }

        }catch (e) {
            console.log(e)
            console.log('获取错词列表失败')
        }

        return wrongArr
    }

    /**
     *  获取PASS列表单词
     * @returns {Array}
     */
    getPassList = () =>{
        const passArr = []
        try{
            //查询
            const tasks = this.vtd.getLearnedTasks()
            // console.log(tasks)
            for(let task of tasks){ //遍历任务
                let hasPassedWord = false
                let count = 0
                const header = {
                    isHeader: true,
                    checked:false,
                    title: ''
                }
                passArr.push(header)
                const words = task.words
                console.log(words)
                for(let i in words){
                    if(words[i].passed){
                        count++
                        passArr.push({
                            isHeader: false,
                            checked:false,
                            content: words[i],
                        })
                        if(!hasPassedWord){
                            hasPassedWord = true
                        }
                    }
                }
                header.title = `List-${VocaUtil.genTaskName(task.taskOrder)}, 共${count}词`
                //任务中没有passed 单词
                if(!hasPassedWord){
                    passArr.pop()
                }
            }

        }catch (e) {
            console.log(e)
            console.log('获取PASS列表失败')
        }

        return passArr
    }


    /**
     *  获取已学单词列表
     * @returns {Array}
     */
    getLearnedList = ()=>{
        const learnedArr = []
        try{
            const tasks = this.vtd.getLearnedTasks()
            for(let task of tasks) { //遍历任务
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
        }catch (e) {
            console.log(e)
            console.log('获取已学单词列表失败')
        }

        return learnedArr
    }


    /**
     *  获取未学单词列表
     * @returns {Array}
     */
    getNewList = ()=>{
        const newArr = []
        try{
            const tasks = this.vtd.getNotLearnedTasks()
            for(let task of tasks) { //遍历任务
                const words = task.words
                const header = {
                    isHeader: true,
                    checked: false,
                    title: `List-${VocaUtil.genTaskName(task.taskOrder)}, 共${words.length}词`
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
        }catch (e) {
            console.log(e)
            console.log('获取未学单词列表失败')
        }

        return newArr
    }

}