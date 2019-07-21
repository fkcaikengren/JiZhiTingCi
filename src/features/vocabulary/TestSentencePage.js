import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,} from 'react-native';
import { Container, Header, Content, Icon, Accordion,  Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base";
import * as Progress from 'react-native-progress';
    

import AliIcon from '../../component/AliIcon';
import styles from './TestSentenceStyle'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;


export default class TestSentencePage extends Component {

    render() {
        return (
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
                            <Progress.Bar progress={0.9} height={10} width={width-120} color='#F6B056' unfilledColor='#FFF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>3/15</Text> 
                            </Progress.Bar>
                        </View>
                    </Body>
                </Header> 

                {/* 内容 */}
                <Content padder style={{ backgroundColor:'#F0F0F0', }}>
                    <Grid style={{marginTop:40}}>
                        <Row style={[styles.col, {marginTop:16}]}>
                            <View style={styles.tipRow}>
                                <View style={[styles.row]}>
                                    <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                                    <Text style={{color:'#303030',fontSize:16,}}>例句</Text>
                                </View>
                                <Text style={{color:'#EC6760',fontSize:16,}}>答错2次</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'#C0E5FF', padding:4, borderRadius:4, marginTop:5}}>
                                <Text style={styles.enFont}>
                                    Slavery was ____ in the US in the 19th century.
                                </Text>
                            </View>
                        </Row>
                        
                    </Grid>
                </Content>

                <Grid style={{padding:10}}>
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn}>
                            <Text style={styles.btnFont}>abolish</Text>
                        </Button>
                    </Row>
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn}>
                            <Text style={styles.btnFont}>share</Text>
                        </Button>
                    </Row>
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn}>
                            <Text style={styles.btnFont}>abandon</Text>
                        </Button>
                    </Row>
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn}>
                            <Text style={styles.btnFont}>cool</Text>
                        </Button>
                    </Row>
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn}>
                            <Text style={{color:'#EC6760',fontSize:16,}}>7  想不起来了，查看提示</Text>
                        </Button>
                    </Row>
                </Grid>
            </Container>
        );
    }
}
