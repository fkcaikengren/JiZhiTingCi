import {take, put, call} from 'redux-saga/effects'
import FileService from '../../../../common/FileService'
const fileService = new FileService()

/**加载文章 */
export function * loadArticle(articleInfo){
    yield put({type:'LOAD_ARTICLE_START'})
    try{
        console.log(articleInfo.articleUrl)
        const articleText = yield fileService.loadText(articleInfo.articleUrl)
        const keywords = articleInfo.keyWords
        let options = []
        if(articleInfo.optionUrl !== null){
            options = yield fileService.loadText(articleInfo.optionUrl, 'json')
        }
        
        if(articleText === null || options === null){
            yield put({type:'LOAD_ARTICLE_FAIL'})
        }else{
            yield put({type:'LOAD_ARTICLE_SUCCEED', articleText,keywords,options})
        }
        
    }catch(err){
        console.log(err)
        yield put({type:'LOAD_ARTICLE_FAIL'})
    }
}

/**加载解析  */

export function * loadAnalysis(articleInfo){
    yield put({type:'LOAD_ANALYSIS_START'})
    try{
        console.log(articleInfo.articleUrl)
        const analysisText = yield fileService.loadText(articleInfo.analysisUrl)
        //正确答案
        const rightAnswers = yield fileService.loadText(articleInfo.answerUrl, 'json')
        if(analysisText === null || rightAnswers === null){
            yield put({type:'LOAD_ANALYSIS_FAIL'})
        }else{
            yield put({type:'LOAD_ANALYSIS_SUCCEED', analysisText,rightAnswers})
        }
        
    }catch(err){
        console.log(err)
        yield put({type:'LOAD_ANALYSIS_FAIL'})
    }
}




/**watch saga */
function * watchArticle(){
    while (true) {
        {
            const {payload} = yield take('LOAD_ARTICLE')
            yield call(loadArticle, payload.articleInfo)
        }
        
        {
            const {payload} = yield take('LOAD_ANALYSIS')
            yield call(loadAnalysis, payload.articleInfo)
        }
      }
}
export default watchArticle