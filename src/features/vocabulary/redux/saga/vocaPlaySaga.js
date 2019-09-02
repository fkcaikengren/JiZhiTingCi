import {take, put, call} from 'redux-saga/effects'
import * as Constant from '../../common/constant'

/*
    异步操作才使用saga
*/


/**加载任务  */
export function * xx( task, vocaDao, taskDao){
}



/**watch saga */
function * watchVocaPlay(){
    // while (true) {
    //     const action = yield take('LOAD_TASK')
    //     const { task, vocaDao, taskDao} = action.payload
    //     yield call(xx, task, vocaDao, taskDao )
    // }
}
export default watchVocaPlay


 
      
      