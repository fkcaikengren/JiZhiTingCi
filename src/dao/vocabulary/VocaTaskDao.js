
const Realm = require('realm')
const uuidv4 = require('uuid/v4');

// 1. 任务表
const VocaTaskSchema = {
    name: 'VocaTask',
    primaryKey: 'id',
    properties: {
        id: 'string',                           //任务id
        taskOrder: 'int?',                      //任务序号
            //任务状态[0:未学, 1:完成新学,  2完成二复, 4, 7, 15, 200:掌握 ] 
        status: {type:'int', optional:true, default:0},                 
            //任务执行日期
        vocaTaskDate: 'int?',                                            
            //学习新词时的状态 IN_LEARN_PLAY , IN_LEARN_CARD , IN_LEARN_TEST1 , IN_LEARN_RETEST1 , IN_LEARN_TEST2, IN_LEARN_RETEST2, LEARN_FINISH
        learnStatus: {type: 'string',optional:true, default: 'IN_LEARN_CARD'}, 
            //新词复习时的状态  IN_REVIEW_PLAY  , IN_REVIEW_TEST1 , IN_REVIEW_RETEST1 , IN_REVIEW_TEST2, IN_REVIEW_RETEST2, REVIEW_FINISH
        reviewStatus: {type:'string', optional:true, default: 'IN_REVIEW_TEST1'},    
            //任务单词数组
        taskWords: 'TaskWord[]',    
            //进行中的当前单词下标                                
        curIndex:{type: 'int',optional:true, default: 0},
            //判断单词数据是否已查询写入
        dataCompleted:{type: 'bool',optional:true, default: false},
        createTime:'int?'
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

    //修改数据库
    modify = (fn)=>{
        this.realm.write(fn)
    }


    //1. 保存任务数据
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
                    word: "acute",
                    passed: false,
                    wrongNum: 0
                },{
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

    //2. 获取全部任务数据
    getAllTasks = ()=>{
        let vocaTasks = this.realm.objects('VocaTask')
        return vocaTasks;
    }


    // 获取今日新学任务
    getLearnTasks = ()=>{
        //获取今天0点的时间戳
        let today = new Date(new Date().toLocaleDateString()).getTime()
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = '+today+' AND status = 0')
        console.log(vocaTasks)
        return vocaTasks;
    }

    // 获取今日旧词复习任务
    getReviewTasks = ()=>{
        //获取今天0点的时间戳
        let today = new Date(new Date().toLocaleDateString()).getTime()
        let vocaTasks = this.realm.objects('VocaTask').filtered('vocaTaskDate = '+today+' AND status > 0')
        console.log(vocaTasks)
        return vocaTasks;
    }

    // 根据taskOrder获取任务
    getTask = (taskOrder)=>{
        let vocaTask = this.realm.objects('VocaTask').filtered('taskOrder = "'+taskOrder+'"')[0]
        console.log(vocaTask)
        return vocaTask;
    }

    //清空所有
    deleteAllTasks = ()=>{
        this.realm.write(()=>{
            this.realm.deleteAll();
        })
    }

}

