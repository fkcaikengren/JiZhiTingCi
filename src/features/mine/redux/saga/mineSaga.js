
import { put, call, takeLatest } from 'redux-saga/effects'
import {
    LOGIN_BY_CODE,
    LOGIN_BY_CODE_START,
    LOGIN_BY_CODE_SUCCEED,
    MODIFY_NICKNAME,
    MODIFY_NICKNAME_START,
    MODIFY_NICKNAME_SUCCEED,
    MODIFY_PASSWORD,
    MODIFY_PASSWORD_START,
    MODIFY_PASSWORD_SUCCEED,

    MODIFY_AVATAR,
    MODIFY_AVATAR_START,
    MODIFY_AVATAR_SUCCEED
} from '../action/mineAction'
import {loginHandle} from '../../common/userHandler'
import { USER_DIR } from '../../../../common/constant'
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import FileService from '../../../../common/FileService'
const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'




/**验证码登录 */
function* loginByCode(action) {
    yield put({ type: LOGIN_BY_CODE_START })
    const res = yield Http.post('/user/loginByCode', action.payload)
    if (res.status === 200) {
        const userState = loginHandle(res.data)
        yield put({ type: LOGIN_BY_CODE_SUCCEED, payload: userState })
    }
}


/**密码登录 */
/**微信登录 */





// 修改昵称
function* modifyNickname(action) {
    yield put({ type: MODIFY_NICKNAME_START })
    const res = yield Http.post('/user/modifyNickname', { nickname: action.payload.nickname })
    if (res.status === 200) {
        yield put({ type: MODIFY_NICKNAME_SUCCEED, payload: res.data })
        action.payload.cb() //回调
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
    const {fileName,type,data} = action.payload.result
    yield put({ type: MODIFY_AVATAR_START })
    //上传
    const res = yield RNFetchBlob.fetch('POST', 'http://129.211.71.111:9000/m/user/modifyAvatar', {
        Authorization: action.payload.token,
        'Content-Type': 'multipart/form-data',
    }, [
        { name: 'avatar', filename:fileName, type, data },
    ])
    //下载
    const url = JSON.parse(res.data).avatarUrl
    console.log(url)
    const res2 = yield FileService.getInstance().fetch(url, DocumentDir + USER_DIR + action.payload.result.fileName)
    avatarSource = { uri: Platform.OS === 'android' ? 'file://' + res2.path() : '' + res2.path() }
    yield put({ type: MODIFY_AVATAR_SUCCEED, payload: { avatarSource, avatarUrl: url } })
}


export function* watchLoginByCode() {
    yield takeLatest(LOGIN_BY_CODE, loginByCode)

}


export function* watchModifyNickname() {
    yield takeLatest(MODIFY_NICKNAME, modifyNickname)
}

export function* watchModifyPwd() {
    yield takeLatest(MODIFY_PASSWORD, modifyPwd)

}
export function* watchModifyAvatar() {
    yield takeLatest(MODIFY_AVATAR, modifyAvatar)

}