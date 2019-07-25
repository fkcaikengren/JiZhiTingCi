

import * as Constant from '../common/constant'
import VocaTaskDao from "./VocaTaskDao";
import _ from 'lodash'

/**
 *  Created by Jacy on 19/07/22.
    在dao层进行进一步的数据格式处理, 同时把数据完全拷贝出来

 */
export default class VocaTaskService {

    constructor(){
        this.vtd =  new VocaTaskDao()
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
     * 获取今日任务：生成home页的任务列表
     *     今日任务：新学任务，1复，其他复习任务
     * @returns {any[]}
     */
    getTodayTasks = (oldTasks)=>{
        //判断oldTasks 是否过时
        let today = new Date(new Date().toLocaleDateString()).getTime()
        if(oldTasks && oldTasks[0] && oldTasks[0].vocaTaskDate === today){ //数据未过时
            return oldTasks
        }else{                                 //数据过时，从数据库重新加载
            const tasks = this.vtd.getTodayTasks()
            let copyTasks = []
            let reviewTask = null
            for(let task of tasks){
                //深拷贝一份
                let copyTask = {
                    taskOrder: task.taskOrder,                      //任务序号
                    status: task.status,                 
                    vocaTaskDate: task.vocaTaskDate,                                            
                    process: task.process, 
                    curIndex:task.curIndex,
                    letfTimes:task.letfTimes, //默认是新学阶段，3遍轮播
                    delayDays:task.delayDays,
                    dataCompleted:task.dataCompleted,
                    createTime:task.createTime,
                    isSync: task.isSync,
                    words: []
                }
                let ws = task.words
                for(let i in ws){
                    copyTask.words.push({
                        word: ws[i].word,
                        passed: ws[i].passed,
                        wrongNum: ws[i].wrongNum,
                        testWrongNum: ws[i].testWrongNum,
                        enPhonetic: ws[i].enPhonetic,
                        enPronUrl: ws[i].enPronUrl,
                        amPhonetic: ws[i].amPhonetic,
                        amPronUrl: ws[i].amPronUrl,
                        def: ws[i].def,
                        sentence: ws[i].sentence,
                        tran: ws[i].tran
                    })
                }
                copyTasks.push(copyTask)
                //生成1复任务
                if(copyTask.status === Constant.STATUS_0){
                    reviewTask = _.cloneDeep(copyTask);
                    reviewTask.status = Constant.STATUS_1
                    reviewTask.process = Constant.IN_REVIEW_PLAY
                    reviewTask.letfTimes = Constant.REVIEW_PLAY_TIMES
                }
            }
            if(reviewTask){                          //如果存在新学任务
                copyTasks.push(reviewTask)
            }
            return copyTasks
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
     *  根据昨日的任务,计算今日的任务
     *      新的一天调用这个函数
     * @param tasks
     */
    calculateTasks = (rawTasks, taskCount)=>{
        //1. 筛选出需存储的任务
        let oldTasks = this.filterTasks(rawTasks)
        let tasksFinished = true
        for(let oldTask of oldTasks){
            if(oldTask.process.startsWith('IN_LEARN')){                 //新学未完成
                oldTask.status = Constant.STATUS_0
                oldTask.delayDays = 0
                oldTask.vocaTaskDate += 1*Constant.DAY_MS
                tasksFinished = false
            }else if(oldTask.process === Constant.IN_REVIEW_FINISH ){    //完成复习
                switch(oldTask.status){
                    case Constant.STATUS_1:
                        oldTask.vocaTaskDate += 1*Constant.DAY_MS
                        break
                    case Constant.STATUS_2:
                        oldTask.vocaTaskDate += 2*Constant.DAY_MS
                        break
                    case Constant.STATUS_4:
                        oldTask.vocaTaskDate += 3*Constant.DAY_MS
                        break
                    case Constant.STATUS_7:
                        oldTask.vocaTaskDate += 8*Constant.DAY_MS
                        break
                    default:
                        break;
                }
                oldTask.status = this.getNextStatus(oldTask.status)
                oldTasks.delayDays = 0
                tasksFinished = false
            } else if(oldTask.process.startsWith('IN_REVIEW')){         //未完成复习

                switch(oldTask.status){
                    case Constant.STATUS_1:
                        if(oldTasks.delayDays < Constant.DELAY_DAYS_1){
                            oldTask.delayDays += 1
                        }else{
                            oldTask.status = Constant.STATUS_0
                            oldTask.delayDays = 0
                        }
                        break
                    case Constant.STATUS_2:
                        if(oldTasks.delayDays < Constant.DELAY_DAYS_2){
                            oldTask.delayDays += 1
                        }else{
                            oldTask.status = Constant.STATUS_0
                            oldTask.delayDays = 0
                        }
                        break
                    case Constant.STATUS_4:
                        if(oldTasks.delayDays < Constant.DELAY_DAYS_4){
                            oldTask.delayDays += 1
                        }else{
                            oldTask.status = Constant.STATUS_0
                            oldTask.delayDays = 0
                        }
                        break
                    case Constant.STATUS_7:
                        if(oldTasks.delayDays < Constant.DELAY_DAYS_7){
                            oldTask.delayDays += 1
                        }else{
                            oldTask.status = Constant.STATUS_0
                            oldTask.delayDays = 0
                        }
                        break
                    case Constant.STATUS_15:
                        if(oldTasks.delayDays < Constant.DELAY_DAYS_15){
                            oldTask.delayDays += 1
                        }else{
                            oldTask.status = Constant.STATUS_0
                            oldTask.delayDays = 0
                        }
                        break
                    default:
                        break;
                }
                oldTask.vocaTaskDate += 1*Constant.DAY_MS
            }
        }
        //2. 更新旧任务
        this.vtd.modifyTasks(oldTasks)

        //3. 产生新学任务
        if(tasksFinished){     //如果任务全部完成,才生成新任务
            //获取 status==0 的tasks[i]
            this.vtd.modify(()=>{
                let newTasks = this.vtd.getNotLearnedTasks()
                for(let i=0; i<taskCount; i++){
                    newTasks[i].vocaTaskDate = new Date(new Date().toLocaleDateString()).getTime() //今日
                }
            })
        }
    }


    /**
     * 获取下一个状态
     * @param oldStatus
     * @returns {*}
     */
    getNextStatus(oldStatus){
        let status = oldStatus
        switch(oldStatus){
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


}