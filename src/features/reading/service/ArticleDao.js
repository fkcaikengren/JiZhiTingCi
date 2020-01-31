const Realm = require('realm')
const _ = require('lodash');

// 1. 文章表
const ArticleSchema = {
    name: 'Article',
    primaryKey: 'id',
    properties: {
        id: 'string?',                      //文章id
        articleUrl: "string?",
        optionUrl: "string?",
        answerUrl: "string?",
        analysisUrl: "string?",
        name: "string?",
        note: "string?",
        type: "string?",
        startWordId: "int?",
        endWordId: "int?"
    }
};



export default class ArticleDao {

    constructor() {
        this.realm = null
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new ArticleDao();
        }
        return this.instance;
    }

    /**
     * 打开数据库
     * @returns {Promise<null>}
     */
    async open() {
        try {
            if (!this.realm) {
                this.realm = await Realm.open({ path: 'Article.realm', schema: [ArticleSchema] })
            }
        } catch (err) {
            console.log('ArticleDao: 创建Article.realm数据库失败')
            console.log(err)
        }
        return this.realm;
    }

    /**
     * 判断数据库是否关闭
     * @returns {boolean}
     */
    isOpen() {
        return (this.realm !== null)
    }

    /**
     * 关闭数据库
     */
    close() {
        if (this.realm && !this.realm.isClosed) {
            this.realm.close()
            this.realm = null
        }
    }

    /**
     * 保存文章数据
     * @param articls
     */
    saveArticles(articls) {
        try {
            this.realm.write(() => {
                for (let art of articls) {
                    art.id = art._id
                    this.realm.create('Article', art);
                }
            })
            console.log('articles 保存成功，结束！')
        } catch (e) {
            console.log('articles 保存失败！')
            console.log(e)
        }
    }


    /**
     * 自定义修改
     */
    modify(fn) {
        this.realm.write(fn)
    }

    /**
    *  查询全部文章
    * @returns {Realm.Results<any>}
    */
    getAllArticles() {
        return this.realm.objects('Article') || []
    }

    getTodayArticles(startId, endId) {
        return this.realm.objects('Article').filtered('endWordId >= ' + startId + ' AND endWordId <= ' + endId)
    }


    /**
     *  根据id批量获取文章
     * @param userArticles 用户的文章数组 
     * @returns {Array}
     */
    getArticlesById(ids) {
        if (!ids) {
            return []
        }
        let arr = []
        try {
            const len = ids.length
            if (len && len > 0) {
                //拼接
                let str = ''
                for (let i in ids) {
                    if (i == (len - 1)) {
                        str += 'id="' + ids[i] + '"'
                    } else {
                        str += 'id="' + ids[i] + '" OR '
                    }
                }
                let articles = this.realm.objects('Article').filtered(str); //数组
                //排序
                arr = _.sortedUniqBy(articles, function (art) {
                    return art.id;
                });

            }

        } catch (e) {
            console.log(e)
            console.log('ArticleDao :  根据id批量获取articles失败')
        }
        return arr
    }



    /**
     *  清空所有任务，清空数据库
     */
    deleteAllArticles() {
        this.realm.write(() => {
            this.realm.deleteAll();
        })
    }

}
