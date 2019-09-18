import {take, put, call} from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import VocaTaskService from '../../service/VocaTaskService';


/**获取单词书 */
export function * getVocaBooks(){
    yield put({type:'LOAD_VOCA_BOOKS_START'})
    console.log(Http)
    try{
        const res = yield Http.get("/vocaBook/getAll")
        console.log(res);           //返回的是结果对象response，不是一个promise
        console.log(res.data.data);
        yield put({type:'LOAD_VOCA_BOOKS_SUCCEED', books:res.data.data.books})
    }catch(err){
        yield put({type:'LOAD_VOCA_BOOKS_FAIL'})
    }
}

/**提交单词计划 */
export function * postPlan(params){
    yield put({type:'CHANGE_VOCA_BOOK_START'})
    yield put({type:'LOAD_TASKS_START'})
    try{
        const res = yield Http.post("/plan/putPlan",params)
        const {tasks, plan } = res.data.data
        //清空先前数据，存储新数据到realm
        const vtd = VocaTaskDao.getInstance()
        vtd.deleteAllTasks()
        vtd.saveVocaTasks(tasks, params.taskWordCount)
        //加载今日数据
        const todayTasks = new VocaTaskService().getTodayTasks(null)
        yield put({type:'LOAD_TASKS_SUCCEED', payload:{tasks:todayTasks}})
        yield put({type:'CHANGE_VOCA_BOOK_SUCCEED', plan:plan})
    }catch(err){
        yield put({type:'CHANGE_VOCA_BOOK_FAIL'})
        yield put({type:'LOAD_TASKS_FAIL'})
    }
}


/**修改单词计划 */
export function * modifyPlan(){
    yield put({type:'MODIFY_PLAN'})
}


/**watch saga */
function * watchVocaLib(){
    while (true) {
        yield take('LOAD_VOCA_BOOKS')
        yield call(getVocaBooks)

        const action_1  = yield take('CHANGE_VOCA_BOOK')
        console.log(action_1)
        yield call(postPlan,action_1.payload)
      }
}
export default watchVocaLib
