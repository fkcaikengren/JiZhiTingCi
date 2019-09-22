import React, {Component} from 'react';
import {View} from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Col, Row, Grid, } from 'react-native-easy-grid';
import { createNavigationReducer,createReactNavigationReduxMiddleware,createReduxContainer} from 'react-navigation-redux-helpers';
import { connect} from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import HomeStackNav from './HomeStackNav';
import LoginStackNav from '../features/mine/navigation/LoginStackNav';


class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this._bootstrap();
         //隐藏启动页
        SplashScreen.hide();
    }

    // token验证登录状态
     _bootstrap = async () => {
        //登录进入前，无token
        try{
            // Http.setHeader('token', null)
            const token = await Storage.load({
                key: 'token',
            })
            if(token && token !== ''){
                //设置网络请求头，带上token参数
                Http.defaults.headers['token'] = token
                console.log('--------------登录-------------')
                console.log(Http.defaults.headers)
                this.props.navigation.navigate('Home')
            }else{
                this.props.navigation.navigate('LoginStack')
            }
        }catch(e){
            console.log(e)
            this.props.navigation.navigate('LoginStack')
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
      HomeStack: HomeStackNav,
      LoginStack: LoginStackNav,
    },
    {
        initialRouteName: 'AuthLoading',
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




