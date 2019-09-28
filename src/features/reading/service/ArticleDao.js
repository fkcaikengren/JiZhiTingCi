const Realm = require('realm')
const _ = require('lodash');

// 1. 文章表
const ArticleSchema = {
    name: 'Article',
    primaryKey: 'id',
    properties: {
        id: 'int',                      //文章id
        articleUrl: "string?",
        optionUrl: "string?",
        answerUrl: "string?",
        analysisUrl: "string?",
        name: "string?",
        note: "string?",
        keyWords: "string?",
        type: "string?",
    }
};



export default class ArticleDao {

    constructor(){
        this.realm = null
    }

    //单例模式
    static getInstance() {
        if(!this.instance) {
            this.instance = new ArticleDao();
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
                this.realm  = await Realm.open({path: 'Article.realm', schema:[ ArticleSchema]})
                // console.log(this.realm)
            }
        }catch(err){
            console.log('ArticleDao: 创建Article.realm数据库失败')
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
     * 保存文章数据
     * @param articls
     */
    saveArticles = (articls)=>{
        try{
            this.realm.write(()=>{
                for(let art of articls){
                    art.keyWords = JSON.stringify(art.keyWords )
                    this.realm.create('Article', art);
                }
            })
            console.log('articles 保存成功，结束！')
        }catch(e){
            console.log('articles 保存失败！')
            console.log(e)
        }
    }



    /**自定义修改 */
    modify =  (fn)=>{
        this.realm.write(fn)
    }

    /**
     *  查询全部文章
     * @returns {Realm.Results<any> | never}
     */
    getAllArticles = ()=>{
        return this.realm.objects('Article')
    }

    /**
     *  根据id获取文章
     * @param id
     * @returns {*} 获取失败，返回null, 否则返回article
     */
    getArticleById = (id)=>{
        const res = this.realm.objects('Article').filtered('id='+id);
        return res.length?null:res
    }

    /**
     *  根据id批量获取文章
     * @param ids 可以是number数组,也可以是','分割的字符串
     * @returns {Array}
     */
    getArticles = (ids)=>{
        console.log('---获取articles by ids------ids如下：')
        console.log(ids)
        let arr = []
        if(ids){
            try{
                if(typeof ids === 'string'){
                    ids = ids.split(',')
                    ids = ids.map((item,i)=>parseInt(item))
                }
                const len = ids.length
                if(len && len>0){
                    //拼接
                    let str = ''
                    for(let i in ids){
                        if(i==(len-1)){
                            str += 'id='+ids[i];
                        }else{
                            str += 'id='+ids[i]+' OR ';
                        }
                    }
                    let articles = this.realm.objects('Article').filtered(str); //数组
                    //排序
                    arr = _.sortedUniqBy(articles, function(art) {
                        return art.id;
                    });
                    console.log(arr)
                }
    
            }catch (e) {
                console.log(e)
                console.log('ArticleDao : getArticles() Error')
            }
        }
        
       
        return arr
    }


    /**
     *  清空所有任务，清空数据库
     */
    deleteAllArticles = ()=>{
        this.realm.write(()=>{
            this.realm.deleteAll();
        })
    }

}

