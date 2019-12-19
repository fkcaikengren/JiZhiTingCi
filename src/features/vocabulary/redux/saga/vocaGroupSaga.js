import { takeLatest,put } from "redux-saga/effects"
import { 
  SYNC_GROUP, 
  SYNC_GROUP_START,
  SYNC_GROUP_FAIL,
  SYNC_GROUP_SUCCEED 
} from "../action/vocaGroupAction"


/**
 * @description 同步生词本数据
 */
export function* syncGroup(action){
  yield put({type:SYNC_GROUP_START})
  const syncArr = yield Storage.getAllDataForKey('notSyncGroups')
  console.log(syncArr)
  const res = yield Http.post('/vocaGroup/sync',syncArr)
  if(res.status === 200){
    // 删除本地
    Storage.clearMapForKey('notSyncGroups')
    yield put({type:SYNC_GROUP_SUCCEED})
  }else{
    yield put({type:SYNC_GROUP_FAIL})
  }
}

export function* watchSyncGroup(){
  yield takeLatest(SYNC_GROUP,syncGroup)
}
