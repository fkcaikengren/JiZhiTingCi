
import {call, all} from 'redux-saga/effects'
import watchVocaLib from '../features/vocabulary/redux/saga/vocaLibSaga'
import watchVocaPlay from '../features/vocabulary/redux/saga/vocaPlaySaga'

function* rootSaga () {
    yield all([call(watchVocaLib), call(watchVocaPlay)
    ])
}

export default rootSaga