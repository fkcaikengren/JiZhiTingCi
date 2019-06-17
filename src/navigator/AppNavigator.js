import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View,  AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Container, Content, Header, Button, Text  } from 'native-base';
import { Col, Row, Grid, } from 'react-native-easy-grid';

import MainTabNavigator from './MainTabNavigator';
import LoginPage from '../page/mine/LoginPage';
import UserDao from '../dao/mine/UserDao'

class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
        this.userDao = new UserDao()
    }

    componentDidMount(){
        this.userDao.open()
        .then(()=>{
            this._bootstrap();
        })
        
    }

    componentWillUnmount(){
        // alert('AuthLoading out, close realm')
        this.userDao.close();
    }

    // token验证登录状态
    _bootstrap = () => {
        //登录进入前，无token
        Http.setGetHeader('token', null)
        Http.setPostHeader('token', null)

        const token = this.userDao.getToken()
        console.log('token : '+token)
        if(token && token.length>8){
            //设置网络请求头，带上token参数
            Http.setGetHeader('token', token)
            Http.setPostHeader('token', token)
            this.props.navigation.navigate('Main')
        }else{
            this.props.navigation.navigate('Login',)
        }
    };
    render() {
        return (
            <Container>
                <Header />
                <Grid>
                    <Col style={{ backgroundColor: '#635DB7', height: 200 }}></Col>
                    <Col style={{ backgroundColor: '#00CE9F', height: 200 }}></Col>
                </Grid>
            </Container>
        );
    }
}

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingPage,
    Main: MainTabNavigator,
    Login: LoginPage,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));