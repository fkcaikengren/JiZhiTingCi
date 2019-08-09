import React, {Component} from 'react';
import {View} from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Col, Row, Grid, } from 'react-native-easy-grid';
import { createNavigationReducer,createReactNavigationReduxMiddleware,createReduxContainer} from 'react-navigation-redux-helpers';
import { connect} from 'react-redux'
import HomeStackNav from './HomeStackNav';
import LoginPage from '../features/mine/LoginPage';
import UserDao from '../features/mine/dao/UserDao'

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
            <View>
                <Grid>
                    <Col style={{ backgroundColor: '#635DB7', height: 200 }}></Col>
                    <Col style={{ backgroundColor: '#00CE9F', height: 200 }}></Col>
                </Grid>
            </View>
        );
    }
}

const AppNavigator = createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingPage,
      Home: HomeStackNav,
      Login: LoginPage,
    },
    {
      initialRouteName: 'Home',
    }
));

//1. 创建reducer
export const navReducer = createNavigationReducer(AppNavigator);

//2. 创建中间件
export const navigationReduxMiddleware = createReactNavigationReduxMiddleware(
    state => state.nav,
);

  
//3. 创建redux容器
const App = createReduxContainer(AppNavigator);

//4. 连接
const mapStateToProps = (state) => ({
    state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(App);
export default AppWithNavigationState




