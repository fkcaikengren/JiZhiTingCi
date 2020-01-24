
import { Platform } from 'react-native';
import * as wechat from 'react-native-wechat'
import _util from './util';

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

    /** 微信认证 */
    getCode = async () => {
        const scope = 'snsapi_userinfo';        //只获取用户信息
        const state = _util.generateMixed(5);   //状态：填随机数
        //判断微信是否安装
        const isInstalled = await wechat.isWXAppInstalled()
        if (isInstalled) {
            //发送授权请求
            try {
                const response = await wechat.sendAuthRequest(scope, state)
                console.log('--------微信登录结果----------------------')
                const { errCode, code } = response
                if (errCode === 0) {//用户同意
                    console.log(code)
                    return code
                }
            } catch (err) {
                alert('登录授权发生错误：', err.message, [
                    { text: '确定' }
                ]);
            }
        } else {
            Platform.OS == 'ios' ?
                alert('没有安装微信', '是否安装微信？', [
                    { text: '取消' },
                    { text: '确定' }
                ]) :
                alert('没有安装微信', '请先安装微信客户端在进行登录', [
                    { text: '确定' }
                ])
        }
        return null
    };



    /**微信支付 */
    payByWX = async (data) => {
        const {
            appid,
            partnerid,
            prepayid,
            noncestr,
            timestamp,
            sign
        } = data
        console.log(data)
        const isInstalled = await wechat.isWXAppInstalled()
        if (isInstalled) {
            try {
                const result = await wechat.pay(
                    {
                        partnerId: partnerid,       // 商家向财付通申请的商家id
                        prepayId: prepayid,         // 预支付订单id
                        nonceStr: noncestr,         // 随机串，防重发
                        timeStamp: timestamp,       // 时间戳，防重发
                        package: data.package,      // 商家根据财付通文档填写的数据和签名
                        sign: sign                  // 商家根据微信开放平台文档对数据做的签名
                    }
                )
                console.log(result)

            } catch (err) {
                console.log(err)
            }
        } else {
            alert('没有安装微信软件，请您安装微信之后再试');
        }
    }




}