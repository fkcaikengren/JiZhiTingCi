
import * as Constant from './constant'
import VocaDao from '../service/VocaDao'
import {NavigationActions, StackActions} from 'react-navigation'


export default class VocaUtil{


    /**
     * 浅拷贝任务
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


    /**
     * @description 生成一个minNum到maxMum间的随机数
     * @memberof VocaUtil
     */
    static randomNum = (minNum, maxNum) => {
        if((typeof minNum !== "number") || (typeof maxNum !== "number") ){
            throw new Error('参数类型错误，minNum, maxNum 应该是number')
        }
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    /**
     * @description 生成一个minNum到maxMum间的随机数数组 (不出现指定数)
     * @memberof VocaUtil
     */
    static randomArr = (minNum, maxNum, num) => {
        //判断错误
        if((typeof minNum !== "number") || (typeof maxNum !== "number") || (typeof num !== "number")){
            throw new Error('参数类型错误，minNum, maxNum, num 应该是number')
        }
        let options = []

        for(let i of [1,2,3]){ //产生3个选项
            let option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            while(options.includes(option) || option == num){
                option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            }
            options.push(option)
        }
        return options
    }

    /**
     * @description 解析json对象并转换成文本
     * @static
     * @memberof VocaUtil
     */
    static transToText = (trans)=>{
        if(!trans || trans===''){
            return ''
        }
        let translation = ''
        try{
            const obj = JSON.parse(trans)
            if(obj){
                for(let k in obj){
                    translation += `${k}. ${obj[k]} `
                }
            }
        }catch(e){
            console.log('Error: vocaUtil.transToText, 格式错误')
            console.log(e)
        }
        return translation
    }

    /**
     * 获取没有pass的单词信息
     * @param {*} words  task的words
     */
    static getShowWordInfos(words){
        if(!words){
            return []
        }
        showWordInfos = []
        for(let i in words){
            const wordInfos = VocaDao.getInstance().getWordInfos(words.map((item, i)=>item.word))
            //过滤
            if(words[i].passed===false){
                showWordInfos.push(wordInfos[i])
            }
        }
        return showWordInfos
    } 

    static goPageWithoutStack = (navigation,routeName, params={})=>{
        // 抹掉stack，跳转到指定路由
        const  resetAction = StackActions.reset({  
            index: 0,
            actions: [
                NavigationActions.navigate({routeName,params})
            ]
        });
        navigation.dispatch(resetAction);
    }
}




