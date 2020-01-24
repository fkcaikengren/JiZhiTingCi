import { createActions } from 'redux-actions';

//切换单词书
export const CHANGE_VOCA_BOOK = 'CHANGE_VOCA_BOOK'
export const CHANGE_VOCA_BOOK_START = 'CHANGE_VOCA_BOOK_START'
export const CHANGE_VOCA_BOOK_SUCCEED = 'CHANGE_VOCA_BOOK_SUCCEED'
export const CHANGE_VOCA_BOOK_FAIL = 'CHANGE_VOCA_BOOK_FAIL'
//保存计划
export const SAVE_PLAN = 'SAVE_PLAN'
//修改已学单词数
export const CHANGE_LEARNED_WORD_COUNT = 'CHANGE_LEARNED_WORD_COUNT'
//修改剩余天数
export const CHANGE_LEFT_DAYS = 'CHANGE_LEFT_DAYS'


const fn = (payload) => {
    return payload;
}

//驼峰式命名，不可以更改(与变量名必须对应)
export const { savePlan, changeVocaBook, changeLearnedWordCount, changeLeftDays } = createActions({
    //保存计划
    [SAVE_PLAN]: fn,
    //修改单词书
    //bookCode,totalWordCount, taskCount, taskWordCount, lastLearnDate
    [CHANGE_VOCA_BOOK]: fn,

    [CHANGE_LEARNED_WORD_COUNT]: (learnedWordCount) => {
        return { learnedWordCount }
    },
    [CHANGE_LEFT_DAYS]: (leftDays) => {
        return { leftDays }
    }
});




