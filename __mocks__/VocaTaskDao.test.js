import VocaTaskDao from "../src/features/vocabulary/service/VocaTaskDao"
const createPlanData = require('./mock_data/createPlan.json')

const vtd = VocaTaskDao.getInstance()
vtd.open()

// 测试代码
setTimeout(() => {

    /** 测试：保存单词书单词 */
    // saveBookWords_test()
    function saveBookWords_test() {
        vtd.saveBookWords(createPlanData.words)
    }


    /**测试：获取单词书单词 */
    getBookWordsByWordId_test()
    function getBookWordsByWordId_test() {
        const res = vtd.getBookWordsByWordId(2078, 2079)
        console.log(res)
    }





}, 1000)