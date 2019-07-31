
import * as Constant from './constant'


export default class VocaUtil{


    /**
     *
     * @param task
     * @returns
     */
    static copyTask(task){
        let copyTask = {
            taskOrder: task.taskOrder,              //任务序号
            status: task.status,
            vocaTaskDate: task.vocaTaskDate,
            process: task.process,
            curIndex:task.curIndex,
            leftTimes:task.leftTimes,
            delayDays:task.delayDays,
            dataCompleted:task.dataCompleted,
            createTime:task.createTime,
            isSync: task.isSync,
            words: [],
            wordCount: task.wordCount,
        }
        let ws = task.words
        for(let i in ws){
            copyTask.words.push(ws[i])
        }
        return copyTask
    }

    /**
     *   深拷贝VocaTask
     * @param task Realm数据库中的task
     * @returns  新的task
     * */
    static copyTaskDeep(task){
        let copyTask = {
            taskOrder: task.taskOrder,
            status: task.status,
            vocaTaskDate: task.vocaTaskDate,
            process: task.process,
            curIndex:task.curIndex,
            leftTimes:task.leftTimes,
            delayDays:task.delayDays,
            dataCompleted:task.dataCompleted,
            createTime:task.createTime,
            isSync: task.isSync,
            words: [],
            wordCount: task.wordCount,
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
        return copyTask
    }

    /**
     *  按顺序获取下一个状态
     * @param oldStatus
     * @returns {*}
     */
    static getNextStatus(oldStatus){
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

    /**
     *  计算任务进度 0表示开始，100表示完成
     * @param task
     * @returns {number} 返回一个0-100的数字
     */
    static calculateProcess = (task)=>{
        let num = 0
        if(task.status === Constant.STATUS_0){  //新学任务
            switch (task.process) {
                case Constant.IN_LEARN_PLAY:        //轮播10 point:
                    let p = Math.floor(10/Constant.LEARN_PLAY_TIMES)
                    for(let i=Constant.LEARN_PLAY_TIMES; i>=0; i--){
                        if(task.leftTimes == i){
                            num = p*(Constant.LEARN_PLAY_TIMES - i)
                            break;
                        }
                    }
                    break
                case Constant.IN_LEARN_CARD:        //卡片30 point
                    num = Math.floor((task.curIndex/task.wordCount)*30) + 10
                    break
                case Constant.IN_LEARN_TEST_1:      //1测 30 point
                    num = Math.floor((task.curIndex/task.wordCount)*30) + 40
                    break
                case Constant.IN_LEARN_TEST_2:      //2测 25 point
                    num = Math.floor((task.curIndex/task.wordCount)*25) + 70
                    break
                case Constant.IN_LEARN_FINISH:    //完成
                    num = 100
                    break
                default:
                    break;
            }
        }else{                                       //复习任务
            switch (task.process) {
                case Constant.IN_REVIEW_PLAY:        //轮播70 point:
                    let p = Math.floor(70/Constant.REVIEW_PLAY_TIMES)
                    for(let i=Constant.REVIEW_PLAY_TIMES; i>=0; i--){
                        if(task.leftTimes == i){
                            num = p*(Constant.REVIEW_PLAY_TIMES - i)
                            break;
                        }
                    }
                    break
                case Constant.IN_REVIEW_TEST:       //复习测试 25point
                    num = Math.floor((task.curIndex/task.wordCount)*25) + 70
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
    static genTaskName = (taskOrder)=>{
        let name = ''
        if(taskOrder < 10){
            name = '00'+taskOrder
        }else if(taskOrder < 100){
            name = '0'+taskOrder
        }else{
            name = ''+taskOrder
        }
        return name
    }
}




