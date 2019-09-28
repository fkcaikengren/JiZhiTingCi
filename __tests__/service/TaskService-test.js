/**
 * 总结：
 *  1. object('').filtered('')得到的Realm.Results 可以迭代，支持for of语法
 *  2. 查询的关联对象Realm.List 在jest测试中不可迭代，支持for of。
 *  3. 注意：...展开一个RealmObject并不会真正展开
 */

import 'react-native'
import {createHttp} from "../../src/common/http";
import * as Constant from '../../src/features/vocabulary/common/constant'
import * as CConstant from '../../src/common/constant'
import VocaTaskService from "../../src/features/vocabulary/service/VocaTaskService";
import _util from "../../src/common/util";
import VocaTaskDao from "../../src/features/vocabulary/service/VocaTaskDao";
const fs = require("fs");


let myhttp = createHttp()
VocaTaskDao.getInstance().open()
let vts = new VocaTaskService()
let taskCount = 1
let oldTasks = [{
    taskOrder: 1,
    status: 0,
    vocaTaskDate: 1569254400000,
    process: 'IN_LEARN_PLAY',
    curIndex: 0,
    leftTimes: 3,
    delayDays: 0,
    dataCompleted: false,
    createTime: null,
    isSync: true,
    isSyncLocal: true,
    words:[],
    wordCount:15
}]

beforeEach(async ()=>{
})

afterEach(()=>{
    vts.closeRealm()
})

it('测试时间工具', ()=>{
    console.log(_util.getDayTime(-50))
})

it('测试时间差', ()=>{
    // const d = _util.getDayTime(2) - _util.getDayTime(1)
    const d = _util.getDayTime(0) - _util.getDayTime(-5)
    // const d = _util.getDayTime(2) - _util.getDayTime(1)
    console.log(d/CConstant.DAY_MS)
})

it('获取全部书籍信息',async ()=>{
    const res = await myhttp.get('/vocaBook/getAll')
    console.log(res.data.data)
}, 10000)

it('提交计划, tasks存入realm',async ()=>{
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    //任务存入realm
    vts.vtd.saveVocaTasks(tasks, 6)
}, 60000)


it('getTodayTasks：获取今日任务并修改words', ()=>{
    let todayTasks = vts.getTodayTasks(null, taskCount)
    console.log(todayTasks)
    //修改words可以自动更新
    for(let t of todayTasks){
        for(let w of t.words){
            vts.vtd.modify(()=>{
                w.passed = true
            })
        }
        console.log(t)
    }
})


it('filterTasks: 过滤得到新学', ()=>{
    let todayTasks = vts.getTodayTasks(null,taskCount)
    for(let t of todayTasks){
        t.process = Constant.IN_LEARN_RETEST_2
    }
    console.log(todayTasks)
    console.log(vts.filterTasks(todayTasks))
})


it('getNextStatus：获取下一个status', ()=>{

    for(let i of [0, 1,2,4,7, 15, 200]){
        console.log(vts.getNextStatus(i))
    }

})

it('calculateTasks: 计算任务', ()=>{
    let todayTasks = vts.getTodayTasks(null,taskCount)
    for(let t of todayTasks){
        if(t.status === Constant.STATUS_0){
            t.progress = Constant.IN_REVIEW_FINISH
        }
    }
    console.log('-------------before calculate--------------------')
    console.log(todayTasks)
    vts.calculateTasks(todayTasks)
    console.log('-------------after calculate--------------------')
    console.log(todayTasks)
})

it('storeTasks: 保存今日任务', ()=>{
    let todayTasks = vts.getTodayTasks(null,taskCount,0)
    for(let t of todayTasks){
        if(t.status === Constant.STATUS_0){
            t.progress = Constant.IN_LEARN_FINISH
            t.isSyncLocal = false
        }
    }

    vts.storeTasks(todayTasks)
    console.log(todayTasks)
})

/****************模拟学习**********************/

