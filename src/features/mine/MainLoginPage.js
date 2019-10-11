import React, { Component } from "react";
import {StyleSheet, Image, View, Text, StatusBar} from 'react-native'
import SplashScreen from 'react-native-splash-screen'


import AliIcon from '../../component/AliIcon'
import styles from './MainLoginStyle'

class MainLoginPage extends Component {
    constructor(props){
      super(props)
      this.state = {
      }
    }

    componentDidMount(){
        //隐藏启动页
       SplashScreen.hide();
    }

    render(){
        return(
            <View style={styles.container}>
                <StatusBar translucent={false} barStyle="dark-content" />
                {/* logo */}
                <View style={styles.logoView}>
                    <Image 
                    style={{width:80,height:80}}
                    source={require('../../image/bg.jpg')}/>
                </View>
                <View style={styles.loginView}>
                    <View style={[styles.loginBtn, {backgroundColor:'#30DE76'}]}>
                        <AliIcon name='weixin' size={24} color='#FFF'></AliIcon>
                        <Text style={styles.loginText}>微信登录</Text>
                    </View>
                    <View style={[styles.loginBtn, {backgroundColor:'#3EC6FB'}]}>
                        <AliIcon name='qq' size={24} color='#FFF'></AliIcon>
                        <Text style={styles.loginText}>QQ登录</Text>
                    </View>
                    <View style={styles.otherLoginBtn}>
                        <Text style={styles.otherLoginText}>其他登录方式</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default MainLoginPage;