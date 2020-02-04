import { takeLatest, put } from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import ArticleDao from "../../../reading/service/ArticleDao";
import * as Constant from "../../common/constant";
import { store } from "../../../../redux/store";
import { LOAD_TASKS_SUCCEED, LOAD_TASKS_FAIL, LOAD_TASKS_START } from '../action/homeAction';
import {
    CHANGE_VOCA_BOOK_SUCCEED, CHANGE_VOCA_BOOK_FAIL, LOAD_VOCA_BOOKS, CHANGE_VOCA_BOOK, CHANGE_VOCA_BOOK_START, LOAD_VOCA_BOOKS_FAIL, LOAD_VOCA_BOOKS_SUCCEED, LOAD_VOCA_BOOKS_START, MODIFY_LAST_LEARN_DATE,
} from '../action/planAction';
import { CLEAR_PLAY } from '../action/vocaPlayAction';
import VocaTaskService from '../../service/VocaTaskService';
import VocaUtil from "../../common/vocaUtil";
import _util from '../../../../common/util';


/** 提交单词计划 */
export function* createPlan(action) {
    yield put({ type: CHANGE_VOCA_BOOK_START })
    yield put({ type: LOAD_TASKS_START })
    try {
        const res = yield Http.post("/plan/create", action.payload.plan)
        const { plan, words, articles } = res.data
        //清空先前数据，存储新数据到realm
        const vtd = VocaTaskDao.getInstance()
        const artDao = ArticleDao.getInstance()
        vtd.deleteAll()
        artDao.deleteAllArticles()
        vtd.saveBookWords(words)
        artDao.saveArticles(articles)
        //清空未同步任务
        Storage.clearMapForKey('notSyncTasks')


        //加载今日数据 
        const tasks = new VocaTaskService().getTodayTasks(null, plan.taskCount, plan.taskWordCount)
        //构建文章任务
        const articleTasks = VocaUtil.genArticleTasksByVocaTasks(tasks)

        if (store.getState().vocaPlay.task.normalType === Constant.BY_REAL_TASK) {
            yield put({ type: CLEAR_PLAY })
        }
        yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: tasks.concat(articleTasks) } })
        yield put({
            type: CHANGE_VOCA_BOOK_SUCCEED,
            payload: {
                plan
            }
        })
        //加载成功后，修改lastLearnDate
        yield put({ type: MODIFY_LAST_LEARN_DATE, payload: { lastLearnDate: _util.getDayTime(0) } })
    } catch (err) {
        console.log(err)
        yield put({ type: CHANGE_VOCA_BOOK_FAIL })
        yield put({ type: LOAD_TASKS_FAIL })
    }
}





export function* watchPlan() {
    yield takeLatest(CHANGE_VOCA_BOOK, createPlan)
}
