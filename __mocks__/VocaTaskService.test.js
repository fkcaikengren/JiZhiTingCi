import VocaTaskService from "../src/features/vocabulary/service/VocaTaskService"
import _util from "../src/common/util"
import * as Constant from '../src/features/vocabulary/common/constant'
import VocaDao from "../src/features/vocabulary/service/VocaDao";
const fs = require("fs");

const createPlanData = require('./mock_data/createPlan.json')
const vts = new VocaTaskService()
VocaDao.getInstance().open()

// 测试代码
setTimeout(() => {

    /** 测试：生成任务 */
    // genNewTasks_test()
    function genNewTasks_test() {
        const result = vts.genNewTasks(_util.getDayTime(0), 1, 10)
        console.log((result))
    }


    /**测试：获取今日任务 */
    // getTodayTasks_test()
    function getTodayTasks_test() {
        vts.vtd.saveBookWords(createPlanData.words)
        const result = vts.getTodayTasks(null, 1, 10)
        console.log(result[0])
    }


    /** 测试：模拟正常学习 */
    /**
     * 测试用例：
     * taskCount取值：1,2,3
     */
    // mockNormalStudy_test()
    function mockNormalStudy_test() {
        //获取数据
        vts.vtd.saveBookWords(createPlanData.words)

        //开始测试--------------------------------
        let n = 10000;      //10000表示无穷大
        let todayTasks = null
        let lastLearnDate = null
        for (let i = 0; i < n; i++) {
            //step1.加载今日任务,修改lastLearnDate
            todayTasks = vts.getTodayTasks(lastLearnDate, 2, 12, i)
            lastLearnDate = _util.getDayTime(i)
            if (todayTasks && todayTasks.length <= 0) {
                break
            }
            let outTxt = `----第${i + 1}天-----
`
            //step2: 完成任务
            for (let t of todayTasks) {
                outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`
                if (t.status === Constant.STATUS_0) {
                    t.progress = Constant.IN_LEARN_FINISH
                    t.curIndex = 15
                } else {
                    t.progress = Constant.IN_REVIEW_FINISH
                    t.curIndex = 15
                }
            }
            fs.appendFileSync("./normal_plan.txt", outTxt, (error) => {
                if (error) return console.log("追加文件失败" + error.message);
                console.log(`-第${i + 1}天-`);
            });

            //step3. 存储修改的任务
            vts.vtd.modifyTasks(todayTasks)
        }
        console.log('完成学习测试！！')

    }


    /** 模拟异常学习(1) : 第x天开始不完成新学，从第y天开始全部完成  */
    /*  
        * 测试用例：
            taskCount取值：1,2,3
            x,y取值：
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
    // mockExceptionStudy1_test()
    function mockExceptionStudy1_test() {
        //获取数据
        vts.vtd.saveBookWords(createPlanData.words)

        //开始测试--------------------------------
        let n = 10000;      //10000表示无穷大
        let todayTasks = null
        let lastLearnDate = null
        let x = 30
        let y = 60
        for (let i = 0; i < n; i++) {
            //step1.加载今日任务,修改lastLearnDate
            todayTasks = vts.getTodayTasks(lastLearnDate, 2, 10, i)
            lastLearnDate = _util.getDayTime(i)
            if (todayTasks && todayTasks.length <= 0) {
                break
            }
            let outTxt = `----第${i + 1}天-----
`
            //step2: 学习过程
            for (let t of todayTasks) {
                outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`

                if (i + 1 >= x && i + 1 < y) {  //偷懒
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_TEST_1  //可取IN_LEARN_CARD、IN_LEARN_TEST_2...
                            t.curIndex = 4
                        }
                    } //新学未完成，后面是锁的，故不可学
                } else {                  //全部完成
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_FINISH
                            t.curIndex = 15
                        } else {
                            t.progress = Constant.IN_REVIEW_FINISH
                            t.curIndex = 15
                        }
                    }
                }
            }
            fs.appendFileSync("./exception_plan.txt", outTxt, (error) => {
                if (error) return console.log("追加文件失败" + error.message);
                console.log(`-第${i + 1}天-`);
            });

            //step3. 存储修改的任务
            vts.vtd.modifyTasks(todayTasks)
        }
        console.log('完成学习测试！！')

    }

    /** 模拟异常学习(2) : 第x天开始不完成1、2、4复，从第y天开始全部完成  */
    /**
        *  测试用例：
        *   taskCount取值：1,2,3
        *   x,y取值：
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
    // mockExceptionStudy2_test()
    function mockExceptionStudy2_test() {
        //获取数据
        vts.vtd.saveBookWords(createPlanData.words)

        //开始测试--------------------------------
        let n = 1000;      //10000表示无穷大
        let todayTasks = null
        let lastLearnDate = null
        let x = 89
        let y = 200
        let count = 0
        for (let i = 0; i < n; i++ , count++) {
            //step1.加载今日任务,修改lastLearnDate
            todayTasks = vts.getTodayTasks(lastLearnDate, 1, 10, i)
            lastLearnDate = _util.getDayTime(i)
            if (todayTasks && todayTasks.length <= 0) {
                break
            }
            let outTxt = `----第${i + 1}天-----
`
            //step2: 学习过程
            for (let t of todayTasks) {
                outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`
                if (i + 1 >= x && i + 1 < y) {  //偷懒
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_FINISH         //新学完成
                            t.curIndex = 15
                        } else if (t.status === Constant.STATUS_1) {       //1复不完成
                            t.progress = Constant.IN_REVIEW_FINISH
                            t.curIndex = 1
                        } else if (t.status === Constant.STATUS_15) {       //15复不完成
                            t.progress = Constant.IN_REVIEW_TEST
                            t.curIndex = 15
                        } else {                                           //其他复习完成
                            t.progress = Constant.IN_REVIEW_TEST        //Constant.IN_REVIEW_FINISH
                            t.curIndex = 15
                        }
                    }
                } else {                  //全部完成
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_FINISH
                            t.curIndex = 15
                        } else {
                            t.progress = Constant.IN_REVIEW_FINISH
                            t.curIndex = 15
                        }
                    }
                }
            }
            fs.appendFileSync("./exception_plan.txt", outTxt, (error) => {
                if (error) return console.log("追加文件失败" + error.message);
                console.log(`-第${i + 1}天-`);
            });

            //step3. 存储修改的任务
            vts.vtd.modifyTasks(todayTasks)
        }
        vts.getTodayTasks(lastLearnDate, 2, 11, count)
        console.log('完成学习测试！！')

    }


    /** 测试：模拟中断学习   */
    /**
     *  测试用例
     *  taskCount取值：1,2,3
     *  中断天数n取值: -2, -10, -13, -14 -20
     *  学习过程的取值：正常学习、异常学习
     */
    mockBreakStudy_test()
    function mockBreakStudy_test() {
        //获取数据
        vts.vtd.saveBookWords(createPlanData.words)
        //开始测试--------------------------------
        const firstDay = -60 //从前50天开始
        let n = -15;
        let todayTasks = null
        let lastLearnDate = null
        let x = -20
        let y = 10000
        const taskCount = 2
        for (let i = firstDay; i <= n; i++) {
            //step1.加载今日任务,修改lastLearnDate
            todayTasks = vts.getTodayTasks(lastLearnDate, taskCount, 10, i)
            lastLearnDate = _util.getDayTime(i)
            if (todayTasks && todayTasks.length <= 0) {
                break
            }
            let outTxt = `----第${i}天-----
`
            //step2: 学习过程
            for (let t of todayTasks) {
                outTxt += `taskOrder:${t.taskOrder}, status:${t.status}, date: ${new Date(t.vocaTaskDate).toDateString()}
`

                if (i + 1 >= x && i + 1 < y) {  //未完成
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_FINISH  //可取IN_LEARN_CARD、IN_LEARN_TEST_2...
                            t.curIndex = 10
                        } else {
                            t.progress = Constant.IN_REVIEW_PLAY
                            t.curIndex = 1
                        }
                    }
                } else {                  //全部完成
                    for (let t of todayTasks) {
                        if (t.status === Constant.STATUS_0) {
                            t.progress = Constant.IN_LEARN_FINISH
                            t.curIndex = 10
                        } else {
                            t.progress = Constant.IN_REVIEW_FINISH
                            t.curIndex = 15
                        }
                    }
                }
            }
            fs.appendFileSync("./exception_plan.txt", outTxt, (error) => {
                if (error) return console.log("追加文件失败" + error.message);
                console.log(`-第${i}天-`);
            });

            //step3. 存储修改的任务
            vts.vtd.modifyTasks(todayTasks)
        }
        console.log('----------------中断结束, 获取今天任务：----------------')
        const result = vts.getTodayTasks(lastLearnDate, taskCount, 10, 0) //今天
        console.log(result)

    }


    /** 测试：获取已学单词列表 */
    // getLearnedList_test()
    function getLearnedList_test() {
        console.log(vts.getLearnedList())
    }



    /** 测试：获取未学单词列表 */
    // getNewList_test()
    function getNewList_test() {
        console.log(vts.getNewList())
    }




    /** 测试： 统计剩余天数 */
    // countLeftDays_test()
    function countLeftDays_test() {
        console.log(vts.countLeftDays(1, 10))
    }


    /** 测试： 统计已学单词数量 */
    // countLearnedWords_test()
    function countLearnedWords_test() {
        console.log(vts.countLearnedWords())
    }

}, 1000)

