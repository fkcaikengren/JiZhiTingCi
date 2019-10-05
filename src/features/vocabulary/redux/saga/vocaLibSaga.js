import {take, put, call} from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import VocaTaskService from '../../service/VocaTaskService';
import ArticleDao from "../../../reading/service/ArticleDao";
import VocaUtil from "../../common/vocaUtil";
import * as Constant from "../../common/constant";


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
        const {tasks, plan, articles } = res.data.data
        console.log(articles)
        //清空先前数据，存储新数据到realm
        const vtd = VocaTaskDao.getInstance()
        const artDao = ArticleDao.getInstance()
        vtd.deleteAllTasks()
        artDao.deleteAllArticles()
        vtd.saveVocaTasks(tasks, params.taskWordCount)
        artDao.saveArticles(articles)
        //加载今日数据
        const rawTasks = VocaUtil.loadTodayRawTasks(null, params.taskCount, params.lastLearnDate)
        yield put({type:'CLEAR_PLAY'})
        yield put({type:'LOAD_TASKS_SUCCEED', payload:{tasks:rawTasks}})
        yield put({type:'CHANGE_VOCA_BOOK_SUCCEED', plan:plan,
            totalDays:tasks.length+Constant.LEFT_PLUS_DAYS,
            totalWordCount:params.totalWordCount
        })
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

        const action  = yield take('CHANGE_VOCA_BOOK')
        console.log(action)
        yield call(postPlan,action.payload)
    }
}
export default watchVocaLib
