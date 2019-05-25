import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { Container, Content, Grid, Row, Col, Header, Button, Body, Switch} from 'native-base';

import {turnLogoImg} from '../../image';
import AliIcon from '../../component/AliIcon';
import IconListItem from '../../component/IconListItem';


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#EFEFEF',
    },
    header:{
        backgroundColor:'#FDFDFD',
        elevation:0,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        
    },
    title:{
        fontSize:18,
        fontWeight:'500',
        color:'#1890FF',
    },
    c_center:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    containerStyle:{
        paddingVertical:10, 
        borderBottomWidth:1, 
        borderColor:'#DFDFDF', 
        backgroundColor:'#FDFDFD'
    }
   
});

export default class AccountPage extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <Container style={styles.container}>
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
                            <Text style={{fontSize:16, color:'#FFF', fontWeight:'500'}}>个人中心</Text>
                        </View>
                    </Body>
                </Header> 

                <Content>
                    <Grid>
                        <Col style={{marginTop:20}}>
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='头像'
                                rightIcon={<Image style={{width:40,height:40, borderRadius:100}} source={turnLogoImg}></Image>}
                                onPress={()=>{
                                    alert('特权');
                                }}
                            />
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='用户名'
                                subtitle='JacyAcme'
                                onPress={()=>{
                                    alert('Jacy');
                                }}
                            />
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='绑定手机'
                                rightIcon={<AliIcon name='shouji' size={26} color='#808080'></AliIcon>}
                                onPress={()=>{
                                    alert('读后感');
                                }}
                            />
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='绑定微信'
                                rightIcon={<AliIcon name='weixin' size={26} color='#259B24'></AliIcon>}
                                onPress={()=>{
                                    alert('weixin');
                                }}
                            />
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='绑定QQ'
                                rightIcon={<AliIcon name='qq' size={26} color='#3F51B5'></AliIcon>}
                                onPress={()=>{
                                    alert('QQ');
                                }}
                            />


                            <TouchableOpacity onPress={()=>{
                                alert('tuichu');
                            }}>
                                <View style={[{
                                    flexDirection:'row',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginTop:20,
                                }, styles.containerStyle]}>
                                    <Text  style={{fontSize:16, color:'red', }}>退出登录</Text>
                                </View>
                            </TouchableOpacity>
                            
                        </Col>
                    </Grid>
                </Content>
            </Container>
        );
    }
}