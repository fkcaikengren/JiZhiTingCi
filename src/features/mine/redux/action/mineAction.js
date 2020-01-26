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

// 修改密码
export const MODIFY_NICKNAME = 'MODIFY_NICKNAME'
export const MODIFY_NICKNAME_START = 'MODIFY_NICKNAME_START'
export const MODIFY_NICKNAME_SUCCEED = 'MODIFY_NICKNAME_SUCCEED'
export const MODIFY_NICKNAME_FAIL = 'MODIFY_NICKNAME_FAIL'

// 修改性别
export const MODIFY_SEX = 'MODIFY_SEX'
export const MODIFY_SEX_START = 'MODIFY_SEX_START'
export const MODIFY_SEX_SUCCEED = 'MODIFY_SEX_SUCCEED'
export const MODIFY_SEX_FAIL = 'MODIFY_SEX_FAIL'

// 修改密码
export const MODIFY_PASSWORD = 'MODIFY_PASSWORD'
export const MODIFY_PASSWORD_START = 'MODIFY_PASSWORD_START'
export const MODIFY_PASSWORD_SUCCEED = 'MODIFY_PASSWORD_SUCCEED'
export const MODIFY_PASSWORD_FAIL = 'MODIFY_PASSWORD_FAIL'

// 修改头像
export const MODIFY_AVATAR = 'MODIFY_AVATAR'
export const MODIFY_AVATAR_START = 'MODIFY_AVATAR_START'
export const MODIFY_AVATAR_SUCCEED = 'MODIFY_AVATAR_SUCCEED'
export const MODIFY_AVATAR_FAIL = 'MODIFY_AVATAR_FAIL'


// 绑定微信
export const MODIFY_WECHAT = 'MODIFY_WECHAT'
export const MODIFY_WECHAT_START = 'MODIFY_WECHAT_START'
export const MODIFY_WECHAT_SUCCEED = 'MODIFY_WECHAT_SUCCEED'
export const MODIFY_WECHAT_FAIL = 'MODIFY_WECHAT_FAIL'


// 绑定QQ
export const MODIFY_QQ = 'MODIFY_QQ'
export const MODIFY_QQ_START = 'MODIFY_QQ_START'
export const MODIFY_QQ_SUCCEED = 'MODIFY_QQ_SUCCEED'
export const MODIFY_QQ_FAIL = 'MODIFY_QQ_FAIL'


// 绑定手机
export const MODIFY_PHONE = 'MODIFY_PHONE'
export const MODIFY_PHONE_START = 'MODIFY_PHONE_START'
export const MODIFY_PHONE_SUCCEED = 'MODIFY_PHONE_SUCCEED'
export const MODIFY_PHONE_FAIL = 'MODIFY_PHONE_FAIL'

// 设置头像
export const SET_AVATAR_SOURCE = 'SET_AVATAR_SOURCE'

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
    modifyNickname, modifySex, modifyPassword, modifyAvatar, modifyWechat, modify_Qq, modifyPhone,
    setAvatarSource, logout,
    changeConfigVocaPronType, changeConfigReviewPlayTimes, changeConfigNTrans, changeConfigMTrans } = createActions({
        [LOGIN_BY_CODE]: fn,
        [LOGIN_BY_WX]: fn,

        [MODIFY_NICKNAME]: fn,
        [MODIFY_SEX]: fn,
        [MODIFY_PASSWORD]: fn,
        [MODIFY_AVATAR]: fn,


        [MODIFY_WECHAT]: fn,
        [MODIFY_QQ]: fn,
        [MODIFY_PHONE]: fn,


        // 设置头像
        [SET_AVATAR_SOURCE]: fn,

        // 退出登录
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