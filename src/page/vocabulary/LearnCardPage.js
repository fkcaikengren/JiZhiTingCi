import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base";
import * as Progress from 'react-native-progress';
    

import AliIcon from '../../component/AliIcon';


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
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    bottomBtn:{
        width: (width-80)/2,
        elevation: 0,
        backgroundColor: '#1890FF',

    }, 
    fonts:{
        fontSize:16,
        color:'#404040',
        lineHeight:24,
    },
    phonetic:{
        fontSize: 16,
        color: '#101010',
    }
});


export default class LearnCardPage extends Component {

    render() {
        return (
            <Container>
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
                            <Progress.Bar progress={0.9} height={10} width={width-120} color='#F6B056' unfilledColor='#FFF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>3/15</Text> 
                            </Progress.Bar>
                        </View>
                    </Body>
                </Header> 

                <Content padder style={{ backgroundColor:'#FDFDFD', }}>
                    <Grid>
                        <Row>
                            <Text style={{fontSize:20, fontWeight:'500', color:'#F6B056'}}>abolish</Text>
                        </Row>
                        <Row style={[styles.row, ]}>
                            <View style={styles.row}>
                                <Text style={styles.phonetic}>/əˈbɒlɪʃ/</Text>
                                <AliIcon name='shengyin' size={26} color='#E59AAA'></AliIcon>
                            </View>
                            <View style={[{marginLeft:20}, styles.row]}>
                                <Text style={styles.phonetic}>/əˈbɑːlɪʃ/</Text>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                            </View>
                        </Row>
                        <Row style={[styles.col, {marginTop:16}]}>
                            <View style={[styles.row]}>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                                <Text>英英释义</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'#C0E5FF', padding:4, borderRadius:4,}}>
                                <Text style={styles.fonts}>to officially end a law, system etc, especially one that has existed for a long time.</Text>
                            </View>
                        </Row>
                        <Row style={[styles.col, {marginTop:16,}]}>
                            <View style={[styles.row]}>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                                <Text>例句</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'#C0E5FF', padding:5, borderRadius:4,}}>
                                <Text style={styles.fonts}>Slavery was abolished in the US in the 19th century.</Text>
                            </View>
                        </Row>
                        
                    </Grid>
                </Content>

                <Footer >
                    <FooterTab style={{backgroundColor:'#FDFDFD'}}>
                        <Button >
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>下一个</Text>
                        </Button>
                        <Button onPress={()=>{
                            this.props.navigation.navigate('VocaDetail');
                        }}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>详情</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                
                    {/* <View style={{
                        paddingHorizontal:20,
                        paddingBottom:10,
                    }}>
                        <Button block style={[{backgroundColor:'#1890FF', marginBottom:10}] }>
                            <Text>下一个</Text>
                        </Button>
                        <Button block style={[{backgroundColor:'#1890FF', }] } }>
                            <Text>详情</Text>
                        </Button>
                    </View> */}
                
            </Container>
        );
    }
}
