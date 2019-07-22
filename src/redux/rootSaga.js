
import {call, all} from 'redux-saga/effects'
import watchVocaLib from '../features/vocabulary/redux/saga/vocaLibSaga'

function* rootSaga () {
    yield all([call(watchVocaLib),
    ])
}

export default rootSaga