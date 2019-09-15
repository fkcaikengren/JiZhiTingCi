import React, { Component } from "react";
import { StyleSheet, TextInput, View, Text} from 'react-native'
import {Container,Content, Button} from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './LoginStyle'

import UserDao from './dao/UserDao'
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');


class LoginPage extends Component {
    constructor(props){
      super(props)
      this.state = {
        phone:'',
        verifyCode:'',
        isPhoneRight:false, 
        borderColor:'#D0D0D0',
        codeMode:false,   //是否是在验证码模式
        showOthers:true,
      }
      this.userDao = new UserDao()
      
      
    }

    componentDidMount(){
      this.userDao.open()
    }

    componentWillUnmount(){
      alert('loginPage out, close realm')
        this.userDao.close();
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
          //保存用户信息（先删除，再保存）
          this.userDao.clearUserInfo()
          this.userDao.saveUser(user.token,user.user);
          this.props.navigation.navigate('AuthLoading');
        })
    };

    _onFocus = ()=>{
      this.setState({borderColor:'#1890FF'})
    }
    _onBlur = ()=>{
      this.setState({borderColor:'#D0D0D0'})
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
    _sendVerifyCode = ()=>{
      this.setState({codeMode:true})
      //服务器发送验证码
      let param = {phone:this.state.phone}
      console.log('param')
      console.log(param)
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
      this.setState({codeMode:false})
    }

    render() {
      let loginBtn = {
        height:40, 
        
        backgroundColor:this.state.isPhoneRight?'#1890FF':'#1890FF88',
      }
        return (
        <Container style={styles.container}>
            <Content>
              {/* 手机登录层 */}
              <View style={styles.phoneLogin}>
                {/* logo */}
                <View style={styles.logo}>
                  <Text style={{fontSize:36, color:'#303030'}}>极致英语</Text>
                </View>
                {/* 如果是输入手机号模式 */}
                {!this.state.codeMode && 
                  <View style={{width:'100%'}}>
                    <View style={[styles.phone, {borderColor:this.state.borderColor}]}>
                      <Ionicons name="ios-phone-portrait" size={30} />
                      <TextInput placeholder="手机号" maxLength={11}
                      style={{width:'100%'}}
                      onFocus={this._onFocus}
                      onBlur={this._onBlur}
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
                      <Button block disabled={!this.state.isPhoneRight}
                      style={loginBtn}
                        onPress={this._sendVerifyCode}>
                          <Text style={{fontSize:14, color:'#FFF'}}>发送验证码</Text>
                      </Button>
                      <Button transparent style={{ alignSelf:'flex-end'}}>
                        <Text style={{fontSize:14, color:'#404040'}}>密码登录</Text>
                      </Button>
                    </View>
                  </View>
                  
                }
                  {/* 验证码模式下 */}
                {this.state.codeMode &&  
                   <View style={{width:'100%'}}>
                   <View style={[styles.phone, {borderColor:this.state.borderColor}]}>
                     <Ionicons name="ios-lock" size={30} />
                     <TextInput placeholder="验证码" maxLength={6}
                     style={{width:'100%'}}
                    //  onFocus={this._onFocus}
                    //  onBlur={this._onBlur}
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
                     <Button block style={{height:40, backgroundColor:'#1890FF'}} onPress={
                       this._login
                     }>
                         <Text style={{fontSize:14, color:'#FFF'}}>登录</Text>
                     </Button>
                     <Button transparent style={{ alignSelf:'flex-end'}} onPress={this._cancel}>
                       <Text style={{fontSize:14, color:'#404040'}}>取消</Text>
                     </Button>
                   </View>
                 </View>
                 
                }
                
            
            </View>

            {this.state.showOthers &&
              <View>
                <Text>others</Text>
              </View>
            }
          </Content>
        </Container>
        );
    }
}

export default LoginPage;