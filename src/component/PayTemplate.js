import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import Alipay from '@0x5e/react-native-alipay';
import gstyles from '../style';
import AliIcon from './AliIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';

/**
 * 关于CommonModal的展示模板
 */
export default class PayTemplate {

    static _renderPay = ({ commonModal }) => {
        return () => {
            const {
                hide
            } = commonModal

            return <View style={[gstyles.c_end, { flex: 1, width: "100%", height: '100%', backgroundColor: "#FFF" }]}>
                <View style={{ position: "absolute", top: 5, right: 5 }}>
                    <AliIcon name='guanbi' size={26} color='#555' onPress={() => {
                        hide()
                    }} />
                </View>
                <View style={gstyles.c_center}>
                    <Text style={gstyles.md_black}>爱听词</Text>
                    <Text style={{ fontSize: 30, color: gstyles.emColor, marginVertical: 20 }}>6.00元</Text>
                </View>
                <View style={[{ width: "90%", height: 60, borderTopWidth: 1, borderColor: "#EEE" }, gstyles.r_between]}>
                    <View style={gstyles.r_start}>
                        <AliIcon name='weixinzhifu' size={32} color='#0AAF36'></AliIcon>
                        <Text style={[gstyles.md_black, { marginLeft: 20 }]}>微信支付</Text>
                    </View>

                    <AliIcon name='youjiantou' size={26} color='#AAA'></AliIcon>
                </View>
                <View
                    style={[{ width: "90%", height: 60, borderTopWidth: 1, borderColor: "#EEE" }, gstyles.r_between]}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={async (e) => {
                        // 获取订单信息
                        const res = await Http.post('/vocaBook/getOrderInfo', {
                            productName: "四级词组(乱序)",
                            totalAmount: 0.01,
                            body: "vocaBook 1",
                            productCode: "VOCABOOK_123456"
                        })
                        // APP支付
                        if (res.status === 200) {
                            try {
                                let orderStr = res.data
                                let response = await Alipay.pay(orderStr);
                                console.log(response);

                                let { resultStatus, result, memo } = response;
                                let { code, msg, app_id, out_trade_no, trade_no, total_amount, seller_id, charset, timestamp } = JSON.parse(result);

                                // TODO: ...

                            } catch (error) {
                                console.error(error);
                            }
                        }
                    }}
                >
                    <View style={gstyles.r_start}>
                        <AliIcon name='zhifubao-copy' size={31} color='#01A3DC' />
                        <Text style={[gstyles.md_black, { marginLeft: 20 }]}>支付宝支付</Text>
                    </View>
                    <AliIcon name='youjiantou' size={26} color='#AAA'></AliIcon>
                </View>

            </View>
        }
    }



    static show({
        commonModal,
    }) {
        const {
            show,
        } = commonModal
        show({
            renderContent: this._renderPay({ commonModal }),
            modalStyle: {
                width: '100%',
                height: 240,
                backgroundColor: "#FFF",
            },
            position: 'bottom'
        })
    }
}
