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
    SYN_ALL_LEARNED_DAYS, SYN_ALL_LEARNED_DAYS_START, SYN_ALL_LEARNED_DAYS_SUCCEED, SYN_ALL_LEARNED_DAYS_FAIL,
    SYN_FINISH_DAYS, SYN_FINISH_DAYS_START, SYN_FINISH_DAYS_SUCCEED, SYN_FINISH_DAYS_FAIL
} from '../action/planAction';
import { CLEAR_PLAY } from '../action/vocaPlayAction';
import VocaTaskService from '../../service/VocaTaskService';
import VocaUtil from "../../common/vocaUtil";
import _util from '../../../../common/util';
import createHttp from '../../../../common/http';
import FileService from '../../../../common/FileService';
import { VOCABULARY_DIR } from '../../../../common/constant';



/** 创建单词计划 */
export function* createPlan(action) {

    try {
        const res = yield Http.post("/plan/create", action.payload.plan)
        if (res.status === 200) {
            store.getState().app.toast.show('保存数据中...', 1500)
            const vts = new VocaTaskService()
            const { plan, words, articles } = res.data
            const { curBookId, allLearnedCount } = action.payload.plan

            // 学过的单词书+1，已学单词书中学过的单词数量
            if (curBookId) {
                Storage.load({ key: 'finishedBooks' }).then(finishedBooks => {
                    finishedBooks.push(curBookId)
                    Storage.save({
                        key: 'finishedBooks',
                        data: finishedBooks
                    })
                }).catch(err => console.log(err))
            }

            //加载今日数据 并且设置登录进入首页变量=false
            if (IsLoginToHome) {
                IsLoginToHome = false
            }



            //1.保存数据
            const vtd = VocaTaskDao.getInstance()
            const artDao = ArticleDao.getInstance()
            //清空先前数据，存储新数据到realm
            vtd.deleteAll()
            artDao.deleteAllArticles()
            console.log('dao 删除数据ok')
            vtd.saveBookWords(words)
            artDao.saveArticles(articles)
            console.log('dao 保存数据ok')
            //清空未同步任务
            Storage.clearMapForKey('notSyncTasks')





            // 2.获取今日数据
            const tasks = vts.getTodayTasks(null, plan.taskCount, plan.taskWordCount)
            //构建文章任务
            const articleTasks = VocaUtil.genArticleTasksByVocaTasks(
                tasks.filter((item, i) => item.status === Constant.STATUS_0)
            )
            if (store.getState().vocaPlay.task.normalType === Constant.BY_REAL_TASK) {
                yield put({ type: CLEAR_PLAY })
            }


            // 3.改变计划状态
            const leftDays = vts.countLeftDays(plan.taskCount, plan.taskWordCount)  // 计算剩余天数
            const bookCoverSource = yield FileService.getInstance().load(VOCABULARY_DIR, plan.bookCoverUrl)
            yield put({
                type: CHANGE_VOCA_BOOK_SUCCEED,
                payload: {
                    plan,
                    leftDays,
                    finishedBooksWordCount: allLearnedCount,
                    bookCoverSource,
                }
            })
            //回调
            action.payload.callback()

            yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: tasks.concat(articleTasks) } })
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
    const { allLearnedDays } = action.payload
    console.log('--saga---allLearnedDays:' + allLearnedDays)
    try {
        yield put({
            type: SYN_ALL_LEARNED_DAYS_START, payload: {
                allLearnedDays,
                learnedTodayFlag: _util.getDayTime(0)
            }
        })
        const myHttp = createHttp(null, { shouldRefreshToken: true })
        const res = yield myHttp.post('/statistic/modifyAllLearnedDays', {
            allLearnedDays
        })
        if (res.status === 200) {
            console.log(res.data)
            yield put({ type: SYN_ALL_LEARNED_DAYS_SUCCEED })
        } else {
            yield put({ type: SYN_ALL_LEARNED_DAYS_FAIL })
        }
    } catch (err) {
        console.log(err)
        yield put({ type: SYN_ALL_LEARNED_DAYS_FAIL })
    }
}
/** 统计和上传 allLearnedCount、 finishDays */
export function* synFinishDays(action) {

    const fDates = _util.formateTimestamp(_util.getDayTime(0))
    console.log('---saga---finishDays :' + fDates[0])
    try {
        yield put({
            type: SYN_FINISH_DAYS_START, payload: {
                allLearnedCount: action.payload.allLearnedCount
            }
        })
        //获取全部打卡数据
        let allAddedFinishDays = yield Storage.getAllDataForKey('addedFinishDays')
        allAddedFinishDays = allAddedFinishDays.concat(fDates[0])
        //存储今日打卡数据
        Storage.save({
            key: 'finishDays',
            id: fDates[0],
            data: fDates[0]
        });

        const myHttp = createHttp(null, { shouldRefreshToken: true })
        //1.同步已学单词总数
        const res1 = yield myHttp.post('/statistic/modifyAllLearnedCount', {
            allLearnedCount: action.payload.allLearnedCount,
        })
        //2.同步打卡天数
        const res2 = yield myHttp.post('/statistic/addFinishDays', {
            addedFinishDays: allAddedFinishDays,
        })

        if (res2.status === 200) { //成功则清空打卡数据
            console.log('清空addedFinishDays')
            Storage.clearMapForKey('addedFinishDays')
            yield put({ type: SYN_FINISH_DAYS_SUCCEED })
        } else {                  //失败则保存打卡数据
            Storage.save({
                key: 'addedFinishDays',
                id: fDates[0],
                data: fDates[0]
            });
            yield put({ type: SYN_FINISH_DAYS_FAIL })
        }
    } catch (err) {
        Storage.save({
            key: 'addedFinishDays',
            id: fDates[0],
            data: fDates[0]
        });
        yield put({ type: SYN_FINISH_DAYS_FAIL })
    }


}



export function* watchCreatePlan() {
    yield takeLatest(CHANGE_VOCA_BOOK, createPlan)
}

export function* watchModifyPlan() {
    yield takeLatest(MODIFY_PLAN, modifyPlan)
}

export function* watchSyncAllLearnedDays() {
    yield takeLatest(SYN_ALL_LEARNED_DAYS, syncAllLearnedDays)
}

export function* watchSynFinishDays() {
    yield takeLatest(SYN_FINISH_DAYS, synFinishDays)
}
