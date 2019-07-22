
const Realm = require('realm')
const uuidv4 = require('uuid/v4');

// 1. 任务表
const VocaTaskSchema = {
    name: 'VocaTask',
    primaryKey: 'id',
    properties: {
        id: 'string',                           //任务id
        taskOrder: 'int?',                      //任务序号
            //任务状态 [0,1,2,4,7,15,200 ] 代表[待学，1复，2复，4复，7复，15复，完成]
        status: {type:'int', optional:true, default:0},                 
            //任务执行日期
        vocaTaskDate: 'int?',                                            
            //任务进度
        process: {type: 'string',optional:true, default: 'IN_LEARN_PLAY'}, 
            //任务单词数组
        taskWords: 'TaskWord[]',    
            //进行中的当前单词下标                                
        curIndex:{type: 'int',optional:true, default: 0},
            //剩下的遍数
        letfTimes:{type: 'int',optional:true, default: 0},
            //判断单词数据是否已查询写入
        dataCompleted:{type: 'bool',optional:true, default: false},
            //创建时间
        createTime:'int?',
            //是否同步
        isSync: {type: 'bool',optional:true, default: true}
    }
  };
 
  
  // 2. 任务单词表
  const TaskWordSchema = {
    name: 'TaskWord',
    primaryKey: 'id',
    properties: {
      id: 'string',                      
      word: 'string?',
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

    constructor(props){
        this.realm = null
    }
    //打开数据库
    async open(){
        try{
            this.realm  = await Realm.open({path: 'VocaTask.realm', schema:[ TaskWordSchema,VocaTaskSchema]})
        }catch(err){
            console.log('Error:打开realm数据库失败, 创建VocaTaskDao对象失败')
            console.log(err)
        }
        return this.realm;
    }
    //判断数据库是否关闭
    isOpen(){
        return (this.realm !== null)
    }
    //关闭数据库
    close = ()=>{
        if(this.realm && !this.realm.isClosed){
            this.realm.close()
            this.realm = null
        }
    }

    /**批量修改对象数据 */
    modifyTasks = (tasks)=>{
        this.realm.write((realm=>{
            for(let task of tasks){
                let params = {
                    id:task.id,
                    taskOrder: task.taskOrder, //复习
                    status: task.status,
                    learnStatus: task.vocaTaskDate,
                    vocaTaskDate: task.vocaTaskDate,
                    taskWords: task.taskWords
                 }
                realm.create('VocaTask', params, true);
            }
        }))
    }

    /**修改对象数据 */
    modifyTask = (task)=>{
         this.realm.write((realm=>{
             let params = {
                id:task.id,
                taskOrder: task.taskOrder, //复习
                status: task.status,
                learnStatus: task.vocaTaskDate,
                vocaTaskDate: task.vocaTaskDate,
                taskWords: task.taskWords
             }
            realm.create('VocaTask', params, true);
        }))
    }

    /**自定义修改 */
    modify =  (fn)=>{
        this.realm.write(fn)
    }


    /**保存任务数据 */
    saveVocaTasks = (vocaTasks)=>{
        console.log('save ...');
        vocaTasks = [
            {
                id:uuidv4(),
                taskOrder: 1, //复习
                status: 0,
                learnStatus:'IN_LEARN_TEST1',
                vocaTaskDate: new Date(new Date().toLocaleDateString()).getTime(),
                taskWords: [{
                    id:uuidv4(),
                    word: "accommodation",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "calorie",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "decent",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "define",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "ensue",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "tasty",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "complicated",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "weary",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "wrinkle",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "weary",
                    passed: false,
                    wrongNum: 0
                },
                ]
            },
            {
                id:uuidv4(),
                taskOrder: 2, //新学
                status: 0,
                learnStatus:'IN_LEARN_TEST1',
                vocaTaskDate: new Date(new Date().toLocaleDateString()).getTime(),
                taskWords: [{
                    id:uuidv4(),
                    word: "poverty",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "premier",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "miss",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "notion",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "harmony",
                    passed: false,
                    wrongNum: 0
                },{
                    id:uuidv4(),
                    word: "feeble",
                    passed: false,
                    wrongNum: 0
                }],
              
            },];
            //遍历存入
            try{
                this.realm.write(()=>{
                    for(let task of vocaTasks){
                        console.log(task)
                        this.realm.create('VocaTask', task);
                    }
                })
            }catch(err){
                console.log('save failed')
                console.log(err)
            }
    }

    /** 获取全部任务数据 */
    getAllTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask')
        return vocaTasks;
    }

    /** 获取今日任务*/
    getTodayTasks = ()=>{
        //获取今天0点的时间戳
        let today = new Date(new Date().toLocaleDateString()).getTime()
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = '+today+' AND status >= 0 AND status <= 15')
        console.log(vocaTasks)
        return vocaTasks;
    }

    /** 获取已学任务 */
    getLearnedTask = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status > 0')
        console.log(vocaTasks)
        return vocaTasks;
    }

     /** 获取未学任务 */
     getNotLearnedTask = ()=>{
        let vocaTasks = this.realm.objects('VocaTask').filtered('status = 0')
        console.log(vocaTasks)
        return vocaTasks;
    }

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
    

    /**清空所有任务 */
    deleteAllTasks = ()=>{
        this.realm.write(()=>{
            this.realm.deleteAll();
        })
    }

}

