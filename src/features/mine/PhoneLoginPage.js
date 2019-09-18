import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text} from 'react-native'
import {Button} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AliIcon from '../../component/AliIcon'
import styles from './PhoneLoginStyle'

import gstyles from "../../style";


class PhoneLoginPage extends Component {
    constructor(props){
      super(props)
      this.state = {
        phone:'',
        verifyCode:'',        //验证码
        isPhoneRight:false, 
        phoneBorderColor:'#D0D0D0',
        codeBorderColor:'#D0D0D0',
        codeMode:false,     //是否是在验证码模式
        showOthers:true,
      }
      
    }

    componentDidMount(){
    }


    _login = () => {
        //判断验证码verifyCode (暂时不判断)
        //获取登录信息
        let param = {phone:this.state.phone, verifyCode:this.state.verifyCode}
        console.log('login param: ')
        console.log(param)
        Http.post('/user/phoneLogin', param)
        .then(response =>{
            
          let user = response.data.data.user
          console.log('login:')
          console.log(user)
          //保存用户信息
          Storage.save({
            key: 'token', // Note: Do not use underscore("_") in key!
            data: user.token,
            expires: 1000 * 3600 * 24 * 365    //保存一年
          });
          Storage.save({
            key: 'user', // Note: Do not use underscore("_") in key!
            data: user.user,
            expires: 1000 * 3600 * 24 * 365    //保存一年
          });
          this.props.navigation.navigate('AuthLoading');
        })
    };

    _onPhoneFocus = ()=>{
      this.setState({phoneBorderColor:'#FFE957'})
    }
    _onPhoneBlur = ()=>{
      this.setState({phoneBorderColor:'#D0D0D0'})
    }

    _onCodeFocus = ()=>{
      this.setState({codeBorderColor:'#FFE957'})
    }
    _onCodeBlur = ()=>{
      this.setState({codeBorderColor:'#D0D0D0'})
    }

    


    // 更改手机号码
    _changePhone = (phone)=>{
      let isPhoneRight = /^1[3456789]\d{9}$/.test(phone)
      let showOthers = !(phone.length > 0);
      if(!isPhoneRight){ 
        console.log("手机号码有误，请重填");  
      }
      this.setState({phone, isPhoneRight, showOthers})
    }

    //发送验证码
    _requestVerifyCode = ()=>{
      this.setState({codeMode:true})
      //服务器发送验证码
      let param = {phone:this.state.phone}
      Http.post('/user/signUp', param)
      .then(response =>{
          return response.data.data
      })
    }

    // 更改验证码
    _changeVerifyCode = (verifyCode)=>{
      
      this.setState({verifyCode})
    }

    //取消登录
    _cancel = ()=>{
      this.setState({codeMode:false, codeBorderColor:'#D0D0D0', verifyCode:''})
    }

    render() {
        return (
        <View style={styles.container}>
              {/* 手机登录层 */}
              <View style={styles.phoneLogin}>
                {/* logo */}
                <View style={styles.logo}>
                  <Text style={{fontSize:36, color:'#202020'}}>爱听词</Text>
                </View>
                {/* 如果是输入手机号模式 */}
                {!this.state.codeMode && 
                  <View style={{width:'100%'}}>
                    <View style={[styles.phone, {borderColor:this.state.phoneBorderColor}]}>
                      <Ionicons name="ios-phone-portrait" size={30} />
                      <TextInput placeholder="手机号" maxLength={11}
                      style={{width:'100%'}}
                      onFocus={this._onPhoneFocus}
                      onBlur={this._onPhoneBlur}
                      onChangeText={this._changePhone}
                      value={this.state.phone}
                      keyboardType='numeric'
                      />
                    </View>
                    {/* 登录按钮 */}
                    <View style={{flexDirection:'column',
                      justifyContent:'center',
                      alignItems:'center',
                      width:'100%',
                      marginTop:20,
                      }}>
                      <Button
                          disabled={!this.state.isPhoneRight}
                          disabledStyle={{backgroundColor:'#FFE95788'}}
                          title="发送验证码"
                          titleStyle={{fontSize:14, color:'#202020'}}
                          buttonStyle={{backgroundColor:'#FFE957'}}
                          containerStyle={{width:'100%',height:40}}
                          onPress={this._requestVerifyCode}
                        />

                      <Button
                          type='clear'
                          disabled={!this.state.isPhoneRight}
                          title="密码登录"
                          titleStyle={{fontSize:14, color:'#202020'}}
                          containerStyle={{ alignSelf:'flex-end'}}
                        />
                    </View>
                  </View>
                  
                }
                  {/* 验证码模式下 */}
                {this.state.codeMode &&  
                   <View style={{width:'100%'}}>
                   <View style={[styles.phone, {borderColor:this.state.codeBorderColor}]}>
                     <Ionicons name="ios-lock" size={30} />
                     <TextInput placeholder="验证码" maxLength={6}
                     style={{width:'100%'}}
                     onFocus={this._onCodeFocus}
                     onBlur={this._onCodeBlur}
                     onChangeText={this._changeVerifyCode}
                     value={this.state.verifyCode}
                     keyboardType='numeric'
                     />
                   </View>
                   {/* 登录按钮 */}
                   <View style={{flexDirection:'column',
                     justifyContent:'center',
                     alignItems:'center',
                     width:'100%',
                     marginTop:20,
                     }}>
                       <Button
                          disabled={!this.state.isPhoneRight}
                          disabledStyle={{backgroundColor:'#FFE95799'}}
                          title="登录"
                          titleStyle={{fontSize:14, color:'#202020'}}
                          buttonStyle={{backgroundColor:'#FFE957'}}
                          containerStyle={{width:'100%',height:40}}
                          onPress={this._login}
                        />

                      <Button
                          type='clear'
                          disabled={!this.state.isPhoneRight}
                          title="取消"
                          titleStyle={{fontSize:14, color:'#202020'}}
                          containerStyle={{ alignSelf:'flex-end'}}
                          onPress={this._cancel}
                        />
                   </View>
                 </View>
                 
                }
                
            
            </View>

            {/* 其他登录方式 */}
            {this.state.showOthers &&
              <View style={[gstyles.c_center,styles.otherLoginView]}>
                <View style={gstyles.r_center}>
                  <View style={styles.line} />
                  <Text>其他登录方式</Text>
                  <View style={styles.line}  />
                </View>

                <View style={[gstyles.r_center, { marginTop:20}]}>
                  <View style={[styles.otherLoginBtn, {backgroundColor:'#30DE76'}]}>
                    <AliIcon name='weixin' size={22} color='#FFF'></AliIcon>
                  </View>
                  <View style={[styles.otherLoginBtn, {backgroundColor:'#3EC6FB'}]}>
                    <AliIcon name='qq' size={22} color='#FFF'></AliIcon>
                  </View>
                </View>
              </View>
            }
        </View>
        );
    }
}

export default PhoneLoginPage;