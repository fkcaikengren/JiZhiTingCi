import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from "react-redux";
import SplashScreen from 'react-native-splash-screen'
import createHttp from '../../common/http'

class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount() {

        //debug模式下，此时redux-persist的数据未加载，所以定时
        // this._bootstrap()
        setTimeout(this._bootstrap, 1000)
    }

    // token验证登录状态
    _bootstrap = async () => {

        //隐藏启动页
        SplashScreen.hide();
        //创建Http
        global.Http = createHttp()

        const { accessToken, expiresIn, refreshToken } = this.props.mine.credential
        //判断是否过期
        console.log(Date.now())
        console.log(expiresIn)
        if (accessToken && expiresIn && Date.now() < expiresIn) {
            console.log('直接进入App')
            // 直接进入App
            this.props.navigation.navigate('HomeStack')
        } else {

            console.log('token过期，重新登录')
            //刷新token,如果失败跳转至登录页面
            // 未登录
            this.props.navigation.navigate('LoginStack')
        }

    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingPage)