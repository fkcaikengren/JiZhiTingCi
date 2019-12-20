import { take, put, call } from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import ArticleDao from "../../../reading/service/ArticleDao";
import VocaUtil from "../../common/vocaUtil";
import * as Constant from "../../common/constant";
import { store } from "../../../../redux/store";
import { LOAD_TASKS_SUCCEED, LOAD_TASKS_FAIL, LOAD_TASKS_START } from '../action/homeAction';
import { CHANGE_VOCA_BOOK_SUCCEED, CHANGE_VOCA_BOOK_FAIL, LOAD_VOCA_BOOKS, CHANGE_VOCA_BOOK, CHANGE_VOCA_BOOK_START, LOAD_VOCA_BOOKS_FAIL, LOAD_VOCA_BOOKS_SUCCEED, LOAD_VOCA_BOOKS_START } from '../action/vocaLibAction';
import { CLEAR_PLAY } from '../action/vocaPlayAction';


/**获取单词书 */
export function* getVocaBooks() {
    yield put({ type: LOAD_VOCA_BOOKS_START })

    try {
        const res = yield Http.get("/vocaBook/list")
        console.log('----获取全部单词书-----')
        console.log(res.data);           //返回的是结果对象response，不是一个promise
        yield put({ type: LOAD_VOCA_BOOKS_SUCCEED, books: res.data })
    } catch (err) {
        yield put({ type: LOAD_VOCA_BOOKS_FAIL })
    }
}

/**提交单词计划 */
export function* createPlan(params) {
    yield put({ type: CHANGE_VOCA_BOOK_START })
    yield put({ type: LOAD_TASKS_START })
    try {
        const res = yield Http.post("/plan/create", params)
        const { vocaTasks, plan, articles } = res.data
        //清空先前数据，存储新数据到realm
        const vtDao = VocaTaskDao.getInstance()
        const artDao = ArticleDao.getInstance()
        vtDao.deleteAllTasks()
        artDao.deleteAllArticles()
        vtDao.saveVocaTasks(vocaTasks, params.taskWordCount)
        artDao.saveArticles(articles)
        //加载今日数据
        const rawTasks = VocaUtil.loadTodayRawTasks(null, params.taskCount, params.lastLearnDate)
        if (store.getState().vocaPlay.task.normalType === Constant.BY_REAL_TASK) {
            yield put({ type: CLEAR_PLAY })
        }
        yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: rawTasks } })
        yield put({
            type: CHANGE_VOCA_BOOK_SUCCEED, 
            plan: plan,
            totalDays: tasks.length + Constant.LEFT_PLUS_DAYS,
            totalWordCount: params.totalWordCount
        })
    } catch (err) {
        yield put({ type: CHANGE_VOCA_BOOK_FAIL })
        yield put({ type: LOAD_TASKS_FAIL })
    }
}


/**修改单词计划 */


/**watch saga */
function* watchVocaLib() {
    while (true) {
        yield take(LOAD_VOCA_BOOKS)
        yield call(getVocaBooks)

        const { type, payload } = yield take(CHANGE_VOCA_BOOK)
        yield call(createPlan, payload)
    }
}
export default watchVocaLib
