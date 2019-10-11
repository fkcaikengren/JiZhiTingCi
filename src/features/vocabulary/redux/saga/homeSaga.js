import {take, put, call} from 'redux-saga/effects'
import VocaUtil from "../../common/vocaUtil";
import VocaTaskDao from "../../service/VocaTaskDao";



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
export function * uploadTask(storedTask){    //一次只上传一个
    let curUploadedTask = null
    if(storedTask){ //传入的任务不为null
        yield put({type:'UPLOAD_TASK_START'})
        // 数据更新到本地realm数据库
        VocaTaskDao.getInstance().modifyTask(storedTask)
        //修改成需要上传的数据
        curUploadedTask = VocaUtil.genUploadedTask(storedTask)
    }

    try{
        //1. 取之前没有上传的数据
        let uploadedTasks = yield Storage.getAllDataForKey('uploadedTasks')
        //2. 合并本次上传的数据 (遍历移除同taskOrder的数据)
        if(curUploadedTask){
            uploadedTasks = uploadedTasks.filter((upTask, i)=>{
                if(upTask.taskOrder === curUploadedTask.taskOrder)
                    return false
                return true
            })
            uploadedTasks.push(curUploadedTask)
        }
        console.log('-------所有上传的的数据：-------------')
        console.log(uploadedTasks)
        //3. 成功则清空， 失败则写入本次上传数据
        if(uploadedTasks && uploadedTasks.length>0){
            if(storedTask === null){
                yield put({type:'UPLOAD_TASK_START'})
            }

            const res = yield Http.post("/vocaTask/sync",uploadedTasks)  //上传到服务端
            /*  判断是否上传成功 */
            if(res.data.code === 200){ //清空
                ModifiedWordSet.clear()
                Storage.clearMapForKey('modifiedWords');
                Storage.clearMapForKey('uploadedTasks');
            }else{ //把要上传的数据保存到本地
                console.log('---未上传 保存至本地----------------------------------->')
                if(curUploadedTask){
                    Storage.save({
                        key: 'uploadedTasks',
                        id: curUploadedTask.taskOrder,
                        data: curUploadedTask,
                    });
                }
            }
            yield put({type:'UPLOAD_TASK_SUCCEED'})
        }
    }catch(err){
        console.log('--- 异常导致未上传， 保存至本地----------------------------------->')
        if(curUploadedTask){
            Storage.save({
                key: 'uploadedTasks',
                id: curUploadedTask.taskOrder,
                data: curUploadedTask,
            });
        }
        yield put({type:'UPLOAD_TASK_FAIL'})
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
export function * watchUploadTask(){
    while (true) {
        const action  = yield take(['UPLOAD_TASK'])
        console.log('---action:---')
        // console.log(action)
        yield call(uploadTask,action.payload.storedTask)
    }
}