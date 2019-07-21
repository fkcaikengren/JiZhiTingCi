import {take, put, call} from 'redux-saga/effects'


/**获取单词书 */
export function * getVocaBooks(){
    yield put({type:'LOAD_VOCA_BOOKS_START'})
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
    try{
        const res = yield Http.post("/plan/putPlan",params)
        console.log(res.data.data);
        yield put({type:'CHANGE_VOCA_BOOK_SUCCEED', plan:res.data.data.plan})
        yield put({type:'LOAD_TASKS_SUCCEED', tasks:res.data.data.tasks })
    }catch(err){
        yield put({type:'CHANGE_VOCA_BOOK_FAIL'})
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

        const {bookCode, taskCount, taskWordCount} = yield take('CHANGE_VOCA_BOOK')
        yield call(postPlan, {bookCode, taskCount, taskWordCount})
      }
}
export default watchVocaLib
