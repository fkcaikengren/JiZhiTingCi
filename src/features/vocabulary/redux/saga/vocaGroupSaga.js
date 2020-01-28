import { takeLatest, put } from "redux-saga/effects"
import {
  SYNC_GROUP,
  SYNC_GROUP_START,
  SYNC_GROUP_FAIL,
  SYNC_GROUP_SUCCEED
} from "../action/vocaGroupAction"
import createHttp from "../../../../common/http"
import { store } from "../../../../redux/store"

/**
 * @description 同步生词本数据
 */
export function* syncGroup(action) {

  const syncArr = yield Storage.getAllDataForKey('notSyncGroups')
  console.log(syncArr)
  if (syncArr && syncArr.length > 0) {
    yield put({ type: SYNC_GROUP_START })
    const myHttp = createHttp(null, { showLoader: action.payload.isByHand, shouldRefreshToken: true })
    const res = yield myHttp.post('/vocaGroup/sync', syncArr)
    if (res.status === 200) {
      // 删除本地
      Storage.clearMapForKey('notSyncGroups')
      yield put({ type: SYNC_GROUP_SUCCEED })

    } else {
      yield put({ type: SYNC_GROUP_FAIL })
    }
  } else {
    if (action.payload.isByHand) {
      store.getState().app.toast.show("暂无同步数据", 2000)
    }
  }

}

export function* watchSyncGroup() {
  yield takeLatest(SYNC_GROUP, syncGroup)
}
