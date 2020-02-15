import { createActions } from 'redux-actions';

// 切换单词书
export const CHANGE_VOCA_BOOK = 'CHANGE_VOCA_BOOK'
export const CHANGE_VOCA_BOOK_START = 'CHANGE_VOCA_BOOK_START'
export const CHANGE_VOCA_BOOK_SUCCEED = 'CHANGE_VOCA_BOOK_SUCCEED'
export const CHANGE_VOCA_BOOK_FAIL = 'CHANGE_VOCA_BOOK_FAIL'

// 修改学习计划
export const MODIFY_PLAN = 'MODIFY_PLAN'
export const MODIFY_PLAN_START = 'MODIFY_PLAN_START'
export const MODIFY_PLAN_SUCCEED = 'MODIFY_PLAN_SUCCEED'
export const MODIFY_PLAN_FAIL = 'MODIFY_PLAN_FAIL'


// 保存计划
export const SAVE_PLAN = 'SAVE_PLAN'
// 修改上次学习时间
export const MODIFY_LAST_LEARN_DATE = 'MODIFY_LAST_LEARN_DATE'

//修改已学单词数
export const CHANGE_LEARNED_WORD_COUNT = 'CHANGE_LEARNED_WORD_COUNT'
//修改剩余天数
export const CHANGE_LEFT_DAYS = 'CHANGE_LEFT_DAYS'


const fn = (payload) => {
    return payload;
}

//驼峰式命名，不可以更改(与变量名必须对应)
export const { savePlan, changeVocaBook, modifyPlan,
    modifyLastLearnDate, changeLearnedWordCount, changeLeftDays } = createActions({
        //保存计划
        [SAVE_PLAN]: fn,
        //更换单词书
        [CHANGE_VOCA_BOOK]: fn,
        //修改计划
        [MODIFY_PLAN]: fn,
        //修改lastLeanDate
        [MODIFY_LAST_LEARN_DATE]: fn,

        [CHANGE_LEARNED_WORD_COUNT]: fn,
        [CHANGE_LEFT_DAYS]: fn
    });




