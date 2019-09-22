import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text, Image, TouchableOpacity, BackHandler} from 'react-native';
import {Header} from 'react-native-elements'
import {Grid, Col,} from 'react-native-easy-grid'

import {turnLogoImg} from '../../image';
import AliIcon from '../../component/AliIcon';
import IconListItem from '../../component/IconListItem';
import UserDao from '../../dao/mine/UserDao'
import vocaUtil from "../vocabulary/common/vocaUtil";
import gstyles from "../../style";


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
        this.state={user:{}}
        this.dao = new UserDao()
    }


    componentDidMount(){
        this.dao.open()
        .then(()=>{
            let user = this.dao.getUser()
            this.setState({user})
        })
    }

    componentWillUnmount(){
        alert('acountPage out, close realm ')
        this.dao.close()
    }


    //退出登录
    _logout = ()=>{
        //清空用户信息
        this.dao.clearUserInfo()
        BackHandler.exitApp()
    }
    render(){
        let {user} = this.state
        return(
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    leftComponent={//返回
                        <AliIcon name='fanhui' size={26} color='#555' onPress={()=>{
                        }}/> }
                    centerComponent={{ text: '个人中心', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: '#FCFCFC00',
                        borderBottomColor: '#FCFCFC00',
                    }}
                />

                <View>
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
                                subtitle={user.nickname?user.nickname:''}
                                onPress={()=>{
                                    alert('Jacy');
                                }}
                            />
                            <IconListItem 
                                containerStyle={styles.containerStyle}
                                title='绑定手机'
                                subtitle={user.phone}
                                rightIcon={user.phone?null:<AliIcon name='shouji' size={26} color='#1890FF'></AliIcon>}
                               
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


                            <TouchableOpacity onPress={this._logout}>
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
                </View>
            </View>
        );
    }
}