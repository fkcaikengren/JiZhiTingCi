import {
    LOGIN_BY_CODE_SUCCEED,
    LOGIN_BY_WX_SUCCEED,

    MODIFY_NICKNAME_SUCCEED,
    MODIFY_NICKNAME_FAIL,
    MODIFY_AVATAR_SUCCEED,
    MODIFY_AVATAR_FAIL,

    LOGOUT,
    CHANGE_CONFIG_REVIEW_PLAY_TIMES,
    CHANGE_CONFIG_N_TRANS,
    CHANGE_CONFIG_M_TRANS,
    CHANGE_CONFIG_VOCA_PRON_TYPE
} from "./action/mineAction"
import { VOCA_PRON_TYPE_AM, VOCA_PRON_TYPE_EN } from "../../vocabulary/common/constant"


const defaultState = {
    credential: {},
    user: {},
    avatarSource: null,

    //发音类型
    configVocaPronType: VOCA_PRON_TYPE_EN,
    //复习轮播次数
    configReviewPlayTimes: 10,
    configShowNTrans: true,
    configShowMTrans: true,
}

export const mine = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_BY_CODE_SUCCEED: {//验证码登录成功
            console.log('验证码登录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }
        case LOGIN_BY_WX_SUCCEED: {  //微信登录成功
            console.log('----微信登录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }


        case MODIFY_NICKNAME_SUCCEED:   //修改昵称成功
            return { ...state, user: { ...state.user, nickname: action.payload.nickname } }
        case MODIFY_NICKNAME_FAIL:      //修改昵称失败
            return state
        case MODIFY_NICKNAME_SUCCEED:   //修改密码成功
            return state
        case MODIFY_NICKNAME_FAIL:      //修改密码失败
            return state
        case MODIFY_AVATAR_SUCCEED:     //修改头像成功
            return {
                ...state,
                avatarSource: action.payload.avatarSource,
                user: { ...state.user, avatarUrl: action.payload.avatarUrl }
            }
        case MODIFY_AVATAR_FAIL:        //修改头像成功
            return state
        //设置
        case CHANGE_CONFIG_VOCA_PRON_TYPE:
            return { ...state, configVocaPronType: action.payload.configVocaPronType }
        case CHANGE_CONFIG_REVIEW_PLAY_TIMES:
            return { ...state, configReviewPlayTimes: action.payload.configReviewPlayTimes }
        case CHANGE_CONFIG_N_TRANS:
            return { ...state, configShowNTrans: action.payload.configShowNTrans }
        case CHANGE_CONFIG_M_TRANS:
            return { ...state, configShowMTrans: action.payload.configShowMTrans }

        // 退出登录
        case LOGOUT:
            return defaultState
        default:
            return state
    }
}