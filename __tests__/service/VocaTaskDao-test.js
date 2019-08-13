
import 'react-native'
import VocaTaskDao from "../../src/features/vocabulary/service/VocaTaskDao";

const vtd = new VocaTaskDao()
beforeEach(() => {
    return vtd.open()
});
afterEach(()=>{
    return vtd.close()
})

it('查询全部任务', ()=>{
    console.log(vtd.getAllTasks())
})

it('getTodayTasks ', ()=>{
    console.log(vtd.getTodayTasks())
})

it('获取已学的任务', ()=>{
    let ts = vtd.getLearnedTasks()
    // console.log(ts)
    for(let t of ts){
        console.log(t.words)
    }
})

it('查询错误频数=n 的单词', ()=>{
    let n = 1
    let words = vtd.getWordsEqWrongNum(n)
    for(let w of words){
        console.log(w)
    }
})


it('查询错误频数>=n 的单词', ()=>{
    let n = 2
    let words = vtd.getWordsGEWrongNum(n)
    for(let w of words){
        console.log(w)
    }
})

it('获取错词列表数据', ()=>{
    const wrongArr = []
    for(let i=1; i<5; i++){
        //查询
        let words = vtd.getWordsEqWrongNum(i)
        wrongArr.push({
            isHeader: true,
            checked:false,
            title: `答错${i}次, 共${words.length}词`
        })
        for(let w of words){
            wrongArr.push({
                isHeader: false,
                checked:false,
                content: w,
            })
        }
    }

    console.log(wrongArr)

})