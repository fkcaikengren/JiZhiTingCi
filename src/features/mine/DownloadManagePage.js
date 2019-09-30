import React, {Component} from 'react';
import {Platform, View, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';
import {Header,Button} from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './DownloadManageStyle'

export default class DownloadManagePage extends React.Component {
    constructor(props){
        super(props);
        this.state={password:null}
    }

    componentDidMount(){
    }


    render(){
        return(
            <View style={[{flex:1},gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }

                    centerComponent={{ text: '修改密码', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />


                <View style={{flex:1,width:'100%'}}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.itemWrapper}>
                            <View style={[gstyles.r_between, styles.itemView]}>
                                <View style={[gstyles.r_start]}>
                                    <AliIcon name='shanchu' size={24} color={gstyles.emColor}/>
                                    <Text numberOfLines={1} style={[gstyles.lg_black, {marginLeft:10}]}>六级高频词库</Text>
                                </View>
                                <Text numberOfLines={1} style={[gstyles.lg_gray,{marginRight:16}]}>90M</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback>
                    <Text style={[gstyles.lg_black,styles.clearBtn]}>全部清理</Text>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

