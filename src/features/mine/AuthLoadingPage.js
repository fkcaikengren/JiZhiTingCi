import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from "react-redux";

class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount() {
        this._bootstrap();
    }

    // token验证登录状态
    _bootstrap = () => {
        if (this.props.mine.token) {
            Http.defaults.headers['Authorization'] = this.props.mine.token
            this.props.navigation.navigate('HomeStack')
        } else {
            // 未登录
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
const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingPage)