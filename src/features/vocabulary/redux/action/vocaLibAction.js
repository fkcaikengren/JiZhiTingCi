import { createActions } from 'redux-actions';

//加载单词书
export const LOAD_VOCA_BOOKS = 'LOAD_VOCA_BOOKS'
export const LOAD_VOCA_BOOKS_START = 'LOAD_VOCA_BOOKS_START'
export const LOAD_VOCA_BOOKS_SUCCEED = 'LOAD_VOCA_BOOKS_SUCCEED'
export const LOAD_VOCA_BOOKS_FAIL = 'LOAD_VOCA_BOOKS_FAIL'

//修改计划
export const MODIFY_PLAN = 'MODIFY_PLAN'

//切换单词书
export const CHANGE_VOCA_BOOK = 'CHANGE_VOCA_BOOK'
export const CHANGE_VOCA_BOOK_START = 'CHANGE_VOCA_BOOK_START'
export const CHANGE_VOCA_BOOK_SUCCEED = 'CHANGE_VOCA_BOOK_SUCCEED'
export const CHANGE_VOCA_BOOK_FAIL = 'CHANGE_VOCA_BOOK_FAIL'

//修改已学单词数
export const CHANGE_LEARNED_WORD_COUNT = 'CHANGE_LEARNED_WORD_COUNT'
//修改剩余天数
export const CHANGE_LEFT_DAYS = 'CHANGE_LEFT_DAYS'

//驼峰式命名，不可以更改(与变量名必须对应)
export const { loadVocaBooks, changeVocaBook, changeLearnedWordCount, changeLeftDays } = createActions({
    //加载单词书
    [LOAD_VOCA_BOOKS]: () => {
        return {}
    },
    //修改单词书
    //bookCode,totalWordCount, taskCount, taskWordCount, lastLearnDate
    [CHANGE_VOCA_BOOK]: (data) => {
        return data;
    },
    [CHANGE_LEARNED_WORD_COUNT]: (learnedWordCount) => {
        return { learnedWordCount }
    },
    [CHANGE_LEFT_DAYS]: (leftDays) => {
        return { leftDays }
    }
});




