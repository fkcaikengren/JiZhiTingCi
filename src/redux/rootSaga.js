
import { call, all } from 'redux-saga/effects'
import { watchLoadTasks, watchSyncTask } from '../features/vocabulary/redux/saga/homeSaga'
import { watchPlan } from '../features/vocabulary/redux/saga/planSaga'
import { watchLoadArticle, watchLoadAnalysis } from '../features/reading/redux/saga/articleSaga'
import { watchLoginByCode, watchModifyNickname, watchModifyPwd, watchModifyAvatar } from '../features/mine/redux/saga/mineSaga'
import { watchSyncGroup } from '../features/vocabulary/redux/saga/vocaGroupSaga'


function* rootSaga() {
    yield all([
        // 单词
        call(watchLoadTasks),
        call(watchSyncTask),
        call(watchPlan),
        call(watchSyncGroup),
        // 阅读
        call(watchLoadArticle),
        call(watchLoadAnalysis),

        //用户
        call(watchLoginByCode),
        call(watchModifyNickname),
        call(watchModifyPwd),
        call(watchModifyAvatar),
    ])
}

export default rootSaga