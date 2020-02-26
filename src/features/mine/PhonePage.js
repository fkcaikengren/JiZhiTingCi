import React, { Component } from "react";
import { TextInput, StyleSheet, View, Text, TouchableOpacity, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { Header, Button, Input } from 'react-native-elements'
import AliIcon from '../../component/AliIcon'
import gstyles from "../../style";
import * as MineAction from './redux/action/mineAction'
const Dimensions = require('Dimensions');
let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    phoneInput: {
        width: '100%',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: gstyles.gray,
        borderRadius: 100,
        height: 50,
        paddingLeft: 20,
    }

})



class PhonePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: '',                //手机号
            code: '',                 //验证码
            isPhoneRight: false,
            codeBorderColor: '#D0D0D0',
            codeMode: false,     //是否是在验证码模式
        }
        console.disableYellowBox = true
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }


    // 更改手机号码
    _changePhone = (phone) => {
        let isPhoneRight = /^1[3456789]\d{9}$/.test(phone)
        if (!isPhoneRight) {
            console.log("手机号码有误，请重填");
        }
        this.setState({ phone, isPhoneRight })
    }

    //发送验证码
    _requestCode = () => {
        this.setState({ codeMode: true })
        let param = { phone: this.state.phone }
        //服务器发送验证码
        Http.post('/user/getCode', param).then(res => {
            if (res.status === 200) {
                this.props.app.toast.show('发送成功')
            }
        })
    }


    //取消登录
    _cancel = () => {
        this.setState({ codeMode: false, codeBorderColor: '#D0D0D0', code: '' })
    }

    render() {

        return (
            <View style={[gstyles.c_start, { flex: 1, backgroundColor: '#FFF' }]}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '绑定手机', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={[gstyles.c_start, { width: width - 60, marginTop: 50 }]}>
                    {/* 如果是输入手机号模式  */}
                    {!this.state.codeMode &&
                        <View style={{ width: '100%' }}>
                            <View style={[gstyles.r_start, styles.phoneInput]}>
                                <AliIcon name="shouji" size={26} color={gstyles.gray} />
                                <TextInput
                                    placeholder="手机号"
                                    maxLength={11}
                                    style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                                    value={this.state.searchText}
                                    onChangeText={this._changePhone}
                                    value={this.state.phone}
                                    keyboardType='numeric'
                                />
                            </View>
                            {/* 登录按钮 */}
                            <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
                                <Button
                                    disabled={!this.state.isPhoneRight}
                                    title="发送验证码"
                                    titleStyle={gstyles.md_black}
                                    buttonStyle={{ height: gstyles.mdHeight, backgroundColor: gstyles.mainColor, borderRadius: 100 }}
                                    containerStyle={{ width: '100%' }}
                                    onPress={this._requestCode}
                                />
                            </View>
                        </View>

                    }


                    {/* 验证码模式下 */}
                    {this.state.codeMode &&
                        <View style={{ width: '100%' }}>
                            <View style={[gstyles.r_start, styles.phoneInput]}>
                                <AliIcon name="anquanzhuye-copy" size={24} color={gstyles.gray} />
                                <TextInput
                                    ref={ref => this._inputRef = ref}
                                    placeholder="验证码"
                                    maxLength={6}
                                    style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                                    onChangeText={(text) => this.setState({ code: text })}
                                    value={this.state.code}
                                    keyboardType='numeric'
                                />
                            </View>
                            {/* 登录按钮 */}
                            <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
                                <Button
                                    disabled={!this.state.isPhoneRight}
                                    disabledStyle={{ backgroundColor: gstyles.mainColor }}
                                    title="确定"
                                    titleStyle={gstyles.md_black}
                                    buttonStyle={{ height: gstyles.mdHeight, backgroundColor: gstyles.mainColor, borderRadius: 100 }}
                                    containerStyle={{ width: '100%' }}
                                    onPress={() => {
                                        this.props.modifyPhone({
                                            phone: this.state.phone,
                                            code: this.state.code,
                                            cb: () => { this.props.navigation.goBack() }
                                        })
                                    }}
                                />

                                <Button
                                    type='clear'
                                    disabled={!this.state.isPhoneRight}
                                    title="取消"
                                    titleStyle={{ fontSize: 14, color: '#202020' }}
                                    containerStyle={{ alignSelf: 'flex-end' }}
                                    onPress={this._cancel}
                                />
                            </View>
                        </View>
                    }
                </View>

            </View>
        );
    }
}



const mapStateToProps = state => ({
    app: state.app,
})

const mapDispatchToProps = {
    modifyPhone: MineAction.modifyPhone
}
export default connect(mapStateToProps, mapDispatchToProps)(PhonePage)