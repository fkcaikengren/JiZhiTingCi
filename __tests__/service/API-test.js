import 'react-native'
import {createHttp} from "../../src/common/http";

let myhttp = null

beforeEach(()=>{
    myhttp = createHttp()
})

it('获取全部书籍信息',async ()=>{
    const res = await myhttp.get('/vocaBook/getAll')
    console.log(res.data.data)
})

it('提交计划, tasks存入realm',async ()=>{
    let params = {
        taskCount: '1',
        taskWordCount: '15',
        bookCode: 'VB_20'
    }
    const res = await myhttp.post('/plan/putPlan',params)
    // console.log(res.data.data)  {plan, tasks}
    const tasks = res.data.data.tasks
    console.log(tasks[0])
    //任务存入realm

}, 10000)