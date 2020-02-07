
import * as pa from './action/planAction';
import { LOGOUT } from '../../mine/redux/action/mineAction'

const defaultState = {

    //当前计划
    plan: {
        bookId: null,
        bookName: null,
        bookCoverUrl: null,
        taskCount: 0,
        taskWordCount: 0,       //每日新学词数
        reviewWordCount: 0,      //每日复习词数
        totalWordCount: 0,      //总单词数
        totalDays: 0,           //总天数
        lastLearnDate: null      //上次学习时间
    },
    learnedWordCount: 0,   // 已学单词数
    leftDays: 0,           // 剩余学习天数

    //加载状态
    isLoadPending: false,
}


export const plan = (state = defaultState, action) => {

    switch (action.type) {
        // 保存计划
        case pa.SAVE_PLAN:
            return { ...state, plan: action.payload.plan };
        // 更换词汇书
        case pa.CHANGE_VOCA_BOOK_START:
            return { ...state, isLoadPending: true };

        case pa.CHANGE_VOCA_BOOK_SUCCEED:
            const { plan } = action.payload
            return {
                ...state,
                plan: { ...state.plan, ...plan },
                learnedWordCount: 0,
                leftDays: plan.totalDays,
                isLoadPending: false,
            };

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
        //退出登录
        case LOGOUT:
            return defaultState
        default:
            return state
    }

}