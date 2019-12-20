import {
    LOGIN_BY_CODE_SUCCEED,
    LOGIN_BY_CODE_FAIL,
    MODIFY_NICKNAME_SUCCEED, 
    MODIFY_NICKNAME_FAIL,
    MODIFY_AVATAR_SUCCEED, 
    MODIFY_AVATAR_FAIL,
    LOGOUT
} from "./action/mineAction"
import { VOCA_PRON_TYPE_AM } from "../../vocabulary/common/constant"


const defaultState = {
    token: null,
    user: {},
    avatarSource: null,

    //发音类型
    vocaPronType: VOCA_PRON_TYPE_AM, 
    //复习轮播次数
    reviewPlayTimes: 10             
}

export const mine = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_BY_CODE_SUCCEED: //登录成功
            const { token, user } = action.payload
            return { ...state, token, user }
        case LOGIN_BY_CODE_FAIL:    //登录失败
            return { ...state, }
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
        case LOGOUT:
            return defaultState
        default:
            return state
    }
}