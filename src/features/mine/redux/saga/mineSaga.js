
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { DURATION } from 'react-native-easy-toast'
import { put, call, takeLatest } from 'redux-saga/effects'
import { SAVE_PLAN } from '../../../vocabulary/redux/action/planAction'
import { loginHandle, logoutHandle } from '../../common/userHandler'
import { USER_DIR } from '../../../../common/constant'
import FileService from '../../../../common/FileService'
import { store } from '../../../../redux/store'
const uuidv4 = require('uuid/v4');
import {
    // 验证码登录
    LOGIN_BY_CODE,
    LOGIN_BY_CODE_START,
    LOGIN_BY_CODE_SUCCEED,
    // 微信登录
    LOGIN_BY_WX,
    LOGIN_BY_WX_START,
    LOGIN_BY_WX_SUCCEED,
    // 昵称
    MODIFY_NICKNAME,
    MODIFY_NICKNAME_START,
    MODIFY_NICKNAME_SUCCEED,
    // 性别
    MODIFY_SEX,
    MODIFY_SEX_START,
    MODIFY_SEX_SUCCEED,

    // 密码
    MODIFY_PASSWORD,
    MODIFY_PASSWORD_START,
    MODIFY_PASSWORD_SUCCEED,
    // 头像
    MODIFY_AVATAR,
    MODIFY_AVATAR_START,
    MODIFY_AVATAR_SUCCEED,
    MODIFY_PHONE_START,
    MODIFY_PHONE_SUCCEED,
    MODIFY_WECHAT_START,
    MODIFY_WECHAT_SUCCEED,
    MODIFY_PHONE,
    MODIFY_WECHAT,
    MODIFY_AVATAR_FAIL
} from '../action/mineAction'

const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'




/**验证码登录 */
function* loginByCode(action) {
    yield put({ type: LOGIN_BY_CODE_START })
    const res = yield Http.post('/user/loginByCode', action.payload.params)
    if (res.status === 200) {
        const { credential, user, plan } = loginHandle(res.data, action.payload.navigation)
        if (plan) { //保存计划
            yield put({ type: SAVE_PLAN, payload: { plan } })
        }
        yield put({ type: LOGIN_BY_CODE_SUCCEED, payload: { credential, user } }) //保存user
    }
}


/**密码登录 */



/**微信登录 */
function* loginByWX(action) {
    yield put({ type: LOGIN_BY_WX_START })
    const res = yield Http.post('/user/loginByWX', action.payload.params)
    if (res.status === 200) {
        const { credential, user, plan } = loginHandle(res.data, action.payload.navigation)
        if (plan) { //保存计划
            yield put({ type: SAVE_PLAN, payload: { plan } })
        }
        yield put({ type: LOGIN_BY_WX_SUCCEED, payload: { credential, user } }) //保存user
    }
}



/**QQ登录 */



// 修改昵称
function* modifyNickname(action) {
    yield put({ type: MODIFY_NICKNAME_START })
    const res = yield Http.post('/user/modifyNickname', { nickname: action.payload.nickname })
    if (res.status === 200) {
        yield put({ type: MODIFY_NICKNAME_SUCCEED, payload: res.data })
    }
    action.payload.cb() //回调
}

// 修改性别
function* modifySex(action) {
    yield put({ type: MODIFY_SEX_START })
    const res = yield Http.post('/user/modifySex', { sex: action.payload.sex })
    if (res.status === 200) {
        yield put({ type: MODIFY_SEX_SUCCEED, payload: res.data })

    }
}


// 修改密码
function* modifyPwd(action) {
    yield put({ type: MODIFY_PASSWORD_START })
    const res = yield Http.post('/user/modifyPwd', { password: action.payload.password })
    if (res.status === 200) {
        yield put({ type: MODIFY_PASSWORD_SUCCEED, payload: res.data })
        action.payload.cb() //回调
    }
}

//修改头像
function* modifyAvatar(action) {
    store.getState().app.loader.show("上传中", DURATION.FOREVER)
    const { fileName, type, data } = action.payload.result
    yield put({ type: MODIFY_AVATAR_START })
    //上传
    const res = yield RNFetchBlob.fetch('POST', 'http://129.211.71.111:9000/m/user/modifyAvatar', {
        Authorization: action.payload.accessToken,
        'Content-Type': 'multipart/form-data',
    }, [
        { name: 'avatar', filename: fileName, type, data },
    ])
    if (res.respInfo.status === 200) {
        //下载
        const { avatarUrl } = JSON.parse(res.data)
        const res2 = yield FileService.getInstance().fetch(avatarUrl, DocumentDir + USER_DIR + uuidv4() + action.payload.result.fileName)
        if (res2) {
            avatarSource = { uri: Platform.OS === 'android' ? 'file://' + res2.path() : '' + res2.path() }
            yield put({ type: MODIFY_AVATAR_SUCCEED, payload: { avatarSource, avatarUrl: avatarUrl } })
        } else {
            yield put({ type: MODIFY_AVATAR_FAIL })
        }
    } else if (res.respInfo.status === 401) {
        // 退出登录
        logoutHandle()
        yield put({ type: MODIFY_AVATAR_FAIL })
    } else {
        // 失败
        store.getState().app.toast.show("上传头像失败")
        yield put({ type: MODIFY_AVATAR_FAIL })
    }
    store.getState().app.loader.close()
}


// 绑定微信
function* modifyWechat(action) {
    yield put({ type: MODIFY_WECHAT_START })
    const res = yield Http.post('/user/modifyWechat', { code: action.payload.code })
    if (res.status === 200) {
        yield put({ type: MODIFY_WECHAT_SUCCEED, payload: res.data })
    }
}

// 绑定QQ


// 绑定手机
function* modifyPhone(action) {
    const { phone, code } = action.payload
    yield put({ type: MODIFY_PHONE_START })
    const res = yield Http.post('/user/modifyPhone', {
        phone: phone,
        code: code
    })
    if (res.status === 200) {
        yield put({ type: MODIFY_PHONE_SUCCEED, payload: res.data })
        action.payload.cb() //回调
    }
}



export function* watchLoginByCode() {
    yield takeLatest(LOGIN_BY_CODE, loginByCode)
}

export function* watchLoginByWX() {
    yield takeLatest(LOGIN_BY_WX, loginByWX)
}


export function* watchModifyNickname() {
    yield takeLatest(MODIFY_NICKNAME, modifyNickname)
}
export function* watchModifySex() {
    yield takeLatest(MODIFY_SEX, modifySex)
}

export function* watchModifyPwd() {
    yield takeLatest(MODIFY_PASSWORD, modifyPwd)

}
export function* watchModifyAvatar() {
    yield takeLatest(MODIFY_AVATAR, modifyAvatar)

}


export function* watchModifyWechat() {
    yield takeLatest(MODIFY_WECHAT, modifyWechat)
}
export function* watchModifyPhone() {
    yield takeLatest(MODIFY_PHONE, modifyPhone)
}