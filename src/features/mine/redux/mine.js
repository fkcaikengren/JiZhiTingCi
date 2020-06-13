import {
    LOGIN_BY_PWD_SUCCEED,
    LOGIN_BY_CODE_SUCCEED,
    LOGIN_BY_WX_SUCCEED,
    LOGIN_BY_QQ_SUCCEED,

    MODIFY_NICKNAME_SUCCEED,
    MODIFY_NICKNAME_FAIL,
    MODIFY_AVATAR_SUCCEED,
    MODIFY_AVATAR_FAIL,

    LOGOUT,
    CHANGE_CONFIG_REVIEW_PLAY_TIMES,
    CHANGE_CONFIG_N_TRANS,
    CHANGE_CONFIG_M_TRANS,
    CHANGE_CONFIG_AUTO_PLAY_SEN,
    CHANGE_CONFIG_VOCA_PRON_TYPE,

    SET_AVATAR_SOURCE,
    MODIFY_SEX_SUCCEED,
    MODIFY_SEX_FAIL,
    MODIFY_PASSWORD_SUCCEED,
    MODIFY_PASSWORD_FAIL,
    MODIFY_WECHAT_SUCCEED,
    MODIFY_WECHAT_FAIL,
    MODIFY_PHONE_SUCCEED,
    MODIFY_PHONE_FAIL,
    MODIFY_CREDENTIAL,
    MODIFY_QQ_SUCCEED,
    MODIFY_QQ_FAIL,
    ADD_MESSAGES,
    READ_MESSAGE,
    CHANGE_HAS_NEW_MESSAGE

} from "./action/mineAction"
import { VOCA_PRON_TYPE_AM, VOCA_PRON_TYPE_EN } from "../../vocabulary/common/constant"


const defaultState = {
    credential: {},
    user: {},
    avatarSource: null,
    messages: [],           //消息
    hasNewMessage: false,   //有新消息

    //学习设置
    configVocaPronType: VOCA_PRON_TYPE_EN,  //发音类型
    configReviewPlayTimes: 8,              //复习轮播次数
    configShowNTrans: true,
    configShowMTrans: true,
    configAutoPlaySen: true

}

export const mine = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_BY_CODE_SUCCEED: {//验证码登录成功
            console.log('验证码登录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }
        case LOGIN_BY_PWD_SUCCEED: {//密码登录成功
            console.log('密码登录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }
        case LOGIN_BY_WX_SUCCEED: {  //微信登录成功
            console.log('----微信登录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }
        case LOGIN_BY_QQ_SUCCEED: {  //QQ登录成功
            console.log('----QQ录成功')
            const { credential, user } = action.payload
            return { ...state, credential, user }
        }
        case MODIFY_NICKNAME_SUCCEED:   //修改昵称成功
            return { ...state, user: { ...state.user, nickname: action.payload.nickname } }
        case MODIFY_NICKNAME_FAIL:      //修改昵称失败
            return state
        case MODIFY_SEX_SUCCEED:        //修改性别成功
            return { ...state, user: { ...state.user, sex: action.payload.sex } }
        case MODIFY_SEX_FAIL:           //修改性别失败
            return state
        case MODIFY_PASSWORD_SUCCEED:   //修改密码成功
            return state
        case MODIFY_PASSWORD_FAIL:      //修改密码失败
            return state
        case MODIFY_AVATAR_SUCCEED:     //修改头像成功
            return {
                ...state,
                avatarSource: action.payload.avatarSource,
                user: { ...state.user, avatarUrl: action.payload.avatarUrl }
            }
        case MODIFY_AVATAR_FAIL:        //修改头像成功
            return state

        case MODIFY_WECHAT_SUCCEED:        //绑定微信成功
            return { ...state, user: { ...state.user, wechat: action.payload.wechat } }
        case MODIFY_WECHAT_FAIL:           //绑定微信失败
            return state
        case MODIFY_QQ_SUCCEED:        //绑定QQ成功
            return { ...state, user: { ...state.user, qq: action.payload.qq } }
        case MODIFY_QQ_FAIL:           //绑定QQ失败
            return state
        case MODIFY_PHONE_SUCCEED:        //绑定手机成功
            return { ...state, user: { ...state.user, phone: action.payload.phone } }
        case MODIFY_PHONE_FAIL:           //绑定手机失败
            return state


        case SET_AVATAR_SOURCE:         //设置头像source
            return { ...state, avatarSource: action.payload.avatarSource }
        case MODIFY_CREDENTIAL:
            console.log("--------------mine.js 修改token-------------------")
            return { ...state, credential: action.payload.credential }
        //设置
        case CHANGE_CONFIG_VOCA_PRON_TYPE:
            return { ...state, configVocaPronType: action.payload.configVocaPronType }
        case CHANGE_CONFIG_REVIEW_PLAY_TIMES:
            return { ...state, configReviewPlayTimes: action.payload.configReviewPlayTimes }
        case CHANGE_CONFIG_N_TRANS:
            return { ...state, configShowNTrans: action.payload.configShowNTrans }
        case CHANGE_CONFIG_M_TRANS:
            return { ...state, configShowMTrans: action.payload.configShowMTrans }
        case CHANGE_CONFIG_AUTO_PLAY_SEN:
            return { ...state, configAutoPlaySen: action.payload.configAutoPlaySen }

        //消息
        case ADD_MESSAGES:
            return { ...state, messages: action.payload.messages.concat(state.messages) }
        //已读消息
        case READ_MESSAGE: {
            const nowMessages = state.messages.map((item, _) => {
                if (action.payload.msgId === item._id) {
                    item.isNewMessage = false
                }
                return item
            })
            return { ...state, messages: nowMessages }
        }
        //是否有新消息
        case CHANGE_HAS_NEW_MESSAGE:
            return { ...state, hasNewMessage: action.payload.hasNewMessage }
        // 退出登录
        case LOGOUT:
            console.log("--------------mine.js 退出登录-------------------")
            return defaultState
        default:
            return state
    }
}