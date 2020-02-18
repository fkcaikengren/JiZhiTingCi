
import * as QQAPI from 'react-native-qq';

/**QQ业务 */
export default class QQService {
    constructor() {
        console.disableYellowBox = true
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new QQService();
        }
        return this.instance;
    }


    /**
     * QQ登录
     */
    getAccess = async () => {
        try {
            const result = await QQAPI.login()
            const { errCode } = result
            if (errCode === 0) {
                return result
            } else {
                store.getState().app.toast.show('QQ授权失败：' + err.message, 2000)
            }
        } catch (err) {
            store.getState().app.toast.show('QQ授权失败：' + err.message, 2000)
        }
        return null
    }

    /**
     * 分享到QQ好友或群
     */
    shareToQQ = async (shareInfo, onFail, onSucceed) => {
        try {
            const result = await QQAPI.shareToQQ(shareInfo)
            console.log(result)
            if (onSucceed) {
                onSucceed()
            }
        } catch (err) {
            if (err) {
                console.log(err)
                if (onFail) {
                    onFail()
                }
            }
        }
    }

    /**
     * 分享到空间
     */
    shareToQzone = async (shareInfo, onFail, onSucceed) => {
        try {
            const result = await QQAPI.shareToQzone(shareInfo)
            console.log(result)
            if (onSucceed) {
                onSucceed()
            }
        } catch (err) {
            if (err) {
                console.log(err)
                if (onFail) {
                    onFail()
                }
            }
        }
    }
}