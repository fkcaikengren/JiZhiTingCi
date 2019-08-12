import {take, put, call} from 'redux-saga/effects'
import FileService from '../../service/FileService'
const fileService = new FileService()

/**加载文章 */
export function * loadArticle(vocaLibName,articleCode){
    yield put({type:'LOAD_ARTICLE_START'})
    try{
        console.log(`${vocaLibName}/${articleCode}-article.txt`)
        const articleText = yield fileService.loadText(`${vocaLibName}/${articleCode}-article.txt`)
        const keywordText = yield fileService.loadText(`${vocaLibName}/${articleCode}-keyword.json`)
        const keywords = JSON.parse(keywordText)
        const optionsText = yield fileService.loadText(`${vocaLibName}/${articleCode}-option.json`)
        console.log(optionsText)
        const options = JSON.parse(optionsText)
        console.log(options)
        yield put({type:'LOAD_ARTICLE_SUCCEED', articleText,keywords,options})
    }catch(err){
        console.log(err)
        yield put({type:'LOAD_ARTICLE_FAIL'})
    }
}

/**加载解析  */

export function * loadAnalysis(vocaLibName,articleCode){
    yield put({type:'LOAD_ANALYSIS_START'})
    try{
        console.log(`${vocaLibName}/${articleCode}-article.txt`)
        //解析
        const analysisText = yield fileService.loadText(`${vocaLibName}/${articleCode}-analysis.txt`)
        //正确答案
        const rightAnswersText = yield fileService.loadText(`${vocaLibName}/${articleCode}-answer.json`)
        console.log(rightAnswersText)
        const rightAnswers = JSON.parse(rightAnswersText)
        yield put({type:'LOAD_ANALYSIS_SUCCEED', analysisText,rightAnswers})
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
            yield call(loadArticle, payload.vocaLibName, payload.articleCode)
        }
        
        {
            const {payload} = yield take('LOAD_ANALYSIS')
            yield call(loadAnalysis, payload.vocaLibName, payload.articleCode)
        }
      }
}
export default watchArticle