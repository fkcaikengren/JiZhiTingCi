
import { call, all } from 'redux-saga/effects'
import { watchLoadTasks, watchSyncTask } from '../features/vocabulary/redux/saga/homeSaga'
import { watchCreatePlan, watchModifyPlan, watchSyncAllLearnedDays, watchSynFinishDays } from '../features/vocabulary/redux/saga/planSaga'
import { watchLoadArticle, watchLoadAnalysis } from '../features/reading/redux/saga/articleSaga'
import {
    watchLoginByCode, watchLoginByPwd, watchLoginByWX, watchLoginByQQ,
    watchModifyNickname, watchModifySex, watchModifyPwd, watchModifyAvatar, watchModifyWechat, watchModifyQQ, watchModifyPhone
} from '../features/mine/redux/saga/mineSaga'
import { watchSyncGroup } from '../features/vocabulary/redux/saga/vocaGroupSaga'
import { watchChangePlayListIndex } from '../features/vocabulary/redux/saga/vocaPlaySaga'


function* rootSaga() {
    yield all([
        // 单词
        call(watchLoadTasks),
        call(watchSyncTask),
        call(watchCreatePlan),
        call(watchModifyPlan),
        call(watchSyncAllLearnedDays),
        call(watchSynFinishDays),


        call(watchSyncGroup),
        call(watchChangePlayListIndex),

        // 阅读
        call(watchLoadArticle),
        call(watchLoadAnalysis),

        //用户
        call(watchLoginByCode),
        call(watchLoginByPwd),
        call(watchLoginByWX),
        call(watchLoginByQQ),
        call(watchModifyNickname),
        call(watchModifySex),
        call(watchModifyPwd),
        call(watchModifyAvatar),

        call(watchModifyWechat),
        call(watchModifyQQ),
        call(watchModifyPhone),

    ])
}

export default rootSaga