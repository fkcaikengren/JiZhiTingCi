import {take, put, call} from 'redux-saga/effects'
import * as Constant from '../../common/constant'

/*
    异步操作才使用saga
*/


/**加载任务  */
export function * loadTask( task, vocaDao, taskDao){
    yield put({type:'LOAD_TASK_START'})
    try{
        //若task数据不完整，根据task.taskOrder查询任务
        if(!(task.words && task.words.length>0)){
            const t = yield taskDao.getTaskByOrder(task.taskOrder)
            if(t){
                task = t
            }
        }
        //从voca.realm填充任务数据
        if(!task.dataCompleted){
            yield taskDao.realm.write(()=>{
                vocaDao.writeInfoToTask(task)
            })
        }
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
        const { task, vocaDao, taskDao} = action.payload
        yield call(loadTask, task, vocaDao, taskDao )
    }
}
export default watchVocaPlay


 
      
      