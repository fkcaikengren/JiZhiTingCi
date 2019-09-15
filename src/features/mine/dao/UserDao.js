
const Realm = require('realm');
const uuidv4 = require('uuid/v4');
import AsyncStorage from '@react-native-community/async-storage';

//总结： realm 1对多
// 1. 建表
// 2. 插入 （插入对象，该对象引用的数组对象自动插入；）
// 3. 查询 （关联查询，通过引用获取到数组对象；）
// 4. 修改 （获取到对象，修改属性，自动自动持久化；）
// 5.删除 （获取到对象，便可删除；不会级联删除；）



// 1. token (验证信息)
const AuthSchema = {
    name: 'Auth',
    primaryKey: 'id',
    properties: {
        id: 'string',
        token: 'string?',
        type: 'string?',
        createTime: 'int?'
    }
}

// 2. 用户信息
const UserSchema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',                      //用户id
    nickname: 'string?',
    avatarUrl:'string?',
    phone: 'string?',
    wechat: 'string?',
    qq : 'string?', 
    gender: {type:'bool', default:true},
    birthday: 'int?',
    vocation: 'string?',
    balance: 'int?',
    audioTime: 'int?',
    addableWordsCount: 'int?',
    level: 'int?',               //单词等级
    auths : 'Auth[]',
    createTime: 'int?',

  }
}



export default class UserDao{

    constructor(props){
        this.realm = null
        
    }

    //打开数据库
    async open(){
        try{
            this.realm  = await Realm.open({path: 'User.realm', schema:[ AuthSchema, UserSchema,]})
        }catch(err){
            console.log('创建VocaGroupDao对象失败，原因：打开realm数据库失败')
            console.log(err)
        }
        return this; //返回dao对象
    }

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



    //1. 保存用户信息（user: 用户对象）
    saveUser = (token, user)=>{
        this.realm.write(()=>{
            let u ={
                ...user,
                id:uuidv4(),
                gender:true,
                auths:[],
                createTime:new Date().getTime()
            }
            u.auths.push({id:uuidv4(),token:token,type:'login', createTime:new Date().getTime()});
            console.log(u)
            this.realm.create('User', u);
        })
    }


    //2. 清空用户信息（包括token）
    clearUserInfo =()=>{
        this.realm.write(()=>{
            this.realm.deleteAll()
        })
    }

    //3. 查询登录状态（token）
    getToken = ()=>{
        let obj = this.realm.objects('Auth').filtered('type = "login"')[0]
    
        if(obj){
            return obj.token;
        }
        return null;
    }

    //4. 查询用户信息 
    getUser = ()=>{
        let user = this.realm.objects('User')[0] //不存在返回undefined
        return user
    }
    


}