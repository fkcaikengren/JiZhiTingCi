import { take, put, call } from 'redux-saga/effects'
import FileService from '../../../../common/FileService'
import { VOCABULARY_DIR } from "../../../../common/constant";
const fileService = FileService.getInstance()

//暂时------
const articlesDir = 'articles'


/**加载文章 */
export function* loadArticle(articleInfo) {
    yield put({ type: 'LOAD_ARTICLE_START' })
    try {
        console.log(articleInfo.articleUrl)
        const articleText = yield fileService.load(VOCABULARY_DIR, articlesDir + articleInfo.articleUrl)
        const keywords = articleInfo.keyWords
        let options = []
        if (articleInfo.optionUrl !== null) {
            options = yield fileService.load(VOCABULARY_DIR, articlesDir + articleInfo.optionUrl)
        }

        if (articleText === null || options === null) {
            yield put({ type: 'LOAD_ARTICLE_FAIL' })
        } else {
            console.log(articleText.substring(0, 20))
            yield put({ type: 'LOAD_ARTICLE_SUCCEED', articleText, keywords, options })
        }

    } catch (err) {
        console.log(err)
        yield put({ type: 'LOAD_ARTICLE_FAIL' })
    }
}

/**加载解析  */

export function* loadAnalysis(articleInfo) {
    yield put({ type: 'LOAD_ANALYSIS_START' })
    try {
        // console.log(articleInfo.articleUrl)
        const analysisText = yield fileService.load(VOCABULARY_DIR, articlesDir + articleInfo.analysisUrl)
        //正确答案
        const rightAnswers = yield fileService.load(VOCABULARY_DIR, articlesDir + articleInfo.answerUrl)
        if (analysisText === null || rightAnswers === null) {
            yield put({ type: 'LOAD_ANALYSIS_FAIL' })
        } else {
            yield put({ type: 'LOAD_ANALYSIS_SUCCEED', analysisText, rightAnswers })
        }

    } catch (err) {
        console.log(err)
        yield put({ type: 'LOAD_ANALYSIS_FAIL' })
    }
}




/**watch saga */
export function* watchLoadArticle() {
    while (true) {
        const { payload } = yield take('LOAD_ARTICLE')
        yield call(loadArticle, payload.articleInfo)
    }
}

export function* watchLoadAnalysis() {
    while (true) {
        const { payload } = yield take('LOAD_ANALYSIS')
        yield call(loadAnalysis, payload.articleInfo)
    }
}
