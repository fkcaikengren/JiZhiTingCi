import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, BackHandler } from 'react-native';
import { Header, Button } from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import { WebView } from "react-native-webview";

export default class GuideDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    render() {
        const url = this.props.navigation.getParam('url')
        const title = this.props.navigation.getParam('title')
        return (
            <View style={[{ flex: 1, width: '100%' }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: title, style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/*虽然设置了height:100, 但flex:1使得自然铺满 */}
                <View style={{ flex: 1, width: '100%', height: 100 }}>
                    <WebView source={{ uri: url }} />
                </View>

            </View>
        );
    }
}

