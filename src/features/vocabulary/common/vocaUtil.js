
import * as Constant from './constant'
import VocaDao from '../service/VocaDao'
import VocaTaskDao from '../service/VocaTaskDao'
import {NavigationActions, StackActions} from 'react-navigation'
import VocaTaskService from "../service/VocaTaskService";
import ArticleDao from "../../reading/service/ArticleDao";


export default class VocaUtil{


    static copyTasks(tasks){
        const copyTasks = []
        for(let task of tasks){
            copyTasks.push({...task})
        }
        return copyTasks
    }

    /**
     *   深拷贝VocaTask
     * @param task Realm数据库中的task
     * @returns  新的task
     * */
    static copyTaskDeep(task, testWrongNumIsZero=false){
        let copyTask = {
            ...task,
            words: [],
        }
        let ws = task.words
        for(let i in ws){
            copyTask.words.push({
                ...ws[i],
                testWrongNum: testWrongNumIsZero?0:ws[i].testWrongNum,
            })
        }
        return copyTask
    }


    /**
     *  拷贝 article 数组
     * @param articles
     * @returns {Array}
     */
    static copyArticlesKW(articles){
        const arr = []
        for(let article of articles){
            //查询keyWords的变形词并修改
            const keyWords = JSON.parse(article.keyWords)
            let kwords = [...keyWords]
            for(let word of keyWords){
                const transformArr = VocaDao.getInstance().getTransforms(word)
                console.log('-----------'+word+'的transforms-------------')
                console.log(transformArr)
                kwords = kwords.concat(transformArr)
            }

            const copyArticle = {
                ...article,
                taskType: Constant.TASK_ARTICLE_TYPE,
                keyWords:kwords
            }
            arr.push(copyArticle)
        }
        return arr
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
            switch (task.progress) {
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
                case Constant.IN_LEARN_RETEST_1:      
                    num = 70
                    break
                case Constant.IN_LEARN_TEST_2:      //2测 25 point
                    num = Math.floor((task.curIndex/task.wordCount)*25) + 70
                    break
                case Constant.IN_LEARN_RETEST_2:     
                    num = 95
                    break
                case Constant.IN_LEARN_FINISH:    //完成
                    num = 100
                    break
                default:
                    break;
            }
        }else{                                       //复习任务
            switch (task.progress) {
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
                case Constant.IN_REVIEW_RETEST:       //复习测试 25point
                    num = 95
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
        if(taskOrder === Constant.VIRTUAL_TASK_ORDER){
            return '听词'
        }
        if(taskOrder){
            let name = ''
            if(taskOrder < 10){
                name = '00'+taskOrder
            }else if(taskOrder < 100){
                name = '0'+taskOrder
            }else{
                name = ''+taskOrder
            }
            return 'List-'+name
        }else{
            return ''
        }
        
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
    static randomArr = (minNum, maxNum, numArr) => {
        //判断错误
        if((typeof minNum !== "number") || (typeof maxNum !== "number") || (typeof numArr !== "object")){
            throw new Error('参数类型错误，minNum, maxNum must be number, numArr must be object ')
        }
        let options = []

        for(let i of [1,2,3]){ //产生3个选项
            let option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            while(options.includes(option) || numArr.includes(option)){
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
    static getShowWordInfos(words, wordInfos=null){
        if(!words){
            return []
        }
        const showWordInfos = []
        if(wordInfos === null){
            wordInfos = VocaDao.getInstance().getWordInfos(words.map((item,index)=>item.word))
        }
        for(let i in words){
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

    static getNotPassedWords = (words)=>{

        return words.filter((item,i)=>{
            if(item.passed === true){
                return false
            }else{
                return true
            }
        })
    }

    /** 计算剩余次数 */
    static getLeftCount = (testArr)=>{
        let count = 0
        for(let value of testArr){
            if(value === true){
                count++
            }
        }
        return count
    }


    /** 
     * 在任务中pass单词，返回pass后的新的{words,showInfos}
     * 如果shouldFilter=false, 不进行过滤的话，则返回pass的单词
     */
    static passWordInTask = (words,word,taskOrder,showWordInfos, shouldFilter=true)=>{
        // 修改realm数据库的 pass
        let res = null
        const  taskDao = VocaTaskDao.getInstance()
        if(shouldFilter){
            const newWords = []
            for(let i in words){
                if(words[i].word === word){ //pass
                    taskDao.modifyWord({word:word,passed:true})
                    taskDao.modify(()=>{
                        const task = taskDao.getTaskByOrder(taskOrder)
                        task.wordCount = task.wordCount - 1
                    })
                    newWords.push({...words[i],passed:true}) 
                }else{
                    newWords.push(words[i]) 
                }
            }

            const newShowWordInfos = showWordInfos.filter((item, i)=>{
                if(item){
                    if(item.word === word){
                        return false
                    }else{
                        return true
                    }
                }
            })

            res = {words:newWords, showWordInfos:newShowWordInfos}
        }else{
            for(let w of words){
                if(w.word === word){ //pass
                    taskDao.modifyWord({word:word,passed:true})
                    taskDao.modify(()=>{
                        const task = taskDao.getTaskByOrder(taskOrder)
                        task.wordCount = task.wordCount - 1
                    })
                    res = word
                    break
                }
            }
        }

        return res
    }

    //获取单词在wordInfos中的下标
    static getIndexInWordInfos = (curWord, wordInfos)=>{
        for(let i in wordInfos){
            if(wordInfos[i].word === curWord){
                return i
            }
        }
    }

    //统计单词（未passed）的错误平均数
    static calculateWrongAvg = (words,)=>{
        let count = 0
        let sum = 0
        for(let w of words){
            if(w.passed !== true){ 
                sum += w.wrongNum
                count++
            }
        }
        return (sum/count).toFixed(1)
    }


    /** 
     * 构建一个虚拟Task 
     * words 是task的words
    */
    static genVirtualTask = (words)=>{
        let copyTask = {
            taskOrder: Constant.VIRTUAL_TASK_ORDER,
            // status: null,
            // vocaTaskDate: task.vocaTaskDate,
            // progress: task.progress,
            curIndex:0,
            // leftTimes:task.leftTimes,
            // delayDays:task.delayDays,
            // createTime:task.createTime,
            // isSync: task.isSync,
            words: [],
            wordCount: words.length,
            listenTimes: 0,
            testTimes: 0
        }
        if(typeof words[0] === 'object'){
            for(let i in words){
                copyTask.words.push({
                    word: words[i].word,
                    passed: false,
                    wrongNum: words[i].wrongNum,
                    testWrongNum: 0,
                })
            }
        }else if(typeof words[0] === 'string'){
            for(let i in words){
                copyTask.words.push({
                    word: words[i],
                    passed: false,
                    wrongNum: 0,
                    testWrongNum: 0,
                })
            }
        }
        
        return copyTask
    }


    /**
     * 传入单词任务，获取任务的文章ids
     * @param vocaTasks
     * @returns {string}
     */
    static getArticleIds = (vocaTasks)=>{
        let ids = []
        
        for(let task of vocaTasks){
            const artiles = JSON.parse(task.articles)
            for(let a of artiles){
                ids.push(a.id)
            }
        }
        console.log(ids)
        return ids
    }

    /**
     *  筛选出需要存储的任务实体
     *      rawTasks (todayTasks + articleTasks)  => storedTasks
     * @param rawTasks 全部任务（文章+单词）
     * @returns {*} 返回实际存储的单词任务
     */
    static filterRawTasks = (rawTasks)=>{
        let isFirst = false
        let storedTasks = rawTasks.filter((task, index)=>{
            if(task.taskType === Constant.TASK_ARTICLE_TYPE){
                return false
            }else{
                task.curIndex = 0                           //curIndex 置零
                if(task.status === Constant.STATUS_0 ){     //新学任务
                    if(task.progress !== Constant.IN_LEARN_FINISH){
                        isFirst = true
                        return true
                    }else{
                        return false
                    }
                }else{                                      //复习任务
                    if(isFirst && task.status === Constant.STATUS_1){
                        return false
                    }else{
                        return true
                    }
                }
            }
        })
        return storedTasks
    }


    /**
     * 同步单词任务到本地
     * @param storedTasks 可保存的单词任务
     * @param vts
     */
    static syncTasksLocal = (storedTasks)=>{
        //筛选出需要同步的
        const notSyncTasks = storedTasks.filter((task,index)=>{
            if(task.isSyncLocal){
                return false
            }else{
                task.isSyncLocal = true
                return true
            }
        })
        VocaTaskDao.getInstance().modifyTasks(notSyncTasks)

    }


    /**
     *  加载今天的全部任务（单词和文章）
     * @param storedTask
     * @param taskCount
     * @param lastLearnDate
     * @returns {*[]|*}
     */
    static loadTodayRawTasks = (storedTask, taskCount, lastLearnDate)=>{
        const todayTasks = new VocaTaskService().getTodayTasks(storedTask,taskCount,lastLearnDate)
        const tasks = todayTasks.filter((task,i)=>{
            if(task.status === Constant.STATUS_0){
                return true
            }else{
                return false
            }
        })
        const todayArticles = VocaUtil.copyArticlesKW(ArticleDao.getInstance().getArticles(VocaUtil.getArticleIds(tasks)))
        for(let art of todayArticles){
            todayTasks.push(art)
        }
        return todayTasks
    }

}




