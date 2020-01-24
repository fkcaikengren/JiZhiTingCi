import { takeLatest, put } from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import ArticleDao from "../../../reading/service/ArticleDao";
import VocaUtil from "../../common/vocaUtil";
import * as Constant from "../../common/constant";
import { store } from "../../../../redux/store";
import { LOAD_TASKS_SUCCEED, LOAD_TASKS_FAIL, LOAD_TASKS_START } from '../action/homeAction';
import { CHANGE_VOCA_BOOK_SUCCEED, CHANGE_VOCA_BOOK_FAIL, LOAD_VOCA_BOOKS, CHANGE_VOCA_BOOK, CHANGE_VOCA_BOOK_START, LOAD_VOCA_BOOKS_FAIL, LOAD_VOCA_BOOKS_SUCCEED, LOAD_VOCA_BOOKS_START } from '../action/planAction';
import { CLEAR_PLAY } from '../action/vocaPlayAction';


/** 提交单词计划 */
export function* createPlan(action) {
    const { plan, totalWordCount } = action.payload
    yield put({ type: CHANGE_VOCA_BOOK_START })
    yield put({ type: LOAD_TASKS_START })
    try {
        const res = yield Http.post("/plan/create", plan)
        const { vocaTasks, articles } = res.data
        //清空先前数据，存储新数据到realm
        const vtDao = VocaTaskDao.getInstance()
        const artDao = ArticleDao.getInstance()
        vtDao.deleteAllTasks()
        artDao.deleteAllArticles()
        vtDao.saveVocaTasks(vocaTasks, plan.taskWordCount)
        artDao.saveArticles(articles)
        //加载今日数据
        const rawTasks = VocaUtil.loadTodayRawTasks(null, plan.taskCount, plan.lastLearnDate)
        if (store.getState().vocaPlay.task.normalType === Constant.BY_REAL_TASK) {
            yield put({ type: CLEAR_PLAY })
        }
        yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: rawTasks } })
        yield put({
            type: CHANGE_VOCA_BOOK_SUCCEED,
            payload: {
                plan,
                totalWordCount,
                totalDays: vocaTasks.length + Constant.LEFT_PLUS_DAYS,
                leftDays: vocaTasks.length + Constant.LEFT_PLUS_DAYS,
            }
        })
    } catch (err) {
        console.log(err)
        yield put({ type: CHANGE_VOCA_BOOK_FAIL })
        yield put({ type: LOAD_TASKS_FAIL })
    }
}



export function* watchPlan() {
    yield takeLatest(CHANGE_VOCA_BOOK, createPlan)
}
