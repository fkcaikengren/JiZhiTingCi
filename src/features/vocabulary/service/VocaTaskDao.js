
const Realm = require('realm')
const uuidv4 = require('uuid/v4');

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
        process: {type: 'string',optional:true, default: 'IN_LEARN_PLAY'}, 
            //进行中的当前单词下标
        curIndex:{type: 'int',optional:true, default: 0},
            //剩下的遍数
        letfTimes:{type: 'int',optional:true, default: 3}, //默认是新学阶段，3遍轮播
            //延迟天数
        delayDays:{type: 'int',optional:true, default: 0},
            //判断单词数据是否已查询写入
        dataCompleted:{type: 'bool',optional:true, default: false},
            //创建时间
        createTime:'int?',
            //是否同步
        isSync: {type: 'bool',optional:true, default: true},
        //任务单词数组
        words: 'TaskWord[]'
    }
  };
 
  
  // 2. 任务单词表
  const TaskWordSchema = {
    name: 'TaskWord',
    primaryKey: 'word',
    properties: {
      word: 'string',
      passed: {type: 'bool', optional:true, default: false},
      wrongNum:	'int?',
      testWrongNum: 'int?',
      enPhonetic: 'string?',
      enPronUrl: 'string?',
      amPhonetic: 'string?',
      amPronUrl: 'string?',
      def:'string?',
      sentence:'string?',
      tran: 'string?'
    }
  };

export default class VocaTaskDao {

    constructor(){
        this.realm = null
    }

    /**
     * 打开数据库
     * @returns {Promise<null>}
     */
    async open(){
        try{
            this.realm  = await Realm.open({path: 'VocaTask.realm', schema:[ TaskWordSchema,VocaTaskSchema]})
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
    saveVocaTasks = (tasks)=>{
        try{
            this.realm.write(()=>{
                for(let task of tasks){
                    this.realm.create('VocaTask', task);
                }
            })
        }catch(e){
            console.log('VocaTasks 保存失败')
            console.log(e)
        }
    }


    /**
     * 批量修改对象数据
     * @param tasks
     */
    modifyTasks = (tasks)=>{
        try{
            this.realm.write((realm=>{
                for(let task of tasks){
                    realm.create('VocaTask', task, true);
                }
            }))
        }catch (e) {
            console.log('VocaTaskDao : 批量修改数据失败')
            console.log(e)
        }
    }


    /**自定义修改 */
    modify =  (fn)=>{
        this.realm.write(fn)
    }


    /** 获取今日任务*/
    getTodayTasks = ()=>{
        //获取今天0点的时间戳
        let today = new Date(new Date().toLocaleDateString()).getTime()
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = '+today )
        return vocaTasks;
    }

    /** 获取已学任务 */
    getLearnedTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status > 0')
        console.log(vocaTasks)
        return vocaTasks;
    }

     /** 获取未学任务 */
     getNotLearnedTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status = 0')
        return vocaTasks;
    }
    //-----------------------------------------------
    /**根据taskOrder获取任务 */
    getTaskByOrder = (taskOrder)=>{
        let vocaTask = this.realm.objects('VocaTask').filtered('taskOrder = "'+taskOrder+'"')[0]
        console.log(vocaTask)
        return vocaTask;
    }

    /** 根据错词频数查询单词 */
    getWordsByWrongNum = (num)=>{
        let words = this.realm.objects('TaskWord').filtered('wrongNum = "'+num+'"')
        console.log(words)
        return words;
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

