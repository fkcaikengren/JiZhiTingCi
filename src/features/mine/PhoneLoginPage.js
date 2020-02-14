import React, { Component } from "react";
import { TextInput, StatusBar, StyleSheet, View, Text, TouchableOpacity, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { Button, Input } from 'react-native-elements'
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

  mainView: {
    width: width - 60,
  },
  inputBox: {
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: gstyles.gray,
    borderRadius: 100,
    height: 50,
    paddingLeft: 20,
  }



})

const MODE_PHONE_INPUT = 'MODE_PHONE_INPUT' //手机输入模式
const MODE_CODE_INPUT = 'MODE_CODE_INPUT'   //验证码输入模式
const MODE_PWD_INPUT = 'MODE_PWD_INPUT'     //手机+密码输入


class PhoneLoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      verifyCode: '',
      password: '',
      isPhoneRight: false,
      mode: MODE_PHONE_INPUT,     //是否是在验证码模式
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

  _login = () => {

    if (this.state.mode === MODE_PWD_INPUT) {
      const params = { phone: this.state.phone, password: this.state.password }
      this.props.loginByPwd({
        params,
        navigation: this.props.navigation
      })
    } else if (this.state.mode === MODE_CODE_INPUT) {
      //获取登录信息
      const params = { phone: this.state.phone, code: this.state.verifyCode }
      this.props.loginByCode({
        params,
        navigation: this.props.navigation
      })
    }

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
  _requestVerifyCode = () => {
    this.setState({ mode: MODE_CODE_INPUT })
    //服务器发送验证码
    let param = { phone: this.state.phone }
    // Http.post('/user/signUp', param)
    //   .then(response => {
    //     return response.data.data
    //   })
  }




  render() {

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

        {/* logo */}
        <View style={[gstyles.r_center, { position: 'absolute', width: '100%', top: 120, }]}>
          <Text style={{ fontSize: 36, color: '#202020' }}>爱听词</Text>
        </View>


        {/* 如果是输入手机号模式  */}
        {this.state.mode === MODE_PHONE_INPUT &&
          <View style={styles.mainView}>
            <View style={[gstyles.r_start, styles.inputBox]}>
              <AliIcon name="shouji" size={26} color={gstyles.gray} />
              <TextInput
                placeholder="输入手机号"
                maxLength={11}
                style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                value={this.state.searchText}
                onChangeText={this._changePhone}
                value={this.state.phone}
                keyboardType='numeric'
              />
            </View>

            <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
              <Button
                disabled={!this.state.isPhoneRight}
                title="发送验证码"
                titleStyle={gstyles.md_black}
                buttonStyle={{ height: gstyles.mdHeight, backgroundColor: gstyles.mainColor, borderRadius: 100 }}
                containerStyle={{ width: '100%' }}
                onPress={this._requestVerifyCode}
              />

              <Button
                type='clear'
                title="密码登录"
                titleStyle={{ fontSize: 14, color: '#202020' }}
                containerStyle={{ alignSelf: 'flex-end', marginTop: 10 }}
                onPress={() => {
                  this.setState({ mode: MODE_PWD_INPUT })
                }}
              />
            </View>
          </View>
        }


        {/* 验证码模式下 */}
        {this.state.mode === MODE_CODE_INPUT &&
          <View style={styles.mainView}>
            <View style={[gstyles.r_start, styles.inputBox]}>
              <AliIcon name="anquanzhuye-copy" size={24} color={gstyles.gray} />
              <TextInput
                placeholder="验证码"
                maxLength={6}
                style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                onChangeText={(value) => {
                  this.setState({ verifyCode: value })
                }}
                value={this.state.verifyCode}
                keyboardType='numeric'
              />
            </View>

            <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
              <Button
                disabledStyle={{ backgroundColor: gstyles.mainColor }}
                title="确认登录"
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
                onPress={() => {
                  this.setState({ mode: MODE_PHONE_INPUT, verifyCode: '' })
                }}
              />
            </View>
          </View>
        }

        {/* 手机号+密码登录模式 */}
        {this.state.mode === MODE_PWD_INPUT &&
          <View style={styles.mainView}>
            <View style={[gstyles.r_start, styles.inputBox]}>
              <AliIcon name="shouji" size={26} color={gstyles.gray} />
              <TextInput
                placeholder="输入手机号"
                maxLength={11}
                style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                value={this.state.searchText}
                onChangeText={this._changePhone}
                value={this.state.phone}
                keyboardType='numeric'
              />
            </View>
            <View style={[gstyles.r_start, styles.inputBox, { marginTop: 20 }]}>
              <AliIcon name="anquanzhuye-copy" size={24} color={gstyles.gray} />
              <TextInput
                placeholder="输入密码"
                maxLength={16}
                secureTextEntry={true}
                style={[{ height: gstyles.mdHeight, width: '100%', marginLeft: 5 }, gstyles.md_black]}
                onChangeText={(value) => {
                  this.setState({ password: value })
                }}
                value={this.state.password}
                keyboardType='numeric'
              />
            </View>

            <View style={[gstyles.c_center, { width: '100%', marginTop: 20, }]}>
              <Button
                disabled={!this.state.isPhoneRight}
                title="确认登录"
                titleStyle={gstyles.md_black}
                buttonStyle={{ height: gstyles.mdHeight, backgroundColor: gstyles.mainColor, borderRadius: 100 }}
                containerStyle={{ width: '100%' }}
                onPress={this._login}
              />
              <Button
                type='clear'
                title="验证码登录"
                titleStyle={{ fontSize: 14, color: '#202020' }}
                containerStyle={{ alignSelf: 'flex-end' }}
                onPress={() => {
                  this.setState({ mode: MODE_PHONE_INPUT, password: '' })
                }}
              />
            </View>
          </View>
        }



      </View >
    );
  }
}



const mapStateToProps = state => ({
  app: state.app,
  mine: state.mine
})

const mapDispatchToProps = {
  loginByCode: MineAction.loginByCode,
  loginByPwd: MineAction.loginByPwd
}
export default connect(mapStateToProps, mapDispatchToProps)(PhoneLoginPage)