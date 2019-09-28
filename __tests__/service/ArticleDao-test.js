

import 'react-native'
import ArticleDao from '../../src/features/reading/service/ArticleDao'

const artDao = ArticleDao.getInstance()
beforeEach(() => {
    return artDao.open()
});
afterEach(()=>{
    return artDao.close()
})

const articles = [
    { id: 4,
    articleUrl: '/article/1991-6-4-article.txt',
    optionUrl: '/article/1991-6-4-option.json',
    answerUrl: '/article/1991-6-4-answer.json',
    analysisUrl: '/article/1991-6-4-analysis.txt',
    name: '六级阅读4',
    note: '1991年6月份真题',
    keyWords:
[ 'recreation',
    'function',
    'spot',
    'activity',
    'environment',
    'right' ] },
    { id: 5,
        articleUrl: '/article/1998-6-1-article.txt',
        optionUrl: '/article/1998-6-1-option.json',
        answerUrl: '/article/1998-6-1-answer.json',
        analysisUrl: '/article/1998-6-1-analysis.txt',
        name: '六级阅读5',
        note: '1998年6月份真题',
        keyWords:
            [ 'utopia',
                'destiny',
                'communication',
                'credit',
                'development',
                'economy' ] },
]

it('保存全部文章 ', ()=>{
    console.log(artDao.saveArticles(articles))
})

it('根据id查询文章', ()=>{
    console.log(artDao.getArticleById(9).length)
})

it('根据多个id查询文章', ()=>{
    console.log(artDao.getArticles('5,6'))
})

it('查询全部文章', ()=>{
    console.log(artDao.getAllArticles())
})


it('删除全部文章', ()=>{
    artDao.deleteAllArticles()
})