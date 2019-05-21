import React, { Component } from 'react';
import {View, StyleSheet,Image} from 'react-native';
import { Container, Header, Left, Body, Right,Content, Title, Grid, Col, Row,
    Badge ,Icon ,Button,Text, Footer,Drawer } from 'native-base';
import * as Progress from 'react-native-progress';


import VocaTaskList from '../component/VocaTaskList';
import AliIcon from '../component/AliIcon';
import {turnLogoImg} from '../image';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },

    bookName:{
        fontSize: 18,
        color: '#39668D',
    },
    learnedNum:{
        fontSize: 14,
        color: '#39668D'
    }
});

class HomePage extends Component {




    render() {
    return (
        
        <Container style={{ backgroundColor: '#FDFDFD',}}> 
            <Content >
                
                {/* 首页菜单和任务列表 */}
                <Grid style={{height:500}}>
                    <Col>
                    <VocaTaskList {...this.props}/>
                    </Col>
                </Grid>
            </Content>

            <Footer style={{backgroundColor:'#FFF'}} >
                <Grid >
                <TouchableOpacity
                    style={styles.touch}
                    onPress={()=>{
                        this.props.navigation.navigate('VocaPlay');
                    }}
                    activeOpacity={0.7}
                        >
                    <Col style={{width:70, height:50, }}>
                        <Row style={styles.center}>
                            <Image style={{width:50, height:50, borderRadius:50}} source={turnLogoImg} />
                        </Row>
                    
                    </Col>
                </TouchableOpacity>
                    <Col>
                        <Row size={1}>
                            <View style={[styles.center,{alignItems:'flex-end'}]}>
                                <Progress.Bar progress={0.3} height={2} width={280} color='#77A3F0' unfilledColor='#DEDEDE' borderWidth={0}/>
                            </View>
                        </Row>
                        <Row size={4} style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            alignItems:'center',}}>
                            <View >
                                <Text style={{fontSize:16, color:'#77A3F0'}}>List-001</Text>
                            </View>
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'flex-end',
                                alignItems:'center',
                            }}>
                                <AliIcon name='bofang1' size={24} color='#77A3F0' style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='xiayige' size={22} color='#77A3F0'  style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='bofangliebiaoicon' size={22} color='#77A3F0'  style={{paddingRight:10}}></AliIcon>
                            </View>
                            
                        </Row>
                    </Col>
                </Grid>
            </Footer>
        </Container>
       
    );
  }
}


export default HomePage;

