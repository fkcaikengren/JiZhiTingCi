import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import WXService from '../common/WXService';
import gstyles from '../style';
import AliIcon from './AliIcon';
import _util from '../common/util';
import AliPayService from '../common/AliPayService';



const alipay = async () => {

}



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
                <View
                    style={[{ width: "90%", height: 60, borderTopWidth: 1, borderColor: "#EEE" }, gstyles.r_between]}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={async (e) => {
                        // 从服务端获取支付订单信息
                        const params = {
                            productName: "四级词组(乱序)",
                            totalAmount: 0.01,
                            body: "Mac pro 12",
                            productCode: "VOCABOOK_123456"
                        }
                        const res = await Http.post('/vocaBook/getOrderInfoByWX', params)
                        console.log(res)
                        if (res.status === 200) {
                            await WXService.getInstance().payByWX(res.data)
                        }
                    }}>
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
                            AliPayService.getInstance().payByAli(res.data)
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
