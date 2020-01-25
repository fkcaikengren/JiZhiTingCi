
import { Platform } from 'react-native';
import * as wechat from 'react-native-wechat'
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
            wechat.registerApp(AppId)
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
        const isInstalled = await wechat.isWXAppInstalled()
        if (isInstalled) {
            //发送授权请求
            try {
                const response = await wechat.sendAuthRequest(scope, state)
                const { errCode, code } = response
                if (errCode === 0) {//用户同意
                    console.log(code)
                    return code
                }
            } catch (err) {
                store.getState().app.toast.show('授权失败：' + err.message, 2000)
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
        const isInstalled = await wechat.isWXAppInstalled()
        if (isInstalled) {
            try {
                const { errCode, errStr } = await wechat.pay(
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




}