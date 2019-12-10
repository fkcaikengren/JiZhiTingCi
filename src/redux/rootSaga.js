
import { call, all } from 'redux-saga/effects'
import { watchLoadTasks, watchSyncTask } from '../features/vocabulary/redux/saga/homeSaga'
import watchVocaLib from '../features/vocabulary/redux/saga/vocaLibSaga'
import watchVocaPlay from '../features/vocabulary/redux/saga/vocaPlaySaga'
import { watchLoadArticle, watchLoadAnalysis } from '../features/reading/redux/saga/articleSaga'

function* rootSaga() {
    yield all([
        call(watchLoadTasks),
        call(watchSyncTask),

        call(watchVocaLib),
        call(watchVocaPlay),
        call(watchLoadArticle),
        call(watchLoadAnalysis),

    ])
}

export default rootSaga