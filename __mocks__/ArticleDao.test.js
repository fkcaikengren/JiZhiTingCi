

import ArticleDao from '../src/features/reading/service/ArticleDao'
const createPlanData = require('./mock_data/createPlan.json.js.js')
const artDao = ArticleDao.getInstance()
artDao.open()


// 测试代码
setTimeout(() => {

    /** 测试：保存文章 */
    // saveArticles_test()
    function saveArticles_test() {
        artDao.saveArticles(createPlanData.articles)
    }


    /** 测试：获取今日文章 */
    // getTodayArticles_test()
    function getTodayArticles_test() {
        const arts = artDao.getTodayArticles(16, 30)
        console.log(arts)
    }

    /** 测试：根据id批量获取文章 */
    // getArticlesById_test()
    function getArticlesById_test() {
        const arts = artDao.getArticlesById(['5e2fd2e3d443c44e544f9e39', '5e2fd2e3d443c44e544f9e38'])
        console.log(arts)
    }


}, 1000)