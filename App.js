import React, { Component, } from 'react';
import { Platform, StatusBar, StyleSheet, View, } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu'
import { Provider, connect } from 'react-redux';
import CodePush from "react-native-code-push";

import { store } from './src/redux/store'
import Toast, { DURATION } from 'react-native-easy-toast'
import Loader from './src/component/Loader'
import ConfirmModal from './src/component/ConfirmModal'
import CommonModal from './src/component/CommonModal'
import AppWithNavigationState from './src/navigation/AppWithNavigationState';
import { createStorage } from './src/common/storage';
import VocaDao from './src/features/vocabulary/service/VocaDao';
import VocaTaskDao from './src/features/vocabulary/service/VocaTaskDao';
import VocaGroupDao from './src/features/vocabulary/service/VocaGroupDao';
import ArticleDao from './src/features/reading/service/ArticleDao';
import gstyles from './src/style';

import * as AppAction from './src/redux/action'
import DictDao from './src/features/vocabulary/service/DictDao';
import PushUtil from './src/modules/PushUtil'
const Realm = require('realm')


//拷贝Realm数据库，如果realm已经存在则不会重新拷贝
Realm.copyBundledRealmFiles();
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


// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gstyles.bgLightGrey,
  }
});

/**
 * Main
 */
class Main extends React.Component {


  constructor(props) {
    super(props)
    this.backHandler = null
  }


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
  app: state.app,
  nav: state.nav
})


const mapDispatchToProps = {
  setToast: AppAction.setToast,
  setLoader: AppAction.setLoader,
  setConfirmModal: AppAction.setConfirmModal,
  setCommonModal: AppAction.setCommonModal,
}
const MainComp = connect(mapStateToProps, mapDispatchToProps)(Main)

/**
 *  App
 */
class App extends React.Component {

  updateVersion() {
    CodePush.sync({
      //安装模式
      //ON_NEXT_RESUME 下次恢复到前台时
      //ON_NEXT_RESTART 下一次重启时
      //IMMEDIATE 马上更新
      installMode: CodePush.InstallMode.IMMEDIATE,
      //对话框
      updateDialog: {
        //是否显示更新描述
        appendReleaseDescription: true,
        //更新描述的前缀。 默认为"Description"
        descriptionPrefix: "更新内容：",
        //强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel: "立即更新",
        //强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage: "必须更新后才能使用",
        //非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel: '稍后',
        //非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel: '后台更新',
        //非强制更新时，检查到更新的消息文本
        optionalUpdateMessage: '有新版本了，是否更新？',
        //Alert窗口的标题
        title: '更新提示'
      }
    });
  }

  /**极光推送 */
  initPush() {
    PushUtil.setLoggerEnable(true)   //#todo:生产环境为false
    PushUtil.init()
    //连接状态
    PushUtil.addConnectEventListener(result => {
      console.log("connectListener:" + JSON.stringify(result))
    });
    //通知回调
    PushUtil.addNotificationListener(result => {
      console.log("notificationListener:" + JSON.stringify(result))
    });
    //本地通知回调
    PushUtil.addLocalNotificationListener(result => {
      console.log("localNotificationListener:" + JSON.stringify(result))
    });
    //自定义消息回调
    PushUtil.addCustomMessagegListener(result => {
      console.log("customMessageListener:" + JSON.stringify(result))
    });
    //tag alias事件回调
    PushUtil.addTagAliasListener(result => {
      console.log("tagAliasListener:" + JSON.stringify(result))
    });
  }
  componentWillMount() {
    // CodePush.disallowRestart()          //禁止重启
    // this.updateVersion()             //更新版本 #todo:生产环境下开启
    this.initPush()
  }

  componentDidMount() {
    // CodePush.allowRestart()   //在加载完了，允许重启
  }

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


const codePushOptions = {
  //设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //MANUAL 手动检查
  checkFrequency: CodePush.CheckFrequency.ON_APP_START
};
// export default CodePush(codePushOptions)(App)
export default App