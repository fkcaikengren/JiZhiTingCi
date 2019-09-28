import {take, put, call} from 'redux-saga/effects'
import VocaUtil from "../../common/vocaUtil";
import VocaTaskService from "../../service/VocaTaskService";
import ArticleDao from "../../../reading/service/ArticleDao";

/* task 同步的4中状态
 sync: true, synlocal:true;
 sync: false, synlocal:false;
 sync: false, synlocal:true;
 sync: true, synlocal:true;
 */


/** 加载今日任务 */
export function * loadTasks(params){
    const { storedTasks, taskCount, lastLearnDate} = params
    yield put({type:'LOAD_TASKS_START'})
    try{
        const rawTasks = VocaUtil.loadTodayRawTasks(storedTasks, taskCount, lastLearnDate)
        yield put({type:'LOAD_TASKS_SUCCEED', payload:{tasks:rawTasks}})
    }catch(err){
        yield put({type:'LOAD_TASKS_FAIL'})
    }
}

/**上传单词任务 */
export function * uploadTasks(storedTasks){
    yield put({type:'UPLOAD_TASKS_START'})
    try{
        const res = yield Http.post("/vocaTask/sync",storedTasks)  //上传到服务端
        console.log(res)
        /*res res判断是否上传成功，
            上传失败：
            上传成功：sync改为true
           */

        // 数据更新到本地realm数据库
        VocaUtil.syncTasksLocal(storedTasks)
        yield put({type:'UPLOAD_TASKS_SUCCEED'})
    }catch(err){
        VocaUtil.syncTasksLocal(storedTasks)
        yield put({type:'UPLOAD_TASKS_FAIL'})
    }
}



/**watch saga */
export function * watchLoadTasks(){
    while (true) {
        const action  = yield take(['LOAD_TASKS'])
        console.log('---action:---')
        // console.log(action)
        yield call(loadTasks,action.payload)
    }
}
export function * watchUploadTasks(){
    while (true) {
        const action  = yield take(['UPLOAD_TASKS'])
        console.log('---action:---')
        // console.log(action)
        yield call(uploadTasks,action.payload.storedTasks)
    }
}