import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import WXService from '../common/WXService';
import gstyles from '../style';
import AliIcon from './AliIcon';
import _util from '../common/util';
import AliPayService from '../common/AliPayService';
import { store } from '../redux/store'




/**
 * 关于CommonModal的展示模板
 */
export default class PayTemplate {

    // payInfo参数说明
    // {
    //     productName: "产品名称",
    //     totalAmount: 6, //产品价格（元）
    //     body: "产品描述",
    //     productCode: "abc123" //产品编码（资源id）
    // }
    static _renderPay = ({ commonModal, payInfo, onFail, onSucceed }) => {
        console.log(payInfo)
        return () => {
            const {
                hide
            } = commonModal

            return <View style={[gstyles.c_end, { flex: 1, width: "100%", height: '100%', backgroundColor: "#FFF" }]}>

                <View style={gstyles.c_center}>
                    <Text style={gstyles.md_black}>爱听词</Text>
                    <Text style={{ fontSize: 30, color: gstyles.emColor, marginVertical: 20 }}>{payInfo.totalAmount.toFixed(2)}元</Text>
                </View>
                <View
                    style={[{ width: "90%", height: 60, borderTopWidth: 1, borderColor: "#EEE" }, gstyles.r_between]}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={async (e) => {
                        // 微信支付
                        const res = await Http.post('/vocaBook/getOrderInfoByWX', payInfo)
                        if (res.status === 200) {
                            await WXService.getInstance().payByWX(res.data, () => {
                                hide()
                                store.getState().app.toast.show('支付失败！请稍后重试', 2000)
                                if (onFail) {
                                    onFail()
                                }
                            }, () => {
                                hide()
                                if (onSucceed) {
                                    onSucceed()
                                }
                            })

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
                        const res = await Http.post('/vocaBook/getOrderInfoByAli', payInfo)
                        // 支付宝支付
                        if (res.status === 200) {
                            await AliPayService.getInstance().payByAli(res.data, () => {
                                hide()
                                store.getState().app.toast.show('支付失败！请稍后重试', 2000)
                                if (onFail) {
                                    onFail()
                                }
                            }, () => {
                                hide()
                                if (onSucceed) {
                                    onSucceed()
                                }
                            })
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
        commonModal, payInfo
    }) {
        const {
            show,
        } = commonModal
        show({
            renderContent: this._renderPay({ commonModal, payInfo }),
            modalStyle: {
                width: '100%',
                height: 240,
                backgroundColor: "#FFF",
            },
            backdropPressToClose: true,
            position: 'bottom'

        })
    }
}
