
import * as vl from './action/vocaLibAction';
import { CHANGE_LEARNED_WORD_COUNT } from "./action/vocaLibAction";
import { LOGOUT } from '../../mine/redux/action/mineAction'

const defaultState = {

    //单词书
    books: [],
    //当前计划
    plan: {
        bookId: "",
        name: "",
        taskCount: 0,
        taskWordCount: 0,
    },
    totalWordCount: 0,     //总单词数
    totalDays: 0,           //总天数
    learnedWordCount: 0,   // 已学单词数
    leftDays: 0,           // 剩余学习天数

    //加载状态
    isLoadPending: false,
}


export const vocaLib = (state = defaultState, action) => {

    switch (action.type) {
        case vl.LOAD_VOCA_BOOKS_START:
            return { ...state };
        case vl.LOAD_VOCA_BOOKS_SUCCEED:
            return { ...state, books: action.books };
        case vl.CHANGE_VOCA_BOOK_START:
            return { ...state, isLoadPending: true };
        case vl.CHANGE_VOCA_BOOK_SUCCEED:
            const { plan, totalWordCount, totalDays } = action
            return {
                ...state,
                plan: { ...state.plan, ...plan },
                learnedWordCount: 0,
                totalWordCount: totalWordCount,
                totalDays: totalDays,
                leftDays: totalDays,
                isLoadPending: false,
            };
        case vl.CHANGE_LEFT_DAYS:
            return { ...state, leftDays: action.payload.leftDays }
        case vl.CHANGE_LEARNED_WORD_COUNT:
            console.log('-------learnedWordCount------')
            console.log(action.payload.learnedWordCount)
            return { ...state, learnedWordCount: action.payload.learnedWordCount }
        //退出登录
        case LOGOUT:
            return defaultState
        default:
            return state
    }

}