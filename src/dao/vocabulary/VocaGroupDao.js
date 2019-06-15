
const Realm = require('realm');
const uuidv4 = require('uuid/v4');


//总结： realm 1对多
// 1. 建表

// 2. 插入 （插入对象，该对象引用的数组对象自动插入；）

// 3. 查询 （关联查询，通过引用获取到数组对象；）

// 4. 修改 （获取到对象，修改属性，自动自动持久化；）

// 5.删除 （获取到对象，便可删除；不会级联删除；）



// 1. 生词本表
const VocaGroupSchema = {
  name: 'VocaGroup',
  primaryKey: 'id',
  properties: {
    id: 'string',                      //生词本id
    groupName: 'string?',           //生词本名称
    count: {type:'int', optional:true, default:0},                //生词数
    createTime: 'int?',  
    isDefault: {type: 'bool',optional:true, default: false},     //是否是默认生词本
    sections: 'GroupSection[]'              //list类型：生词分类
  }
};

//2. 生词分类表（字母分类，或章节分类）
const GroupSectionSchema = {
    name: 'GroupSection',
    primaryKey: 'id',
    properties: {
      id: 'string',                      
      section: 'string?',
      words: 'GroupWord[]',             //list类型：生词列表    
    }
  };


// 3. 生词表
const GroupWordSchema = {
  name: 'GroupWord',
  primaryKey: 'id',
  properties: {
    id: 'string',                      
    word: 'string?',
    isHidden: {type: 'bool', optional:true, default: false},
    enPhonetic: 'string?',
    enPhoneticUrl: 'string?',
    amPhonetic: 'string?',
    amPhoneticUrl: 'string?',
    tran: 'string?'
  }
};


export default class VocaGroupDao{

    constructor(props){
        this.realm = null
        
    }

    //打开数据库
    async open(){
        try{
            this.realm  = await Realm.open({path: 'VocaGroup.realm', schema:[ GroupWordSchema,GroupSectionSchema, VocaGroupSchema]})
        }catch(err){
            console.log('创建VocaGroupDao对象失败，原因：打开realm数据库失败')
            console.log(err)
        }
        return ;
    }
 
    //关闭数据库
    close = ()=>{
        if(!this.realm && !this.realm.isClosed){
            this.realm.close()
            this.realm = null
        }
    }



    //1. 添加生词本
    addGroup = (groupName)=>{
        let group = {
            id: uuidv4(),                    //生词本id ()
            groupName: groupName,           //生词本名称
            // count: 0,               //生词数
            createTime: new Date().getTime(),       
            // sections: ,            //list类型：生词列表     
        }
        this.realm.write(()=>{
            this.realm.create('VocaGroup', group);
        })
    }
    
    //2. 修改生词本名
    updateGroupName = (oldName, newName)=>{
        this.realm.write(()=>{
            let group = this.realm.objects('VocaGroup').filtered('groupName = "'+oldName+'"')[0];
            group.groupName = newName;
        })
    }
    // updateGroup('Alice wondering', 'Jacy’Book')
    
    //3. 删除生词本 （？？？需要删除下面的单词）
    deleteGroup = (groupName)=>{
        this.realm.write(()=>{
            let group = this.realm.objects('VocaGroup').filtered('groupName = "'+groupName+'"')[0];
            this.realm.delete(group);
        })
    }
    
    
    //4. 查询所有生词本
    getAllGroups = ()=>{
        console.log('this.realm')
        console.log(this.realm)
        let groups = this.realm.objects('VocaGroup');
        console.log(groups);  //undefined (当没有数据时)
        return groups;
    }
    
    
    
    
    //5. 修改为默认生词本
    updateToDefault = (groupName)=>{
        this.realm.write(()=>{
            let group = this.realm.objects('VocaGroup').filtered('groupName = "'+groupName+'"')[0];
            if(group){
                group.isDefault = true;
            }else{
                console.log('更新生词本名称，未查找到')
            }
        })
    }

    
    // 6. 添加生词到默认生词本
    addWordToDefault = (groupWord)=>{
        this.realm.write(()=>{
            //判断groupWord 所在的分组（即判断第一个字母）
            let isSaved = false
            let firstChar = groupWord.word[0].toUpperCase()
            let defaultGroup = this.realm.objects('VocaGroup').filtered('isDefault = true')[0];
            for(let s of defaultGroup.sections){
                if(s.section === firstChar){
                    //存入
                    s.words.push({...groupWord, id:uuidv4()})
                    defaultGroup.count++;
                    isSaved = true
                }
            }
            if(!isSaved){
                //创建分组，并存入
                let newSection = 
                    {id:uuidv4(), 
                    section:firstChar, 
                    words:[{...groupWord, id:uuidv4()}]
                }
                defaultGroup.sections.push(newSection);
                defaultGroup.count++;
            }
            
        })
    }
    
    //7. 删除指定生词本下的单词 sections:删除的数组）
    deleteWords = (groupName, words)=>{
        let group = this.realm.objects('VocaGroup').filtered('groupName = "'+groupName+'"')[0];
        
            for(let s of group.sections){
                for(let w of s.words){
                    if(words.includes(w.word) ){
                        //先删单词
                        this.realm.delete(w);
                    }
                    //判断是否要删sections
                    if(s.words.length == 0){
                        this.realm.delete(s)
                    }
                }
            }
            
    }


    
    //删除所有生词本
    deleteAllGroups = ()=>{
        this.realm.write(()=>{
            this.realm.deleteAll();
        })
    }


}