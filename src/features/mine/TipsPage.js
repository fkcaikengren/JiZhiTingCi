import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';
import {Header,Button} from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";


export default class TipsPage extends React.Component {
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

            </View>
        );
    }
}



const styles = StyleSheet.create({
    content:{
        width:'80%',
        marginTop:25,
    },
    inputStyle: {
        height:gstyles.mdHeight,
        width:'100%',
        borderBottomColor:"#DFDFDF",
        borderBottomWidth:StyleSheet.hairlineWidth
    },
    buttonStyle:{
        height:gstyles.mdHeight,
        backgroundColor:'#FFE957',
        borderRadius:8
    }
})