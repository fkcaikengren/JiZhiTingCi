
import 'react-native'
import VocaUtil from '../../src/features/vocabulary/common/vocaUtil'
import _util from '../../src/common/util'
import * as Constant from '../../src/features/vocabulary/common/constant'

/*---------------------------------------------------------*/
/**
 * 测试用例：
 *  1.学习：
 *      a.轮播
 *      b.卡片
 *      c.1测
 *      d.2测
 *      e.完成
 *  2.复习：
 *      a.轮播
 *      b.测试
 *      c.完成
 */
it('计算任务进度 ', ()=>{
    let task = {
        taskOrder: 1,
        status: 4,                                  //测试变量1
        vocaTaskDate: 12345678900,
        process: Constant.IN_REVIEW_FINISH,              //测试变量2
        curIndex: 15,                                //测试变量3
        leftTimes: 0,                              //测试变量4
        delayDays: 0,
        dataCompleted: true,
        createTime: '',
        isSync: true,
        wordCount:15,                           //测试变量5
    }
    console.log(VocaUtil.calculateProcess(task))
})