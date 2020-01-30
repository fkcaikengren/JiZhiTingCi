import VocaTaskDao from "../src/features/vocabulary/service/VocaTaskDao"
const createPlanData = require('./mock_data/createPlan.json')

const vtd = VocaTaskDao.getInstance()
vtd.open()

// 测试代码
setTimeout(() => {

    /** 测试：保存单词书单词 */
    saveBookWords_test()
    function saveBookWords_test() {
        vtd.saveBookWords(createPlanData.words)
    }



















}, 1000)