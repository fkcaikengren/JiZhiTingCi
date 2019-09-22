import _util from "../../../common/util";

const Realm = require('realm')
import * as Constant from "../common/constant";
import * as VConfig from '../common/vocaConfig'

// 1. 任务表
const VocaTaskSchema = {
    name: 'VocaTask',
    primaryKey: 'taskOrder',
    properties: {
        taskOrder: 'int',                      //任务序号
            //任务状态 [0,1,2,4,7,15,200 ] 代表[待学，1复，2复，4复，7复，15复，完成]
        status: {type:'int', optional:true, default:0},                 
            //任务执行日期
        vocaTaskDate: 'int?',                                            
            //任务进度
        progress: {type: 'string',optional:true, default: 'IN_LEARN_PLAY'}, 
            //进行中的当前单词下标
        curIndex:{type: 'int',optional:true, default: 0},
            //剩下的遍数
        leftTimes:{type: 'int',optional:true, default: Constant.LEARN_PLAY_TIMES}, //默认是新学阶段，3遍轮播
            //延迟天数
        delayDays:{type: 'int',optional:true, default: 0},
            //创建时间
        createTime:'int?',
            //是否同步
        isSync: {type: 'bool',optional:true, default: true},
        //任务单词数组
        words: 'TaskWord[]',
        //未被pass的单词数量
        wordCount: {type: 'int',optional:true, default: 0},
        //听的遍数
        listenTimes: {type: 'int',optional:true, default: 0},
        //测试遍数
        testTimes : {type: 'int',optional:true, default: 0},
    }
  };
 
  
  // 2. 任务单词表
  const TaskWordSchema = {
    name: 'TaskWord',
    primaryKey: 'word',
    properties: {
      word: 'string',
      passed: {type: 'bool', optional:true, default: false},
      wrongNum:	{type: 'int',optional:true, default: 0},
    }
  };

export default class VocaTaskDao {

    constructor(){
        this.realm = null
    }

    //单例模式
    static getInstance() {
        if(!this.instance) {
            this.instance = new VocaTaskDao();
        }
        return this.instance;
    }

    /**
     * 打开数据库
     * @returns {Promise<null>}
     */
    async open(){
        try{
            if(!this.realm){
                this.realm  = await Realm.open({path: 'VocaTask.realm', schema:[ TaskWordSchema,VocaTaskSchema]})
                // console.log(this.realm)
            }
        }catch(err){
            console.log('VocaTaskDao: 创建VocaTask.realm数据库失败')
            console.log(err)
        }
        return this.realm;
    }

    /**
     * 判断数据库是否关闭
     * @returns {boolean}
     */
    isOpen(){
        return (this.realm !== null)
    }

    /**
     * 关闭数据库
     */
    close = ()=>{
        if(this.realm && !this.realm.isClosed){
            this.realm.close()
            this.realm = null
        }
    }

    /**
     * 保存任务数据
     * @param tasks
     */
    saveVocaTasks = (tasks, wordCount)=>{
        try{
            for(let t of tasks){
                t.wordCount = wordCount
            }
            this.realm.write(()=>{
                for(let task of tasks){
                    console.log(task.taskOrder)
                    this.realm.create('VocaTask', task);
                }
            })
            console.log('VocaTasks 保存成功，结束！')
        }catch(e){
            console.log('VocaTasks 保存失败！')
            console.log(e)
        }
    }


    /**
     * 批量修改对象数据
     * @param tasks
     */
    modifyTasks = (tasks)=>{
        try{
            this.realm.write(()=>{
                for(let task of tasks){
                    console.log('----- 批量修改task -------')
                    this.realm.create('VocaTask', task, true);
                }
            })
        }catch (e) {
            console.log('VocaTaskDao : 批量修改数据失败')
            console.log(e)
        }
    }

    /**
     * 修改修改对象数据
     * @param task
     */
    modifyTask = (task)=>{
        try{
            this.realm.write(()=>{
                console.log('----- 修改task -------')
                this.realm.create('VocaTask', task, true);
            })
        }catch (e) {
            console.log('VocaTaskDao : 修改Task失败')
            console.log(e)
        }
    }

    /** 修改任务的单词 */
    modifyWord = (taskWord)=>{
        try{
            this.realm.write(()=>{
                this.realm.create('TaskWord', taskWord, true);
            })
        }catch (e) {
            console.log('VocaTaskDao : 修改TaskWord失败')
            console.log(e)
        }
    }

    /**自定义修改 */
    modify =  (fn)=>{
        console.log('--------自定义修改task-------')
        this.realm.write(fn)
    }

    /**
     *  查询全部任务
     * @returns {Realm.Results<any> | never}
     */
    getAllTasks = ()=>{
        return this.realm.objects('VocaTask')
    }

    /**
     * 获取今日任务 (具有一定顺序)
     * @param nth
     * @returns {Realm.Results<any>} 查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
    getTodayTasks = (nth=0)=>{
        //nth=0 获取今天0点的时间戳
        let today = _util.getDayTime(nth)
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = '+today + ' SORT(taskOrder ASC) ' )
        return vocaTasks;
    }

    /**
     * 获取已学任务
     * @returns {Realm.Results<any>} 查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
    getLearnedTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status > 0')
        return vocaTasks;
    }

    /**
     * 获取未学任务
     * @returns {Realm.Results<any>}查询到数据返回Realm.Results, 否则返回Realm.List{} （length为0）
     */
     getNotLearnedTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status = 0')
        return vocaTasks;
    }


    /**
     * 根据taskOrder获取任务
     * @param taskOrder
     * @returns {any} 如果不存在，返回undefined
     */
    getTaskByOrder = (taskOrder)=>{
        let vocaTask = this.realm.objects('VocaTask').filtered('taskOrder = "'+taskOrder+'"')[0]
        console.log(vocaTask)
        return vocaTask;
    }

    /** 根据错词频数查询单词 */
    getWordsEqWrongNum = (num)=>{
        let words = this.realm.objects('TaskWord').filtered('wrongNum = "'+num+'"')
        console.log(words)
        return words;
    }
    /** 查询错误频数大于num 的所有单词*/
    getWordsGEWrongNum = (num)=>{
        let words = this.realm.objects('TaskWord').filtered('wrongNum >= "'+num+'"')
        // console.log(words)
        return words;
    }

    /** 查询出某个单词 */
    getWord = (word)=>{
        return this.realm.objects('TaskWord').filtered('word = "'+word+'"')
    }


    /**
     *  清空所有任务，清空数据库
     */
    deleteAllTasks = ()=>{
        this.realm.write(()=>{
            this.realm.deleteAll();
        })
    }

}

