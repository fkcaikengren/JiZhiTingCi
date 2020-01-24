import { createActions } from 'redux-actions'

// 验证码登录
export const LOGIN_BY_CODE = 'LOGIN_BY_CODE'
export const LOGIN_BY_CODE_START = 'LOGIN_BY_CODE_START'
export const LOGIN_BY_CODE_SUCCEED = 'LOGIN_BY_CODE_SUCCEED'
export const LOGIN_BY_CODE_FAIL = 'LOGIN_BY_CODE_FAIL'

// 微信登录
export const LOGIN_BY_WX = 'LOGIN_BY_WX'
export const LOGIN_BY_WX_START = 'LOGIN_BY_WX_START'
export const LOGIN_BY_WX_SUCCEED = 'LOGIN_BY_WX_SUCCEED'
export const LOGIN_BY_WX_FAIL = 'LOGIN_BY_WX_FAIL'

// 个人中心
export const MODIFY_NICKNAME = 'MODIFY_NICKNAME'
export const MODIFY_NICKNAME_START = 'MODIFY_NICKNAME_START'
export const MODIFY_NICKNAME_SUCCEED = 'MODIFY_NICKNAME_SUCCEED'
export const MODIFY_NICKNAME_FAIL = 'MODIFY_NICKNAME_FAIL'

export const MODIFY_PASSWORD = 'MODIFY_PASSWORD'
export const MODIFY_PASSWORD_START = 'MODIFY_PASSWORD_START'
export const MODIFY_PASSWORD_SUCCEED = 'MODIFY_PASSWORD_SUCCEED'
export const MODIFY_PASSWORD_FAIL = 'MODIFY_PASSWORD_FAIL'

export const MODIFY_AVATAR = 'MODIFY_AVATAR'
export const MODIFY_AVATAR_START = 'MODIFY_AVATAR_START'
export const MODIFY_AVATAR_SUCCEED = 'MODIFY_AVATAR_SUCCEED'
export const MODIFY_AVATAR_FAIL = 'MODIFY_AVATAR_FAIL'

// 退出登录
export const LOGOUT = 'LOGOUT'


// 设置
export const CHANGE_CONFIG_VOCA_PRON_TYPE = 'CHANGE_CONFIG_VOCA_PRON_TYPE'
export const CHANGE_CONFIG_REVIEW_PLAY_TIMES = 'CHANGE_CONFIG_REVIEW_PLAY_TIMES'
export const CHANGE_CONFIG_N_TRANS = 'CHANGE_CONFIG_N_TRANS'
export const CHANGE_CONFIG_M_TRANS = 'CHANGE_CONFIG_M_TRANS'

const fn = (payload) => {
    return payload
}

export const { loginByCode, loginByWx,
    modifyNickname, modifyPassword, modifyAvatar, logout,
    changeConfigVocaPronType, changeConfigReviewPlayTimes, changeConfigNTrans, changeConfigMTrans } = createActions({
        [LOGIN_BY_CODE]: fn,
        [LOGIN_BY_WX]: fn,

        [MODIFY_NICKNAME]: fn,
        [MODIFY_PASSWORD]: fn,
        [MODIFY_AVATAR]: fn,
        [LOGOUT]: fn,

        // 设置
        [CHANGE_CONFIG_VOCA_PRON_TYPE]: (configVocaPronType) => {
            return { configVocaPronType }
        },
        [CHANGE_CONFIG_REVIEW_PLAY_TIMES]: (configReviewPlayTimes) => {
            return { configReviewPlayTimes }
        },
        [CHANGE_CONFIG_N_TRANS]: (configShowNTrans) => {
            return { configShowNTrans }
        },
        [CHANGE_CONFIG_M_TRANS]: (configShowMTrans) => {
            return { configShowMTrans }
        },
    })