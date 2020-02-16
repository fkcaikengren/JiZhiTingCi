import { takeLatest, put } from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';
import ArticleDao from "../../../reading/service/ArticleDao";
import * as Constant from "../../common/constant";
import { store } from "../../../../redux/store";
import { LOAD_TASKS_SUCCEED, LOAD_TASKS_FAIL, LOAD_TASKS_START } from '../action/homeAction';
import {
    CHANGE_VOCA_BOOK, CHANGE_VOCA_BOOK_START,
    CHANGE_VOCA_BOOK_SUCCEED, CHANGE_VOCA_BOOK_FAIL,
    MODIFY_LAST_LEARN_DATE, MODIFY_PLAN, MODIFY_PLAN_START, MODIFY_PLAN_SUCCEED, MODIFY_PLAN_FAIL,
} from '../action/planAction';
import { CLEAR_PLAY } from '../action/vocaPlayAction';
import VocaTaskService from '../../service/VocaTaskService';
import VocaUtil from "../../common/vocaUtil";
import _util from '../../../../common/util';


/** 创建单词计划 */
export function* createPlan(action) {
    yield put({ type: CHANGE_VOCA_BOOK_START })
    yield put({ type: LOAD_TASKS_START })
    try {
        const res = yield Http.post("/plan/create", action.payload.plan)
        if (res.status === 200) {
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

            const vts = new VocaTaskService()
            //加载今日数据 
            const tasks = vts.getTodayTasks(null, plan.taskCount, plan.taskWordCount)
            //构建文章任务
            const articleTasks = VocaUtil.genArticleTasksByVocaTasks(
                tasks.filter((item, i) => item.status === Constant.STATUS_0)
            )
            // 计算剩余天数
            const leftDays = vts.countLeftDays(plan.taskCount, plan.taskWordCount)

            if (store.getState().vocaPlay.task.normalType === Constant.BY_REAL_TASK) {
                yield put({ type: CLEAR_PLAY })
            }
            yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: tasks.concat(articleTasks) } })
            yield put({
                type: CHANGE_VOCA_BOOK_SUCCEED,
                payload: {
                    plan,
                    leftDays
                }
            })
            //加载成功后，修改lastLearnDate
            yield put({ type: MODIFY_LAST_LEARN_DATE, payload: { lastLearnDate: _util.getDayTime(0) } })
        } else {
            yield put({ type: CHANGE_VOCA_BOOK_FAIL })
            yield put({ type: LOAD_TASKS_FAIL })
        }


    } catch (err) {
        console.log(err)
        yield put({ type: CHANGE_VOCA_BOOK_FAIL })
        yield put({ type: LOAD_TASKS_FAIL })
    }
}

/** 修改计划 */
export function* modifyPlan(action) {
    yield put({ type: MODIFY_PLAN_START })
    try {
        const res = yield Http.post("/plan/modify", action.payload.plan)
        if (res.status === 200) {
            yield put({
                type: MODIFY_PLAN_SUCCEED,
                payload: {
                    plan: res.data,
                    leftDays: action.payload.leftDays
                }
            })
        } else {
            yield put({ type: MODIFY_PLAN_FAIL })
        }
    } catch (err) {
        console.log(err)
        yield put({ type: MODIFY_PLAN_FAIL })
    }

}

/** 统计和上传 allLearnedDays */
export function* syncAllLearnedDays(action) {

    // const myHttp = createHttp(null, { shouldRefreshToken: true })
}
/** 统计和上传 allLearnedCount、 finishDays */
export function* synFinishDays(action) {
    //allFinishDays notSynFinishDays
    // const myHttp = createHttp(null, { shouldRefreshToken: true })
}




export function* watchCreatePlan() {
    yield takeLatest(CHANGE_VOCA_BOOK, createPlan)
}

export function* watchModifyPlan() {
    yield takeLatest(MODIFY_PLAN, modifyPlan)
}
