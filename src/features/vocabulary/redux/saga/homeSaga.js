import { take, put, call } from 'redux-saga/effects'
import VocaUtil from "../../common/vocaUtil";
import VocaTaskDao from "../../service/VocaTaskDao";
import { COMMAND_MODIFY_TASK } from '../../../../common/constant';
import { SYNC_TASK } from '../action/homeAction';


/** 加载今日任务 */
export function* loadTasks(params) {
    const { storedTasks, taskCount, lastLearnDate } = params
    yield put({ type: 'LOAD_TASKS_START' })
    try {
        const rawTasks = VocaUtil.loadTodayRawTasks(storedTasks, taskCount, lastLearnDate)
        yield put({ type: 'LOAD_TASKS_SUCCEED', payload: { tasks: rawTasks } })
    } catch (err) {
        yield put({ type: 'LOAD_TASKS_FAIL' })
    }
}

/**上传单词任务 */
export function* syncTask(syncObj) {    //一次只上传一个
    let curUploadedObj = null
    try {
        //1. 取之前没有上传的数据
        let uploadedTasks = yield Storage.getAllDataForKey('notSyncTasks')

        //2. 同步至本地
        if (syncObj) {
            const { data, command } = syncObj
            switch (command) {
                case COMMAND_MODIFY_TASK:
                    yield put({ type: 'UPLOAD_TASK_START' })
                    // 数据更新到本地realm数据库
                    VocaTaskDao.getInstance().modifyTask(data)
                    //修改成需要上传的数据
                    curUploadedObj = {
                        command, //错误
                        data: {
                            taskOrder: data.taskOrder,
                            status: data.status,
                            vocaTaskDate: data.vocaTaskDate,
                            progress: data.progress,
                            leftTimes: data.leftTimes,
                            delayDays: data.delayDays,
                            wordCount: data.wordCount,
                            listenTimes: data.listenTimes,
                            testTimes: data.testTimes,
                            words: data.words
                        }
                    }
                    // 合并本次上传的数据 (对于同步整个单词任务时而言)
                    uploadedTasks = uploadedTasks.filter((upTask, i) => {
                        if (upTask.command === curUploadedObj.command && upTask.data.taskOrder === curUploadedObj.data.taskOrder) {
                            return false
                        } else {
                            return true
                        }
                    })

                    break
                default:
                    curUploadedObj = syncObj

            }
        }


        if (curUploadedObj) {
            uploadedTasks.push(curUploadedObj)
        }
        console.log('-------所有上传的的数据：-------------')
        console.log(uploadedTasks)
        //3. 成功则清空， 失败则写入本次上传数据
        if (uploadedTasks && uploadedTasks.length > 0) {
            yield put({ type: 'UPLOAD_TASK_START' })

            const res = yield Http.post("/vocaTask/sync", uploadedTasks)
            if (res.status === 200) { //清空
                Storage.clearMapForKey('notSyncTasks');
            }
            yield put({ type: 'UPLOAD_TASK_SUCCEED' })
        }
    } catch (err) {
        console.log('--- 异常导致未上传， 保存至本地------------')
        console.log(err)
        if (curUploadedObj) {
            Storage.save({
                key: 'notSyncTasks',
                id: curUploadedObj.command.split('_').join('-') + (curUploadedObj.data.taskOrder || ''),
                data: curUploadedObj,
            });
        }
        yield put({ type: 'UPLOAD_TASK_FAIL' })
    }

}


/**watch saga */
export function* watchLoadTasks() {
    while (true) {
        const action = yield take(['LOAD_TASKS'])
        yield call(loadTasks, action.payload)
    }
}
export function* watchSyncTask() {
    while (true) {
        const { type, payload } = yield take([SYNC_TASK])

        yield call(syncTask, payload)
    }
}