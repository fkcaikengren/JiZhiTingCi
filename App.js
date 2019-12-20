import React, { Component } from 'react';
import { Platform, StatusBar, View, StyleSheet, } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu'
import { Provider } from 'react-redux';
import { store } from './src/redux/store'
import Toast, { DURATION } from 'react-native-easy-toast'
import ConfirmModal from './src/component/ConfirmModal'
const Realm = require('realm')

import AppWithNavigationState from './src/navigation/AppWithNavigationState';
import { createStorage } from './src/common/storage';
import createHttp from './src/common/http'
import VocaDao from './src/features/vocabulary/service/VocaDao';
import VocaTaskDao from './src/features/vocabulary/service/VocaTaskDao';
import VocaGroupDao from './src/features/vocabulary/service/VocaGroupDao';
import ArticleDao from './src/features/reading/service/ArticleDao';
import gstyles from './src/style';
import { connect } from 'react-redux'
import * as AppAction from './src/redux/action'


//设置全局变量 (注：这部分代码只在安装App时运行一次)
Realm.copyBundledRealmFiles(); //拷贝时，如果realm已经存在则不会重新拷贝
console.log('copy realm');


// 存储对象
global.Storage = createStorage()
// 是否手动登录进入App首页
global.IsLoginToHome = false 




//开启数据库
VocaDao.getInstance().open()
VocaTaskDao.getInstance().open()
VocaGroupDao.getInstance().open()
ArticleDao.getInstance().open()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gstyles.bgLightGrey,
  }
});


class Main extends React.Component {

  componentDidMount() {
    this.props.setToast({ toast: this.refs.toast })
    this.props.setConfirmModal({confirmModal:this.refs.confirmModal})
  }

  render() {
    return (
      <View style={styles.container}>
        <AppWithNavigationState />
        <Toast
          ref="toast"
          style={{ backgroundColor: '#303030' }}
          position='top'
          positionValue={200}
          fadeInDuration={100}
          fadeOutDuration={100}
          opacity={0.8}
          textStyle={{ color: '#fff' }}
        />
        <ConfirmModal ref="confirmModal"/>
      </View>
    )
  }
}


const mapStateToProps = state => ({
  app: state.app
})


const mapDispatchToProps = {
  setToast: AppAction.setToast,
  setConfirmModal: AppAction.setConfirmModal,
}
const MainComp = connect(mapStateToProps, mapDispatchToProps)(Main)

/**
 *Created by Jacy on 19/05/11.
 */
export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <MenuProvider>
          <MainComp></MainComp>
        </MenuProvider>
      </Provider>

    );
  }
}

