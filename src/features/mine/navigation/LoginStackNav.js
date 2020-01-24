import { createStackNavigator } from 'react-navigation';

import PhoneLoginPage from '../PhoneLoginPage'
import MainLoginPage from '../MainLoginPage'

// 单词模块
const LoginStackNav = createStackNavigator(
  {
    //主登录页面
    MainLogin: {
      screen: MainLoginPage
    },
    //手机登录
    PhoneLogin: {
      screen: PhoneLoginPage
    },



  },
  {
    initialRouteName: 'MainLogin',
    headerMode: 'none',
    initialRouteParams: {
    }
  }
);

export default LoginStackNav;