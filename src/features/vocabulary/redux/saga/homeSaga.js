import { put, takeLatest } from 'redux-saga/effects'
import VocaTaskDao from "../../service/VocaTaskDao";
import { COMMAND_MODIFY_TASK } from '../../../../common/constant';
import {
    LOAD_TASKS, LOAD_TASKS_START, LOAD_TASKS_SUCCEED, LOAD_TASKS_FAIL, SYNC_TASK, SYNC_TASK_START, SYNC_TASK_SUCCEED, SYNC_TASK_FAIL,
} from '../action/homeAction';
import createHttp from '../../../../common/http'
import VocaUtil from "../../common/vocaUtil";
import _util from '../../../../common/util';
import { MODIFY_LAST_LEARN_DATE, CHANGE_LEFT_DAYS, CHANGE_LEARNED_WORD_COUNT } from '../action/planAction';
import VocaTaskService from '../../service/VocaTaskService';
import { STATUS_0 } from '../../common/constant';
const uuidv4 = require('uuid/v4');

/**
 * 加载今日任务 
 */
export function* loadTasks(action) {
    console.log('--------------saga  loadTasks------------------------')
    const { lastLearnDate, taskCount, taskWordCount } = action.payload
    yield put({ type: LOAD_TASKS_START })
    try {
        const vts = new VocaTaskService()
        // 修改今日任务
        const tasks = vts.getTodayTasks(lastLearnDate, taskCount, taskWordCount)
        const articleTasks = VocaUtil.genArticleTasksByVocaTasks(
            tasks.filter((item, i) => item.status === STATUS_0)
        )
        yield put({ type: LOAD_TASKS_SUCCEED, payload: { tasks: tasks.concat(articleTasks) } })
        //修改剩余学习天数
        const leftDays = vts.countLeftDays(taskCount, taskWordCount)
        console.log('leftDays==============================' + leftDays)
        yield put({ type: CHANGE_LEFT_DAYS, payload: { leftDays } })
        //修改已学单词
        const learnedWordCount = vts.countLearnedWords()
        console.log('learnedWordCount===========================' + learnedWordCount)
        yield put({ type: CHANGE_LEARNED_WORD_COUNT, payload: { learnedWordCount } })
        //加载成功后，修改上次学习日期lastLearnDate 
        yield put({ type: MODIFY_LAST_LEARN_DATE, payload: { lastLearnDate: _util.getDayTime(0) } })
    } catch (err) {
        console.log(err)
        yield put({ type: LOAD_TASKS_FAIL })
    }
}

/**
 * 上传单词任务 
 */
export function* syncTask(action) {
    let curUploadedTask = action.payload
    try {
        //1. 取之前没有上传的数据
        let uploadedTasks = yield Storage.getAllDataForKey('notSyncTasks')
        //2. 同步至本地
        if (curUploadedTask && curUploadedTask.command) {
            const { data, command } = curUploadedTask
            //修改任务
            if (command === COMMAND_MODIFY_TASK) {
                // 数据更新到本地realm数据库
                VocaTaskDao.getInstance().modifyTask(data)
                // 合并本次上传的数据 (对于同步整个单词任务时而言)
                uploadedTasks = uploadedTasks.filter((item, i) => {
                    if (item.command === curUploadedTask.command && item.data.taskOrder === curUploadedTask.data.taskOrder) {
                        return false
                    } else {
                        return true
                    }
                })
            }
            //加入上传任务中
            uploadedTasks.push(curUploadedTask)
        }
        console.log('-------所有上传的的数据：-------------')
        console.log(uploadedTasks)
        //3. 成功则清空
        if (uploadedTasks && uploadedTasks.length > 0) {
            yield put({ type: SYNC_TASK_START })
            const myHttp = createHttp(null)
            const res = yield myHttp.post("/vocaTask/sync", uploadedTasks)
            if (res.status === 200) { //清空
                Storage.clearMapForKey('notSyncTasks');
                yield put({ type: SYNC_TASK_SUCCEED })
            } else {
                if (curUploadedTask) {
                    Storage.save({
                        key: 'notSyncTasks',
                        id: uuidv4(),
                        data: curUploadedTask,
                    });
                }
                yield put({ type: SYNC_TASK_FAIL })
            }


        }
        //上传后，修改lastLearnDate
        yield put({ type: MODIFY_LAST_LEARN_DATE, payload: { lastLearnDate: _util.getDayTime(0) } })
    } catch (err) {
        console.log('--- 异常导致未上传， 保存至本地------------')
        console.log(err)
        if (curUploadedTask) {
            Storage.save({
                key: 'notSyncTasks',
                id: uuidv4(),
                data: curUploadedTask,
            });
        }
        yield put({ type: SYNC_TASK_FAIL })
    }
}



/**watch saga */
export function* watchLoadTasks() {
    yield takeLatest(LOAD_TASKS, loadTasks)
}
export function* watchSyncTask() {
    yield takeLatest(SYNC_TASK, syncTask)
}