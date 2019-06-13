import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet,} from 'react-native';
import {Container,Root,} from "native-base";
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import store from './src/store/configureStore';

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FDFDFD',
  }
});
// import HomePage from './src/page/HomePage';
import AppNavigator from './src/navigator/AppNavigator';
import configureStore from './src/dao/configureStorage';
import Axios from './src/dao/Axios'


//设置全局变量
global.Storage = configureStore;
global.Http = new Axios();

/**
 *Created by Jacy on 19/05/11.
 */
export default class App extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <MenuProvider>
          <Root>
            <Container style={styles.container}>
              <AppNavigator/>
            </Container>
          </Root>
        </MenuProvider>
      </Provider>
    );
  }
}