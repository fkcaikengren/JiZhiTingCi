
import {call, all} from 'redux-saga/effects'
import watchVocaLib from '../features/vocabulary/redux/saga/vocaLibSaga'
import watchVocaPlay from '../features/vocabulary/redux/saga/vocaPlaySaga'
import watchArticle from '../features/reading/redux/saga/articleSaga'

function* rootSaga () {
    yield all([
        call(watchVocaLib), 
        call(watchVocaPlay),
        call(watchArticle)
    ])
}

export default rootSaga