import {take, put, call} from 'redux-saga/effects'
import VocaTaskDao from '../../service/VocaTaskDao';


/**提交单词计划 */
export function * uploadTasks(tasks){
    yield put({type:'UPLOAD_TASKS_START'})
    try{
        // const res = yield Http.post("/vocaTask/sync",tasks) //同步
        // res 判断是否同步成功
        // 数据更新到本地realm数据库
        const notSyncTasks = tasks.filter((task,index)=>{
            if(task.isSyncLocal){
                return false
            }else{
                return true
            }
        })
        if(notSyncTasks.length > 0){
            console.log('---------- start save to realm ---')
            const vtd = VocaTaskDao.getInstance()
            vtd.modifyTasks(notSyncTasks)
        }
        yield put({type:'UPLOAD_TASKS_SUCCEED'})
    }catch(err){
        yield put({type:'UPLOAD_TASKS_FAIL'})
    }
}


/**watch saga */
function * watchHome(){
    while (true) {

        const action_1  = yield take('UPLOAD_TASKS')
        console.log(action_1)
        yield call(uploadTasks,action_1.payload.tasks)
      }
}
export default watchHome
