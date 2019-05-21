import React, { Component } from "react";
import {StyleSheet, StatusBar} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Text, View, Body,Title,
    ListItem, Left, Right , Button} from "native-base";
    

import AliIcon from '../component/AliIcon';
import VocaListTabNavgator from "../navigator/VocaListTabNavgator";




const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#C0E5FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    }
});


export default class VocaListPage extends Component {

    render() {
        return (
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#77A3F0'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#77A3F0', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui-copy-copy' size={26} color='#fff' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Title>单词列表</Title>
                    </Body>
                    <Button transparent style={{position:'absolute', right:10}}>
                        <Text style={{color:'#FFF', fontSize:18, fontWeight:'normal'}}>编辑</Text>
                    </Button>
                </Header> 
                <VocaListTabNavgator />
            </Container>
        );
    }
}
