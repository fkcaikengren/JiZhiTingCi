import React, { Component } from "react";
import { StyleSheet, StatusBar, ImageBackground, Image, View, Text, TouchableOpacity, BackHandler } from 'react-native'
import CardView from 'react-native-cardview'
import NetInfo from "@react-native-community/netinfo"

import AliIcon from '../../component/AliIcon'
import { connect } from "react-redux";
import gstyles from "../../style";
import WXService from "../../common/WXService";
import * as MineAction from './redux/action/mineAction'
import QQService from "../../common/QQService";


const styles = StyleSheet.create({
    loginBtn: {
        width: '76%',
        height: 50,
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 10,
    },
    emText: {
        textDecorationLine: 'underline',
        color: '#202020',
    }
})

class MainLoginPage extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                return false;
            }
            this.lastBackPressed = Date.now();
            this.props.app.toast.show('再按一次退出应用', 1000);
            return true;
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }



    render() {
        return (
            <ImageBackground
                source={require('../../image/login_bg.png')}
                style={[gstyles.c_start, { flex: 1 }]}>
                <StatusBar translucent={false} barStyle="dark-content" />
                {/* logo */}
                <CardView
                    cardElevation={5}
                    cardMaxElevation={5}
                    cornerRadius={20}
                    style={{ marginTop: 160 }}>
                    <Image
                        style={{ width: 90, height: 90, borderRadius: 10 }}
                        source={require('../../image/logo_icon.png')} />
                </CardView>

                <View style={[{ flex: 1, width: "100%" }, gstyles.c_center]}>
                    <View
                        style={[styles.loginBtn, { backgroundColor: '#30DE76' }]}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => {
                            NetInfo.fetch().then(async (state) => {
                                if (state.isConnected) {
                                    const code = await WXService.getInstance().getCode()
                                    if (code) {
                                        this.props.loginByWx({
                                            params: { code },
                                            navigation: this.props.navigation
                                        })
                                    }
                                } else {
                                    this.props.app.toast.show('请检查网络!', 1000)
                                }
                            })

                        }}
                    >
                        <AliIcon name='weixin' size={25} color='#FFF'></AliIcon>
                        <Text style={styles.loginText}>微信登录</Text>
                    </View>
                    <View
                        style={[styles.loginBtn, { backgroundColor: '#3EC6FB' }]}
                        onStartShouldSetResponder={() => true}
                        onResponderStart={(e) => {
                            NetInfo.fetch().then(async (state) => {
                                if (state.isConnected) {
                                    const result = await QQService.getInstance().getAccess()
                                    if (result) {
                                        this.props.loginByQq({
                                            params: {
                                                access_token: result.access_token,
                                                openid: result.openid,
                                                oauth_consumer_key: result.oauth_consumer_key
                                            },
                                            navigation: this.props.navigation
                                        })
                                    }
                                } else {
                                    this.props.app.toast.show('请检查网络!', 1000)
                                }
                            })

                        }}
                    >
                        <AliIcon name='qq' size={24} color='#FFF'></AliIcon>
                        <Text style={styles.loginText}>QQ登录</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            this.props.navigation.navigate("PhoneLogin")
                        }}>
                            <Text style={gstyles.md_black}>其他登录方式</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={[gstyles.r_center, { marginBottom: 10 }]}>
                    <Text>登录即代表阅读并同意</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.props.navigation.navigate('H5', {
                            'title': '服务条款',
                            'url': 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/app/service.html'
                        })
                    }}>
                        <Text style={styles.emText}>服务条款</Text>
                    </TouchableOpacity>
                    <Text>和</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        this.props.navigation.navigate('H5', {
                            'title': '隐私政策',
                            'url': 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/app/privacy.html'
                        })
                    }}>
                        <Text style={styles.emText}>隐私政策</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground >
        )
    }
}



const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine
})

const mapDispatchToProps = {
    loginByWx: MineAction.loginByWx,
    loginByQq: MineAction.loginByQq,
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLoginPage);