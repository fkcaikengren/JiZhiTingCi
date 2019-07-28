import {take, put, call} from 'redux-saga/effects'
import * as Constant from '../../common/constant'

/*
    异步操作才使用saga
*/


/**加载任务  */
export function * loadTask(mode, task, vocaDao, taskDao){
    yield put({type:'LOAD_TASK_START'})
    try{
        //从realm数据库中加载已学的task （已学的task数据一定是填充好的）
        if(mode === Constant.NORMAL_PLAY){ 
            const t = yield taskDao.getTaskByOrder(task.taskOrder)
            if(t){
                task = t
            }
        }else{ 
            //从voca.realm填充任务数据
            if(!task.dataCompleted){
                yield vocaDao.writeInfoToTask(task)
            }
        }
        console.log(task)
        yield put({type:'LOAD_TASK_SUCCEED', task:task})    
    }catch(err){
        console.log(err)
        yield put({type:'LOAD_TASK_FAIL'})
    }
    
}


/**watch saga */
function * watchVocaPlay(){
    while (true) {
        const action = yield take('LOAD_TASK')
        const {mode, task, vocaDao, taskDao} = action.payload
        yield call(loadTask, mode, task, vocaDao, taskDao )
    }
}
export default watchVocaPlay


 
      
      