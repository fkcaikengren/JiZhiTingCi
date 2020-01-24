
import Alipay from '@0x5e/react-native-alipay';
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

    /**支付宝支付 */
    payByAli = (orderStr) => {
        try {
            let response = Alipay.pay(orderStr);
            console.log(response);

            let { resultStatus, result, memo } = response;
            let { code, msg, app_id, out_trade_no, trade_no, total_amount, seller_id, charset, timestamp } = JSON.parse(result);

            // TODO: ...

        } catch (error) {
            console.error(error);
        }
    }



}