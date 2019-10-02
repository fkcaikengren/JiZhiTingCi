import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import {Header,Button} from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import {WebView} from "react-native-webview";

export default class TipsDetailPage extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
    }


    render(){
        return(
            <View style={[{flex:1, width:'100%'},gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }

                    centerComponent={{ text: '攻略', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/*虽然设置了height:100, 但flex:1使得自然铺满 */}
                <View style={{flex:1,width:'100%',height:100}}>
                    <WebView source={{ uri: 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/tip_1.html' }} />
                </View>

            </View>
        );
    }
}

