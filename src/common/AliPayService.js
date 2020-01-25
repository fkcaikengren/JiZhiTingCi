
import Alipay from '@0x5e/react-native-alipay';
import { store } from '../redux/store'


/** 支付宝业务 */
export default class AliPayService {
    constructor() {
        console.disableYellowBox = true
    }

    //单例模式
    static getInstance() {
        if (!this.instance) {
            this.instance = new AliPayService();
        }
        return this.instance;
    }

    /**
     * @function 支付宝支付
     * @param onFail
     * @param onSucceed
     */
    payByAli = async (order, onFail, onSucceed) => {
        try {
            const response = await Alipay.pay(order);

            const { resultStatus, result } = response;

            if (parseInt(resultStatus) === 9000) {
                const resultObj = JSON.parse(result);
                let { code, msg } = resultObj.alipay_trade_app_pay_response
                if (parseInt(code) === 10000) {
                    if (onSucceed) {
                        onSucceed()
                    }
                } else {
                    if (onFail) {
                        onFail()
                    }
                }
            } else {
                if (onFail) {
                    onFail()
                }
            }
        } catch (error) {
            if (onFail) {
                onFail()
            }
            console.error(error);
        }
    }



}