
import * as Wechat from 'react-native-wechat'
import _util from './util';
import { store } from '../redux/store'

const AppId = "wx7fb52520674db501"

/**微信业务 */
export default class WXService {
    constructor() {
        console.disableYellowBox = true
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            // 初始化wechat
            Wechat.registerApp(AppId)
            this.instance = new WXService();
        }
        return this.instance;
    }


    /**
     * @function 微信认证
     * @returns code 
     */
    getCode = async () => {
        const scope = 'snsapi_userinfo';        //只获取用户信息
        const state = _util.generateMixed(5);   //状态：填随机数
        //判断微信是否安装
        const isInstalled = await Wechat.isWXAppInstalled()
        if (isInstalled) {
            //发送授权请求
            try {
                const response = await Wechat.sendAuthRequest(scope, state)
                const { errCode, code } = response
                if (errCode === 0) {//用户同意
                    return code
                } else {
                    store.getState().app.toast.show('微信授权失败：' + err.message, 2000)
                }
            } catch (err) {
                store.getState().app.toast.show('微信授权失败：' + err.message, 2000)
            }
        } else {
            store.getState().app.toast.show('没有安装微信软件，请您安装微信之后再试', 2000)
        }
        return null
    };



    /**
     * @function 微信支付
     * @param order 订单信息
     * @param onFail 失败回调
     * @param onSucceed 成功回调
     */
    payByWX = async (order, onFail, onSucceed) => {
        const {
            appid,
            partnerid,
            prepayid,
            noncestr,
            timestamp,
            sign
        } = order
        const isInstalled = await Wechat.isWXAppInstalled()
        if (isInstalled) {
            try {
                const { errCode, errStr } = await Wechat.pay(
                    {
                        partnerId: partnerid,       // 商家向财付通申请的商家id
                        prepayId: prepayid,         // 预支付订单id
                        nonceStr: noncestr,         // 随机串，防重发
                        timeStamp: timestamp,       // 时间戳，防重发
                        package: order.package,      // 商家根据财付通文档填写的数据和签名
                        sign: sign                  // 商家根据微信开放平台文档对数据做的签名
                    }
                )
                if (errCode === 0) {//成功
                    if (onSucceed) {
                        onSucceed()
                    }
                } else {
                    if (onFail) {
                        onFail()
                    }
                }
            } catch (err) {
                if (onFail) {
                    onFail()
                }
                console.log(err)
            }
        } else {
            store.getState().app.toast.show('没有安装微信软件，请您安装微信之后再试', 2000)
        }
    }



    /**
     * 分享朋友圈
     * @param params 生成海报的请求参数，图片分享需要；news分享传null
     * @param shareInfo 分享的信息 
     * @param onFail 失败回调
     * @param onSucceed 成功回调
     */
    shareToTimeline = async (shareInfo, onFail, onSucceed) => {
        //判断微信是否安装
        const isInstalled = await Wechat.isWXAppInstalled()
        if (isInstalled) {
            try {
                const result = await Wechat.shareToTimeline(shareInfo)
                console.log('share to time line :', result);
                if (result.errCode === 0) {
                    if (onSucceed) {
                        onSucceed()
                    }
                } else {
                    if (onFail) {
                        onFail()
                    }
                }
            } catch (err) {
                console.log(err)
                if (onFail) {
                    onFail()
                }
            }

        } else {
            store.getState().app.toast.show('没有安装微信软件，请您安装微信之后再试', 2000)
        }
    }

    /**
     * 分享给好友或群
     * @param params 生成海报的请求参数，图片分享需要；news分享传null
     * @param shareInfo 分享的信息 
     * @param onFail 失败回调
     * @param onSucceed 成功回调
     */
    shareToSession = async (shareInfo, onFail, onSucceed) => {
        console.log(shareInfo)
        //判断微信是否安装
        const isInstalled = await Wechat.isWXAppInstalled()
        if (isInstalled) {
            try {
                const result = await Wechat.shareToSession(shareInfo)
                console.log('share to session :', result);
                if (result.errCode === 0) {
                    if (onSucceed) {
                        onSucceed()
                    }
                } else {
                    if (onFail) {
                        onFail()
                    }
                }
            } catch (err) {
                if (onFail) {
                    onFail()
                }
            }

        } else {
            store.getState().app.toast.show('没有安装微信软件，请您安装微信之后再试', 2000)
        }
    }

}