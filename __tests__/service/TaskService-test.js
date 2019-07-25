/**
 * 总结：
 *  1. object('').filtered('')得到的Realm.Results 可以迭代，支持for of语法
 *  2. 查询的关联对象Realm.List 在jest测试中不可迭代，支持for of。
 *  3. 注意：...展开一个RealmObject并不会真正展开
 */

import 'react-native'
import {createHttp} from "../../src/common/http";
import * as Constant from '../../src/features/vocabulary/common/constant'
import VocaTaskService from "../../src/features/vocabulary/service/VocaTaskService";


let myhttp = createHttp()
let vts = new VocaTaskService()

let oldTasks = [{
    taskOrder: 1,
    status: 0,
    vocaTaskDate: 1569999000000,
    process: 'IN_LEARN_PLAY',
    curIndex: 0,
    letfTimes: 3,
    delayDays: 0,
    dataCompleted: false,
    createTime: null,
    isSync: true,
    words:[]
}]

beforeEach(async ()=>{
})

afterEach(()=>{
    vts.closeRealm()
})

it('获取全部书籍信息',async ()=>{
    const res = await myhttp.get('/vocaBook/getAll')
    console.log(res.data.data)
}, 10000)

it('提交计划, tasks存入realm',async ()=>{
    let params = {
        taskCount: '1',
        taskWordCount: '15',
        bookCode: 'VB_76'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks)
}, 20000)


it('getTodayTasks：获取今日任务', ()=>{
    let todayTasks = vts.getTodayTasks(oldTasks)
    for(let t of todayTasks){
        console.log(t)
    }
})
it('filterTasks: 过滤得到新学', ()=>{
    let todayTasks = vts.getTodayTasks(oldTasks)
    for(let t of todayTasks){
        t.process = Constant.IN_LEARN_RETEST_2
    }
    console.log(vts.filterTasks(todayTasks))
})

it('filterTasks: 过滤得 1复', ()=>{
    let todayTasks = vts.getTodayTasks(oldTasks)
    for(let t of todayTasks){
        if(t.status === Constant.STATUS_0){
            t.process = Constant.IN_LEARN_FINISH
        }
    }
    console.log(vts.filterTasks(todayTasks))
})

it('getNextStatus：获取下一个status', ()=>{

    for(let i of [0, 1,2,4,7, 15, 200]){
        console.log(vts.getNextStatus(i))
    }

})

/***************模拟学习过程**********************/
it('正常学习n天后', ()=>{
    let n = 2;
    let taskCount = 1
    //加载今日任务
    let todayTasks = vts.getTodayTasks(null)
    //完成任务
    for(let t of todayTasks ){
        if(t.status === Constant.STATUS_0){
            t.process = Constant.IN_LEARN_FINISH
        }else{
            t.process = Constant.IN_REVIEW_FINISH
        }
    }
    //更新保存任务
    vts.calculateTasks(todayTasks, taskCount)
    //计算新任务

})