it('正常学习', async ()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    vts.vtd.saveVocaTasks(tasks, 6)

    //开始测试--------------------------------
    let n = 10000;      //表示无穷大
    let todayTasks = null
    let lastLearnDate = null
    for(let i=0;i<n;i++){
        //step1.加载今日任务,修改lastLearnDate
        todayTasks = vts.getTodayTasks(todayTasks,taskCount,lastLearnDate,i)
        lastLearnDate = _util.getDayTime(i)
        if(todayTasks && todayTasks.length <= 0){
            break
        }
        let outTxt = `----第${i+1}天-----
`
        //step2: 完成任务
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`
            if(t.status === Constant.STATUS_0){
                t.progress = Constant.IN_LEARN_FINISH
                t.curIndex = 15
            }else{
                t.progress = Constant.IN_REVIEW_FINISH
                t.curIndex = 15
            }
        }
        fs.appendFileSync("./normal_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });

        //step3. 保存任务
        vts.storeTasks(todayTasks)
    }
    console.log('完成学习测试！！')
}, 100000)

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
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    vts.vtd.saveVocaTasks(tasks, 6)
    //开始测试--------------------------------
    let n = 1000; //表示无穷大
    let todayTasks = null
    let lastLearnDate = null
    let x = 1
    let y = 30
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务

        todayTasks = vts.getTodayTasks(todayTasks,taskCount,lastLearnDate,i)
        lastLearnDate = _util.getDayTime(i)
        if(todayTasks && todayTasks.length <= 0){
            break
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},progress:${t.progress},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //step2. 学习过程
        if(i+1 >= x && i+1 < y){  //偷懒
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.progress = Constant.IN_LEARN_TEST_2  //可取IN_LEARN_CARD、IN_LEARN_TEST_2...
                    t.curIndex = 4
                }
            } //新学未完成，后面是锁的，故不可学
        }else{                  //全部完成
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.progress = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else{
                    t.progress = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }
        //step3. 保存任务
        vts.storeTasks(todayTasks)
    }

}, 60000)


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
it('偷懒学习2, 第x天开始不完成 1(2、4)复，从第y天开始全部完成', async()=>{
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    vts.vtd.saveVocaTasks(tasks, 6)
    //开始测试--------------------------------
    let n = 1000; //表示无穷大
    let todayTasks = null
    let lastLearnDate = null
    let x = 10
    let y = 30
    for(let i=0;i<n;i++){
        //step1. 更新保存前一天任务&计算新任务
        todayTasks = vts.getTodayTasks(todayTasks,taskCount,lastLearnDate,i)
        lastLearnDate = _util.getDayTime(i)
        if(todayTasks && todayTasks.length <= 0){
            break
        }
        let outTxt = `----第${i+1}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},progress:${t.progress},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //step2. 学习过程
        if(i+1 >= x && i+1 < y){  //偷懒时间段
            for(let t of todayTasks ){
                if(t.status === Constant.STATUS_0){
                    t.progress = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else if(t.status === Constant.STATUS_1){       //1复不完成
                    t.progress = Constant.IN_REVIEW_TEST
                    t.curIndex = 1
                }else if(t.status === Constant.STATUS_4){       //4复不完成
                    t.progress = Constant.IN_REVIEW_TEST
                    t.curIndex = 1
                }else{
                    t.progress = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }else{
            for(let t of todayTasks ){
                //全部完成
                if(t.status === Constant.STATUS_0){
                    t.progress = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                }else{
                    t.progress = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
        }

        //step3. 保存任务
        vts.storeTasks(todayTasks)
    }

},100000)


/** *******************模拟中断学习1**************************
 *  中断10天
 */
it('中断学习, 第n天开始不学习', async()=>{
    const firstDay = -50
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    for(let task of tasks){
        if(task.vocaTaskDate > 0){
            task.vocaTaskDate = _util.getDayTime(firstDay)
        }
    }
    vts.vtd.saveVocaTasks(tasks, 6)
    //开始测试--------------------------------
    let n = -13;
    let todayTasks = null
    let lastLearnDate = null
    for(let i=firstDay; i<=n; i++){
        //step1. 更新保存前一天任务&计算新任务
        todayTasks = vts.getTodayTasks(todayTasks,taskCount,lastLearnDate, i)
        lastLearnDate = _util.getDayTime(i)
        let outTxt = `----第${i}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},progress:${t.progress},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //step2. 学习过程
        for(let t of todayTasks ){
            if(t.status === Constant.STATUS_0){
                t.progress = Constant.IN_LEARN_FINISH
                t.curIndex = 6
            }else{
                t.progress = Constant.IN_REVIEW_FINISH
                t.curIndex = 6
            }
        }
        //step3. 保存任务
        vts.storeTasks(todayTasks)
    }
}, 60000)


it('getTodayTasks: 获取今日任务', ()=>{
    let todayTasks = vts.getTodayTasks([],taskCount,_util.getDayTime(-13), 0 )

    console.log('-------------获取今日任务--------------------')
    console.log(todayTasks)
})

/** *******************模拟中断学习2**************************
 *  中断20天
 */
it('中断学习20天', async()=>{
    const firstDay = -50
    //获取任务--------------------------------
    let params = {
        taskCount: taskCount.toString(),
        taskWordCount: '6',
        bookCode: 'VB_1'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    const tasks = res.data.data.tasks
    for(let task of tasks){
        if(task.vocaTaskDate > 0){
            task.vocaTaskDate = _util.getDayTime(firstDay)
        }
    }
    vts.vtd.saveVocaTasks(tasks, 6)
    //开始测试--------------------------------
    let n = -14;
    let todayTasks = null
    let lastLearnDate = null
    for(let i=firstDay; i<=n; i++){
        //step1. 更新保存前一天任务&计算新任务
        todayTasks = vts.getTodayTasks(todayTasks,taskCount,lastLearnDate, i)
        lastLearnDate = _util.getDayTime(i)
        let outTxt = `----第${i}天-----
`
        for(let t of todayTasks){
            outTxt += `taskOrder:${t.taskOrder}, status:${t.status},progress:${t.progress},leftTimes:${t.leftTimes},  date: ${new Date(t.vocaTaskDate).toDateString()}
`
        }
        fs.appendFileSync("./exception_plan.txt",outTxt , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
        });
        //step2. 学习过程
        for(let t of todayTasks ){
            if(t.status === Constant.STATUS_0){
                t.progress = Constant.IN_LEARN_FINISH
                t.curIndex = 6
            }else{
                t.progress = Constant.IN_REVIEW_FINISH
                t.curIndex = 6
            }
        }
        //step3. 保存任务
        vts.storeTasks(todayTasks)
    }
}, 60000)
it('getTodayTasks: 20天后获取今日任务', ()=>{
    let todayTasks = vts.getTodayTasks([],taskCount,_util.getDayTime(-14), 0 )

    console.log('-------------获取今日任务--------------------')
    console.log(todayTasks)
})



it('获取复习状态任务， 置零', ()=>{
    vts.vtd.modify(()=>{
        const tasks = vts.vtd.getReviewedTasks()
        for(let task of tasks){
            task.status =  Constant.STATUS_0
            task.delayDays = 0
            task.vocaTaskDate = 0
            task.progress = Constant.IN_LEARN_PLAY
            task.leftTimes = Constant.LEARN_PLAY_TIMES
        }
    })

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