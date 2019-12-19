import {
    LOGIN_BY_CODE_SUCCEED,
    LOGIN_BY_CODE_FAIL,
    MODIFY_NICKNAME_SUCCEED, 
    MODIFY_NICKNAME_FAIL,
    MODIFY_AVATAR_SUCCEED, 
    MODIFY_AVATAR_FAIL,
    CLEAR_TOKEN
} from "./action/mineAction"


const defaultState = {
    token: null,
    user: {},
    avatarSource: null,
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
        case CLEAR_TOKEN:
            return {...state,token:null}
        default:
            return state
    }
}