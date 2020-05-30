import { createStackNavigator } from 'react-navigation';

import PhoneLoginPage from '../PhoneLoginPage'
import MainLoginPage from '../MainLoginPage'
import H5Page from '../H5Page';

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
    // 
    H5: {
      screen: H5Page
    }
  },
  {
    initialRouteName: 'MainLogin',
    headerMode: 'none',
    initialRouteParams: {
    }
  }
);

export default LoginStackNav;