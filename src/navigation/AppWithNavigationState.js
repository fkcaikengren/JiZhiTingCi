import React, { Component } from 'react';
import { View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createNavigationReducer, createReactNavigationReduxMiddleware, createReduxContainer } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux'
import HomeStackNav from './HomeStackNav';
import LoginStackNav from '../features/mine/navigation/LoginStackNav';


class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount() {
        this._bootstrap();
    }

    // token验证登录状态
    _bootstrap = async () => {
        try {
            const token = await Storage.load({
                key: 'token',
            })
            if (token) {
                Http.defaults.headers['Authorization'] = token
                this.props.navigation.navigate('HomeStack')
            } else {
                // 未登录
                this.props.navigation.navigate('LoginStack')
            }

        } catch (err) {
            console.log(err) //token 过期
            this.props.navigation.navigate('LoginStack')
        }

    };

    render() {
        return (
            <View style={{ flex: 1 }}>
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




