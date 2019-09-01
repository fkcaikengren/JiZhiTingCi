import 'react-native'
import VocaDao from '../../src/features/vocabulary/service/VocaDao'
import _util from "../../src/common/util";

const task = {
    taskOrder: 1,
    status: 0,
    vocaTaskDate: _util.getDayTime(0),
    process: 'IN_REVIEW_FINISH',
    curIndex: 0,
    leftTimes: 0,
    delayDays: 0,
    dataCompleted: true,
    createTime: '',
    isSync: true,
    wordCount:15,
    words:[{word: 'apple',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'alike',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'bee', //3
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'share',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'model',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'abandon',  //6
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'pig',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'pretty',
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },{
        word: 'link', //9
        passed: false,
        wrongNum: 0,
        testWrongNum: '',
        enPhonetic: '',
        enPronUrl: '',
        amPhonetic: '',
        amPronUrl: '',
        def: '',
        sentence: '',
        tran: ''
    },
        {
            word: 'magnet',  //10
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        },{
            word: 'market',  //11
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        },{
            word: 'paper',  //12
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        },{
            word: 'phone', //13
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        },
        {
            word: 'computer',  //14
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        },{
            word: 'sir', //15
            passed: false,
            wrongNum: 0,
            testWrongNum: '',
            enPhonetic: '',
            enPronUrl: '',
            amPhonetic: '',
            amPronUrl: '',
            def: '',
            sentence: '',
            tran: ''
        }
    ]
}

const vd = VocaDao.getInstance()
beforeEach(() => {
    //打开数据库
    return vd.open()
});
afterEach(()=>{
    return vd.close()
})



it('查词（模糊查询匹配的前8个单词）', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    let data = vd.searchWord('se')
    console.log(data)
    // expect(data.length).toBeLessThanOrEqual(8)
})


it('获取单词详情', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    let wi = vd.getWordInfo('detail')
    console.log(wi)
})



it('批量获取单词详情', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    let infos = vd.getWordInfos(['detail','miss','sock'])
    console.log(infos)
})

it('查询词根信息', ()=>{
    expect(vd.isOpen()).toBeTruthy()
    let r = vd.getWordRoot(2)
    console.log(r)
    let rs = vd.getWordRoots(r.relatives,3,true)
    console.log(rs)
})


