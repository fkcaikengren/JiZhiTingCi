

import ArticleService from '../src/features/reading/service/ArticleService'
const createPlanData = require('./mock_data/createPlan.json')
const artService = new ArticleService()
artService.artDao.open()

// 测试代码
setTimeout(() => {

    /** 测试：获取文章详情 */
    getArticlesInfo_test()
    function getArticlesInfo_test() {
        const res = artService.getArticlesInfo([{
            id: '5e2fd2e3d443c44e544f9e31',
            score: 0
        }])
        console.log(res[0])
    }


}, 1000)