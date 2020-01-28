import React, { Component } from 'react';
import { Platform, StatusBar, View, StyleSheet, } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu'
import { Provider } from 'react-redux';
import { store } from './src/redux/store'
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from './src/component/Loader'
import ConfirmModal from './src/component/ConfirmModal'
import CommonModal from './src/component/CommonModal'
const Realm = require('realm')

import AppWithNavigationState from './src/navigation/AppWithNavigationState';
import { createStorage } from './src/common/storage';
import VocaDao from './src/features/vocabulary/service/VocaDao';
import VocaTaskDao from './src/features/vocabulary/service/VocaTaskDao';
import VocaGroupDao from './src/features/vocabulary/service/VocaGroupDao';
import ArticleDao from './src/features/reading/service/ArticleDao';
import gstyles from './src/style';
import { connect } from 'react-redux'
import * as AppAction from './src/redux/action'
import DictDao from './src/features/vocabulary/service/DictDao';

//设置全局变量 (注：这部分代码只在安装App时运行一次)
Realm.copyBundledRealmFiles(); //拷贝时，如果realm已经存在则不会重新拷贝
console.log('copy realm');

// 存储对象并且存储初始变量
global.Storage = createStorage()
// 是否手动登录进入App首页 (=>是否需要加载当天任务)
global.IsLoginToHome = false
// 定义全局的navigate
global.Navigate = _ => null


//开启数据库
VocaDao.getInstance().open()
VocaTaskDao.getInstance().open()
VocaGroupDao.getInstance().open()
ArticleDao.getInstance().open()
Storage.load({
  key: 'dict-downloaded'
}).then(v => {
  if (v) {
    console.log('打开dict.realm')
    DictDao.getInstance().open()
  }
}).catch(e => null)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gstyles.bgLightGrey,
  }
});


class Main extends React.Component {


  componentDidMount() {
    this.props.setToast({ toast: this.refs.toast })
    this.props.setLoader({ loader: this.refs.loader })
    this.props.setConfirmModal({ confirmModal: this.refs.confirmModal })
    this.props.setCommonModal({ commonModal: this.refs.commonModal })
  }

  render() {
    return (
      <View style={styles.container}>
        <AppWithNavigationState />
        <Toast
          ref="toast"
          style={{ backgroundColor: '#101010' }}
          position='top'
          positionValue={80}
          fadeInDuration={100}
          fadeOutDuration={100}
          opacity={0.9}
          textStyle={{ color: '#fff' }}
        />
        <Loader ref="loader" />
        <ConfirmModal ref="confirmModal" />
        <CommonModal ref='commonModal' />
      </View>
    )
  }
}


const mapStateToProps = state => ({
  app: state.app
})


const mapDispatchToProps = {
  setToast: AppAction.setToast,
  setLoader: AppAction.setLoader,
  setConfirmModal: AppAction.setConfirmModal,
  setCommonModal: AppAction.setCommonModal,
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

