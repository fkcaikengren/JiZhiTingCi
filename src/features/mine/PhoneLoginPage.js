import React, { Component } from "react";
import { TextInput, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Button, Input } from 'react-native-elements'
import SplashScreen from 'react-native-splash-screen'
import AliIcon from '../../component/AliIcon'
import gstyles from "../../style";
import * as MineAction from './redux/action/mineAction'
const Dimensions = require('Dimensions');
let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

  backBtn: {
    height: 50,
    width: 50,
    position: 'absolute',
    left: 25,
    top: 40,
    backgroundColor: '#EFEFEF',
    borderRadius: 50,
  },

  phoneInput: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: gstyles.gray,
    borderRadius: 100,
    height: 50,
    paddingLeft: 20,
  }



})



class PhoneLoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      verifyCode: '',        //验证码
      isPhoneRight: false,
      codeBorderColor: '#D0D0D0',
      codeMode: false,     //是否是在验证码模式
    }

    console.disableYellowBox = true
  }

  componentDidMount() {
    //隐藏启动页
    SplashScreen.hide();
  }

  _login = () => {
    //手动登录进入App首页
    console.log('---手动登录进入App首页--')
    IsLoginToHome = true
    //获取登录信息
    let param = { phone: this.state.phone, code: this.state.verifyCode }
    this.props.loginByCode(param)
  };

  // 更改手机号码
  _changePhone = (phone) => {
    let isPhoneRight = /^1[3456789]\d{9}$/.test(phone)
    if (!isPhoneRight) {
      console.log("手机号码有误，请重填");
    }
    this.setState({ phone, isPhoneRight })
  }

  //发送验证码
  _requestVerifyCode = () => {
    this.setState({ codeMode: true })
    //服务器发送验证码
    let param = { phone: this.state.phone }
    // Http.post('/user/signUp', param)
    //   .then(response => {
    //     return response.data.data
    //   })
  }

  // 更改验证码
  _changeVerifyCode = (verifyCode) => {
    this.setState({ verifyCode })
  }

  //取消登录
  _cancel = () => {
    this.setState({ codeMode: false, codeBorderColor: '#D0D0D0', verifyCode: '' })
  }

  render() {
    if (this.props.mine.token) {
      this.props.navigation.navigate('AuthLoading'); //副作用
    }
    return (
      <View style={[gstyles.c_center, { flex: 1, backgroundColor: '#FFF' }]}>
        <StatusBar translucent={false} barStyle="dark-content" />
        <TouchableOpacity
          style={[gstyles.c_center, styles.backBtn]}
          onPress={() => {
            this.props.navigation.goBack()
          }} >
          <AliIcon name='fanhui' size={26} color={gstyles.black} />
        </TouchableOpacity>

        {/* 手机登录层 */}
        <View style={[gstyles.c_center, { width: width - 60, paddingBottom: 30 }]}>
          {/* logo */}
          <View style={[gstyles.r_center, { width: '100%', paddingBottom: 50 }]}>
            <Text style={{ fontSize: 36, color: '#202020' }}>爱听词</Text>
          </View>
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
                  buttonStyle={{ height: gstyles.mdHeight, backgroundColor: '#FFE957', borderRadius: 100 }}
                  containerStyle={{ width: '100%' }}
                  onPress={this._requestVerifyCode}
                />

                <Button
                  type='clear'
                  disabled={!this.state.isPhoneRight}
                  title="密码登录"
                  titleStyle={{ fontSize: 14, color: '#202020' }}
                  containerStyle={{ alignSelf: 'flex-end', marginTop: 10 }}
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
                  onChangeText={this._changeVerifyCode}
                  value={this.state.verifyCode}
                  keyboardType='numeric'
                />
              </View>
              {/* 登录按钮 */}
              <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
                <Button
                  disabled={!this.state.isPhoneRight}
                  disabledStyle={{ backgroundColor: gstyles.mainColor }}
                  title="登录"
                  titleStyle={gstyles.md_black}
                  buttonStyle={{ height: gstyles.mdHeight, backgroundColor: gstyles.mainColor, borderRadius: 100 }}
                  containerStyle={{ width: '100%' }}
                  onPress={this._login}
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
  mine: state.mine
})

const mapDispatchToProps = {
  loginByCode: MineAction.loginByCode
}
export default connect(mapStateToProps, mapDispatchToProps)(PhoneLoginPage)