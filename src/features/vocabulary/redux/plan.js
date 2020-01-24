
import * as vl from './action/planAction';
import { LOGOUT } from '../../mine/redux/action/mineAction'

const defaultState = {

    //当前计划
    plan: {
        bookId: "",
        bookName: "",
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


export const plan = (state = defaultState, action) => {

    switch (action.type) {
        // 保存计划
        case vl.SAVE_PLAN:
            return { ...state, plan: action.payload.plan };
        // 选择词汇书(制定计划)
        case vl.CHANGE_VOCA_BOOK_START:
            return { ...state, isLoadPending: true };

        case vl.CHANGE_VOCA_BOOK_SUCCEED:
            const { plan, totalWordCount, totalDays, leftDays } = action.payload
            return {
                ...state,
                plan: { ...state.plan, ...plan },
                learnedWordCount: 0,
                totalWordCount: totalWordCount,
                totalDays: totalDays,
                leftDays: leftDays,
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