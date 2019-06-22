import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { Container, Content, Grid, Row, Col, ListItem, Icon, Left, Body, Right, Button, Switch} from 'native-base';

import {turnLogoImg} from '../../image';
import AliIcon from '../../component/AliIcon';
import IconListItem from '../../component/IconListItem';
import UserDao from '../../dao/mine/UserDao'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =  StatusBar.currentHeight

const styles = StyleSheet.create({
    headerIcon:{
        width:100,
        height:100,
        borderRadius: 100,
    },
    userNameFont:{
        fontSize:26,
        fontWeight:'400',
        color:'#101010',
    },
    member:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginTop:10,
    },
    memberFont:{
        fontSize: 18,
        fontWeight:'500',
        color:'#F79131',

    },  
    c_center:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    keyFont:{
        fontSize: 18,
        fontWeight: '400',
        color:'#303030',
    },
    listFont:{
        fontSize: 16, 
        color:'#404040',
        paddingLeft:10,
    }
});

export default class MinePage extends React.Component {
    constructor(props){
        super(props);
        this.state={}
        this.dao = new UserDao()
        this.state = {user:{}}
    }

    componentDidMount(){
        this.dao.open()
        .then(()=>{
            let user = this.dao.getUser();
            this.setState({user:{...user}})
            //拷贝完数据，关闭接口（因为这个页面不会卸载）
            this.dao.close();
        })
    }

    componentWillUnmount(){
        alert('MinePage out, close realm  ')
    }

    _setVocaLevel = (num)=>{
        switch(num){
            case 1:
                return '小学'
            case 2:
                return '初中'
            case 3:
                return '高中'
            case 4:
                return '四级'
            case 5:
                return '六级'
            case 6:
                return '研究生'
            case 7:
                return '雅思'
            case 8:
                return 'GRE'
            default:
                return '未测试'
        }
    }


    render(){
        const {user} = this.state
        console.log(user)
        return(
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />
                <View style={{width:width, height:STATUSBAR_HEIGHT, backgroundColor:'#FDFDFD'}}></View>
                {/* 头部 */}
                <Content>
                    <Grid>
                        {/* 头像 */}
                        <Row style={{height:160, backgroundColor:'#1890FF'}}>
                            <Col style={[styles.c_center, ]}>
                                <Text style={styles.userNameFont}>{user.nickname}</Text>
                                <View style={styles.member}>
                                    <AliIcon name='huiyuan' size={26} color='red' style={{fontWeight:'600'}}></AliIcon>
                                    <Text style={styles.memberFont}>查看会员</Text>
                                </View>
                            </Col>
                            <Col style={styles.c_center}>
                                <TouchableOpacity onPress={()=>{
                                    this.props.navigation.navigate('Account');
                                }}>
                                    <Image source={turnLogoImg} style={[styles.headerIcon]} ></Image>
                                </TouchableOpacity>
                                
                            </Col>
                        </Row>

                        {/* 等级和极币 */}
                        <Row style={{marginTop:30,}}>
                            <Col style={[styles.c_center,{borderRightWidth:1, borderRightColor:'#cfcfcf'}]}>
                                <Text style={styles.keyFont}>{this._setVocaLevel(user.level)}</Text>
                                <Text>等级</Text>
                            </Col>
                            <Col style={[styles.c_center,]}>
                                <Text style={styles.keyFont}>{user.balance}</Text>
                                <Text>极币</Text>
                            </Col>
                        </Row>
                        {/* 功能列表 */}
                        <Row style={{marginTop:30,}}>
                            <Col>
                                <IconListItem 
                                    leftIcon={<AliIcon name='tequan' size={26} color='#F79131' ></AliIcon>}
                                    title='我的特权'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('特权');
                                    }}
                                />
                                <IconListItem 
                                    leftIcon={<AliIcon name='wenda1' size={26} color='#F79131' ></AliIcon>}
                                    title='我的读后感'
                                    subtitle='读后感、评论'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('读后感');
                                    }}
                                />
                                <IconListItem 
                                    leftIcon={<AliIcon name='xiazai' size={26} color='#F79131' ></AliIcon>}
                                    title='我的下载'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('下载');
                                    }}
                                />
                                <IconListItem 
                                    leftIcon={<AliIcon name='shezhi' size={26} color='#F79131' ></AliIcon>}
                                    title='设置'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('定时');
                                    }}
                                />
                                
                                
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}