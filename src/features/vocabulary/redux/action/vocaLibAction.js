import { createActions } from 'redux-actions';

//加载单词书
export const LOAD_VOCA_BOOKS = 'LOAD_VOCA_BOOKS'    
export const LOAD_VOCA_BOOKS_START = 'LOAD_VOCA_BOOKS_START'
export const LOAD_VOCA_BOOKS_SUCCEED = 'LOAD_VOCA_BOOKS_SUCCEED'
export const LOAD_VOCA_BOOKS_FAIL = 'LOAD_VOCA_BOOKS_FAIL'


export const CHANGE_VOCA_BOOK = 'CHANGE_VOCA_BOOK'    //切换单词书

export const MODIFY_PLAN = 'MODIFY_PLAN'   

//驼峰式命名，不可以更改(与变量名必须对应)
export const {loadVocaBooks,changeVocaBook} = createActions({
    //加载单词书
    [LOAD_VOCA_BOOKS]: ()=>{
        return {type:'LOAD_VOCA_BOOKS'}
    },
    //修改单词书
    [CHANGE_VOCA_BOOK]:(bookCode, taskCount) => {
        return {type:'CHANGE_VOCA_BOOK', bookCode, taskCount, taskWordCount:15};
    },
    
});




