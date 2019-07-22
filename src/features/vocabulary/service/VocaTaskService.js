
import * as VConstant from '../common/VConstant'

/**
 *  Created by Jacy on 19/07/22.
    在dao层进行进一步的数据格式处理, 同时把数据从realm中分离处理（使不相关）
 */
export default class VocaTaskService {
    //成员变量
    vt =  new VocaTaskDao()


    /**获取今日任务：生成home页的任务列表 */
    getTodayTasks = ()=>{
        const tasks = vt.getTodayTasks()
        let newTask = tasks.filter((task, index)=>{
            return task.status === VConstant.STATUS_0
        })
        //把新学列表改成1复
        newTask[0].status = VConstant.STATUS_1
        newTask[0].process = VConstant.IN_REVIEW_PLAY
        newTask[0].letfTimes = VConstant.REVIEW_PLAY_TIMES
        return [...tasks, newTask[0]] 
    }


    /** 修改任务数据 */
    modifyTodayTasks = (tasks)=>{

    }

    /** 生成出第二天任务：修改realm的任务数据 */
    genNextDayTasks = ()=>{

    }


    /** */
}