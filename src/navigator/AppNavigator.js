import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View,  AsyncStorage } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Container, Content, Header, Button, Text  } from 'native-base';
import { Col, Row, Grid, } from 'react-native-easy-grid';

import MainTabNavigator from './MainTabNavigator';
import LoginPage from '../page/LoginPage';

class AuthLoadingPage extends Component {

    constructor() {
        super();
        this._bootstrapAsync();
    }

        // //验证登录
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('-->'+userToken); 
        this.props.navigation.navigate(userToken ? 'Main' : 'Auth');
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
    Auth: LoginPage,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));