import React, { Component } from "react";
import { StyleSheet, StatusBar, ImageBackground, Image, View, Text, TouchableOpacity, BackHandler } from 'react-native'
import CardView from 'react-native-cardview'
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements'
import NetInfo from "@react-native-community/netinfo"
import RNExitApp from 'react-native-exit-app';

import AliIcon from '../../component/AliIcon'
import { connect } from "react-redux";
import gstyles from "../../style";
import WXService from "../../common/WXService";
import * as MineAction from './redux/action/mineAction'
import QQService from "../../common/QQService";


const styles = StyleSheet.create({
    modal: {
        width: '80%',
        height: 350,
        backgroundColor: "#FFF",
        borderRadius: 10,
    },
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

        this.state = {
            isOpen: true
        }
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


    _openModal = () => {
        this.setState({ isOpen: true });
    }

    _closeModal = () => {
        this.setState({ isOpen: false });
    }

    createModal() {
        return <Modal style={[styles.modal, gstyles.c_start]}
            isOpen={this.state.isOpen}
            onOpened={this._openModal}
            onClosed={this._closeModal}
            backdrop={true}
            backdropPressToClose={false}
            swipeToClose={false}
            position={'center'}
            animationDuration={1}
        >
            <View style={[gstyles.c_center, { height: '85%', paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#AAA' }]}>
                <Text style={[gstyles.lg_black, { lineHeight: 30 }]}> 服务协议和隐私政策</Text>
                <Text numberOfLines={20} style={{ fontSize: 16, color: '#555' }}>
                    请你务必审慎阅读，充分理解“服务协议”和“隐私政策”各条款，包括但不限于，为了向你提供单词学习服务，我们需要收集你的设备信息、操作日志等个人信息，你可以在设置中查看、变更、删除个人信息并管理你的授权。你可以阅读<Text style={{ color: '#1890FF' }} onPress={() => {
                        this.props.navigation.navigate('H5', {
                            'title': '服务协议',
                            'url': 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/app/service.html'
                        })
                    }}>《服务协议》</Text>和<Text style={{ color: '#1890FF' }} onPress={() => {
                        this.props.navigation.navigate('H5', {
                            'title': '隐私政策',
                            'url': 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/app/privacy.html'
                        })
                    }}>《隐私政策》</Text>了解详细信息。如你同意，请点击“同意”开始接受我们的服务。
                </Text>
            </View>
            <View style={[{ flex: 1, height: '15%' }, gstyles.r_around]}>
                <Button type='clear' onPress={() => {
                    RNExitApp.exitApp();
                }}
                    title='暂不使用'
                    titleStyle={gstyles.lg_black}
                    containerStyle={{ flex: 1 }}>
                </Button>
                <Button type='clear' onPress={() => {
                    this._closeModal()
                }}
                    title='同意'
                    titleStyle={[gstyles.lg_black, { color: '#1890FF' }]}
                    containerStyle={{ flex: 1 }} >
                </Button>
            </View>
        </Modal>

    }



    render() {
        return (
            <ImageBackground
                source={require('../../image/login_bg.png')}
                style={[gstyles.c_start, { flex: 1 }]}>
                <StatusBar translucent={false} barStyle="dark-content" />
                {/* logo */}
                <Image
                    style={{ marginTop: 160, width: 90, height: 90, borderRadius: 10 }}
                    source={require('../../image/logo_icon.png')} />

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

                {
                    this.createModal()
                }
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