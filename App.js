import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet,} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from './src/redux/store'
const Realm = require('realm')
// import RNFetchBlob from 'rn-fetch-blob';

import AppWithNavigationState from './src/navigation/AppWithNavigationState';
import {createStorage} from './src/common/storage';
import {createHttp} from './src/common/http'
import VocaDao from './src/features/vocabulary/service/VocaDao';
import VocaTaskDao from './src/features/vocabulary/service/VocaTaskDao';
import VocaGroupDao from './src/features/vocabulary/service/VocaGroupDao';
import ArticleDao from './src/features/reading/service/ArticleDao';

import gstyles from './src/style';



//设置全局变量 (注：这部分代码只在安装App时运行一次)
Realm.copyBundledRealmFiles(); //拷贝时，如果realm已经存在则不会重新拷贝
console.log('copy realm');
// global.Storage = createStorage();
// global.Http = createHttp()

//开启数据库
VocaDao.getInstance().open()
VocaTaskDao.getInstance().open()
VocaGroupDao.getInstance().open()
ArticleDao.getInstance().open()

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:gstyles.bgLightGrey,
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
          <View style={styles.container}>
            <AppWithNavigationState/>
          </View>
        </MenuProvider>
      </Provider>
      
    );
  }
}