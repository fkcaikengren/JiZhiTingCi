import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import { Container, Content, Grid, Row, Col, ListItem, Icon, Left, Body, Right, Button, Switch} from 'native-base';

import {turnLogoImg} from '../../image';
import AliIcon from '../../component/AliIcon';
import IconListItem from '../../component/IconListItem';


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
    }
    render(){
        return(
            <Container>

                <Content>
                    <Grid>
                        {/* 头像 */}
                        <Row style={{height:160, backgroundColor:'#1890FF'}}>
                            <Col style={[styles.c_center, ]}>
                                <Text style={styles.userNameFont}>JacyAcme</Text>
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
                                <Text style={styles.keyFont}>雅思</Text>
                                <Text>等级</Text>
                            </Col>
                            <Col style={[styles.c_center,]}>
                                <Text style={styles.keyFont}>300</Text>
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
                                    leftIcon={<AliIcon name='yixue' size={26} color='#F79131' ></AliIcon>}
                                    title='已学单词书'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('已学');
                                    }}
                                />
                                <IconListItem 
                                    leftIcon={<AliIcon name='dingshi' size={26} color='#F79131' ></AliIcon>}
                                    title='定时关闭'
                                    arrow={true} 
                                    onPress={()=>{
                                        alert('定时');
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