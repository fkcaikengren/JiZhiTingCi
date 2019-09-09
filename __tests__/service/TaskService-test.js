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
import _util from "../../src/common/util";
import VocaTaskDao from "../../src/features/vocabulary/service/VocaTaskDao";
const fs = require("fs");


let myhttp = createHttp()
VocaTaskDao.getInstance().open()
let vts = new VocaTaskService()
let taskCount = 15
let oldTasks = [{
    taskOrder: 1,
    status: 0,
    vocaTaskDate: 1569999000000,
    process: 'IN_LEARN_PLAY',
    curIndex: 0,
    leftTimes: 3,
    delayDays: 0,
    dataCompleted: false,
    createTime: null,
    isSync: true,
    words:[],
    wordCount:15
}]

beforeEach(async ()=>{
})

afterEach(()=>{
    vts.closeRealm()
})

it('测试时间工具', ()=>{
    console.log(_util.getDayTime(0))
})

it('获取全部书籍信息',async ()=>{
    const res = await myhttp.get('/vocaBook/getAll')
    console.log(res.data.data)
}, 10000)

it('提交计划, tasks存入realm',async ()=>{
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_114'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks, 6)
}, 60000)


it('getTodayTasks：获取今日任务并修改words', ()=>{
    let todayTasks = vts.getTodayTasks(null)
    console.log(todayTasks)
    //修改words可以自动更新
    for(let t of todayTasks){
        // for(let w of t.words){
        //     vts.vtd.modify(()=>{
        //         w.passed = true
        //     })
        // }
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



/****************模拟学习**********************/

it('正常学习', async ()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '15',
        bookCode: 'VB_76'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks)
    //开始测试--------------------------------
    let n = 10000;      //表示无穷大
    let todayTasks = []
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务
        if(i > 0){
            vts.calculateTasks(todayTasks, taskCount, i)
        }
        //step2.加载今日任务
        todayTasks = vts.getTodayTasks(null,i)
        if(todayTasks.length<=0){
            //计划结束
            vts.calculateTasks(todayTasks, taskCount, i)
            break;
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./normal_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //完成任务
        for(let t of todayTasks ){
            if(t.status === Constant.STATUS_0){
                t.process = Constant.IN_LEARN_FINISH
                t.curIndex = 15
            }else{
                t.process = Constant.IN_REVIEW_FINISH
                t.curIndex = 15
            }
        }
    }

})

/**
 * 测试用例：
 *  x=1 y=5
 *  x=2 y=15
 *  x=2 y=1000
 *  x=15 y=1000
 *  x=60 y=1000
 *  x=15, y=16
 *  x=60, y=61
 *  x=139, y=140
 *  x=139, y=10000
 *  x=265, y=266
 *  x=265, y=10000
 */
/**
 * 同时需要测试中间状态
 */
it('偷懒学习1, 第x天开始不完成新学，从第y天开始全部完成', async()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '15',
        bookCode: 'VB_76'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks)
    //开始测试--------------------------------
    let n = 30; //表示无穷大
    let todayTasks = []
    let x = 20
    let y = 1000
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务
        if(i > 0){
            vts.calculateTasks(todayTasks, taskCount, i)
        }
        //step2.加载今日任务
        todayTasks = vts.getTodayTasks(null,i)
        if(todayTasks.length <= 0){
            //计划结束
            vts.calculateTasks(todayTasks, taskCount, i)
            break;
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},process:${t.process},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //学习过程
        if(i+1 >= x && i+1 < y){  //偷懒
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_TEST_1  //可取IN_LEARN_CARD、IN_LEARN_TEST_2...
                    t.curIndex = 10
                }
            } //新学未完成，后面是锁的，故不可学
        }else{                  //全部完成
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else{
                    t.process = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }
        if(i === n-1){
            //结束前计算一次
            vts.calculateTasks(todayTasks, taskCount, i)
        }
    }

})


/**
 *  假设review 的状态码是Constant.STATUS_1
 * 测试用例：
 *  x=1 y=5
 *  x=2 y=15
 *  x=2 y=1000
 *  x=15, y=1000
 *  x=60, y=1000
 *  x=15, y=16
 *  x=60, y=61
 *  x=139, y=140
 *  x=139, y=10000
 *  x=265, y=266
 *  x=265, y=10000
 */
it('偷懒学习2, 第x天开始不完成 1复，从第y天开始全部完成', async()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '15',
        bookCode: 'VB_76'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks)
    //开始测试--------------------------------
    let n = 1000; //表示无穷大
    let todayTasks = []
    let x = 30
    let y = 60
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务
        if(i > 0){
            vts.calculateTasks(todayTasks, taskCount, i)
        }
        //step2.加载今日任务
        todayTasks = vts.getTodayTasks(null,i)
        if(todayTasks.length <= 0){
            //计划结束
            vts.calculateTasks(todayTasks, taskCount, i)
            break;
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });

        //学习过程
        if(i+1 >= x && i+1 < y){  //偷懒时间段
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else if(t.status === Constant.STATUS_1){       //1复不完成
                    t.process = Constant.IN_REVIEW_TEST
                    t.curIndex = 10
                }else{
                    t.process = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }

            }
        }else{
            for(let t of todayTasks ){
                //全部完成
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else{
                    t.process = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }
    }

})



/**
 *  假设review 的状态码是Constant.STATUS_2
 * 测试用例：
 *  x=1 y=5
 *  x=2 y=15
 *  x=2 y=1000
 *  x=15, y=1000
 *  x=60, y=1000
 *  x=15, y=16
 *  x=60, y=61
 *  x=139, y=140
 *  x=139, y=10000
 *  x=265, y=266
 *  x=265, y=10000
 */
it('偷懒学习3, 第x天开始不完成复习的第二项任务，从第y天开始全部完成', async()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '15',
        bookCode: 'VB_76'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.saveVocaTasks(tasks)
    //开始测试--------------------------------
    let n = 10000; //表示无穷大
    let todayTasks = []
    let x = 60
    let y = 90
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务
        if(i > 0){
            vts.calculateTasks(todayTasks, taskCount, i)
        }
        //step2.加载今日任务
        todayTasks = vts.getTodayTasks(null,i)
        if(todayTasks.length <= 0){
            //计划结束
            vts.calculateTasks(todayTasks, taskCount, i)
            break;
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });

        //学习过程
        let j = 0
        if(i+1 >= x && i+1 < y){  //偷懒时间段
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                } else{
                    if(j == 0){     //复习第一项任务完成
                        t.process = Constant.IN_REVIEW_FINISH
                        t.curIndex = 14
                    }else{
                        t.process = Constant.IN_REVIEW_TEST         //其他复习完不成
                        t.curIndex = 14
                    }
                    j++

                }

            }
        }else{
            for(let t of todayTasks ){
                //全部完成
                if(t.status === Constant.STATUS_0){
                    t.process = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else{
                    t.process = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }
    }

})




it('获取错误单词列表', ()=>{
    console.log(vts.getWrongList())
})

it('获取PASS单词列表', ()=>{
    console.log(vts.getPassList())
})

it('获取已学单词列表', ()=>{
    console.log(vts.getLearnedList())
})

it('获取未学单词列表', ()=>{
    console.log(vts.getNewList())
})