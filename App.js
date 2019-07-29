import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet,} from 'react-native';
import {Container,Root,} from "native-base";
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {Provider as AntProvider} from '@ant-design/react-native'
import {store} from './src/redux/store'
const Realm = require('realm')
// import RNFetchBlob from 'rn-fetch-blob';

import AppNavigator from './src/navigation/AppNavigator';
import {createStorage} from './src/common/storage';
import {createHttp} from './src/common/http'



//设置全局变量 (注：这部分代码只在安装App时运行一次)
Realm.copyBundledRealmFiles(); //拷贝时，如果realm已经存在则不会重新拷贝
console.log('copy voca.realm');
// global.Storage = createStorage();
// global.Http = createHttp()

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FDFDFD',
  }
});

/**
 *Created by Jacy on 19/05/11.
 */
export default class App extends React.Component {
  render(){
    return(

      
      <Provider store={store}>
        
        <MenuProvider>
          <Root>
            <AntProvider>
              <Container style={styles.container}>
                <AppNavigator/>
              </Container>
            </AntProvider>
          </Root>
        </MenuProvider>
        
      </Provider>
      
    );
  }
}