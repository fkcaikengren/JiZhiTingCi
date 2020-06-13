
import * as pa from './action/planAction';
import { LOGOUT } from '../../mine/redux/action/mineAction'

const defaultState = {

    //当前计划
    plan: {
        bookId: null,
        bookType: null,
        bookName: null,
        bookCoverUrl: null,
        packageSize: 0,
        packageUrl: null,
        taskCount: 0,
        taskWordCount: 0,       //每日新学词数
        reviewWordCount: 0,      //每日复习词数
        totalWordCount: 0,      //总单词数
        totalDays: 0,           //总天数
        lastLearnDate: null      //上次学习时间
    },
    bookCoverSource: null,
    learnedWordCount: 0,   // 已学单词数
    leftDays: 0,           // 剩余学习天数

    //累计数据
    learnedTodayFlag: null,         //当天算入学习天数的标记
    finishedBooksWordCount: 0,  //已学完的单词书中学过的单词数
    allLearnedCount: 0,         //累计学习单词数
    allLearnedDays: 0,          //累计学习天数

}

export const plan = (state = defaultState, action) => {

    switch (action.type) {
        // 保存计划 (包括统计数据)
        case pa.SAVE_PLAN: {
            const { plan, finishedBooksWordCount, allLearnedCount, allLearnedDays } = action.payload
            return {
                ...state,
                plan,
                finishedBooksWordCount,
                allLearnedCount,
                allLearnedDays
            };
        }

        // 更换词汇书
        case pa.CHANGE_VOCA_BOOK_SUCCEED: {
            const { plan, leftDays, finishedBooksWordCount, bookCoverSource } = action.payload
            return {
                ...state,
                plan: { ...state.plan, ...plan },
                learnedWordCount: 0,
                leftDays,
                finishedBooksWordCount,
                bookCoverSource
            }
        }

        //修改计划
        case pa.MODIFY_PLAN_SUCCEED: {
            const { plan, leftDays } = action.payload
            return {
                ...state,
                plan: {
                    ...state.plan,
                    ...plan,
                },
                leftDays: leftDays
            }
        }
        case pa.MODIFY_LAST_LEARN_DATE:
            return {
                ...state,
                plan: { ...state.plan, lastLearnDate: action.payload.lastLearnDate },
            }
        case pa.CHANGE_LEFT_DAYS:
            return { ...state, leftDays: action.payload.leftDays }
        case pa.CHANGE_LEARNED_WORD_COUNT:
            console.log('已学单词数量：' + action.payload.learnedWordCount)
            return { ...state, learnedWordCount: action.payload.learnedWordCount }



        // 同步allLearnedDays
        case pa.SYN_ALL_LEARNED_DAYS_START: {
            const { allLearnedDays, learnedTodayFlag } = action.payload
            return { ...state, allLearnedDays, learnedTodayFlag }
        }
        // 同步allLearnedCount
        case pa.SYN_FINISH_DAYS_START: {
            return { ...state, allLearnedCount: action.payload.allLearnedCount }
        }
        case pa.LOAD_BOOK_COVER_SOURCE:
            return { ...state, bookCoverSource: action.payload.bookCoverSource }

        //退出登录
        case LOGOUT:
            return defaultState
        default:
            return state
    }

}