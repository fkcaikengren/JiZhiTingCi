import React, { Component } from "react";
import {StyleSheet, StatusBar} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Text, View, Body,Title, Grid, Col, Row,
    ListItem, Left, Right , Button, Footer} from "native-base";

import AliIcon from '../../component/AliIcon';
import VocaDetailTabNavigator from '../../navigator/VocaDetailTabNavigator';


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
   
});


export default class VocaDetailPage extends Component {

    render() {
        return (
            <Container style={{backgroundColor:'#FDFDFD'}}>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#1890FF', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <View style={[styles.center,]}>
                            <Text style={{fontSize:16, color:'#FFF', fontWeight:'500'}}>abandon</Text>
                        </View>
                    </Body>
                </Header> 

                <VocaDetailTabNavigator/>

                
            </Container>
        );
    }
}
