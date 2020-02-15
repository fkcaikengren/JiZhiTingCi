
import _util from '../../../common/util'
import ArticleDao from './ArticleDao';
import VocaUtil from '../../vocabulary/common/vocaUtil';
import VocaTaskDao from '../../vocabulary/service/VocaTaskDao';
import { TASK_ARTICLE_TYPE } from '../../vocabulary/common/constant';


export default class ArticleService {

    constructor() {
        this.artDao = ArticleDao.getInstance()
        this.artDao.open()
        this.vtd = VocaTaskDao.getInstance()
        this.vtd.open()
    }
    /**
     * 关闭数据库
     */
    closeRealm() {
        this.artDao.close()
    }

    /**
     * 批量保存Article 
     * @param articls
     */
    saveArticles(articls) {
        this.artDao.saveArticles()
    }

    /**
     * 通过TaskArticle数组的获取Article详细信息数组
     * @param {*} taskArticles 
     * @returns {Array}
     */
    getArticlesInfo(taskArticles) {
        const newTaskArticles = []
        const articleIds = taskArticles.map((item, i) => item.id)
        const articles = this.artDao.getArticlesById(articleIds)
        for (let article of articles) {
            const copyArticle = VocaUtil.copyArticleDeep(article)
            for (let ta of taskArticles) {
                if (ta.id === copyArticle.id) {
                    const bWords = this.vtd.getBookWordsByWordId(copyArticle.startWordId, copyArticle.endWordId) //获取单词
                    const keyWords = bWords.map((item, i) => item.word)
                    newTaskArticles.push({
                        ...ta,
                        ...copyArticle,
                        keyWords,
                        taskType: TASK_ARTICLE_TYPE
                    })
                    break
                }
            }
        }
        return newTaskArticles
    }

}

