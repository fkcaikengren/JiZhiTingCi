import React, { Component } from 'react';
import {View, StyleSheet,Image} from 'react-native';
import { Container, Header, Left, Body, Right,Content, Title, Grid, Col, Row,
    Icon ,Button,Text, Footer,Drawer } from 'native-base';
import * as Progress from 'react-native-progress';


import VocaTaskList from '../../component/VocaTaskList';
import AliIcon from '../../component/AliIcon';
import {turnLogoImg} from '../../image';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    header:{
        backgroundColor:'#FDFDFD',
        elevation:0,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:20,
        
    },
    title:{
        fontSize:24,
        fontWeight:'500',
        color:'#1890FF',
    },
    center:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },

    bookName:{
        fontSize: 18,
        color: '#101010',
    },
    learnedNum:{
        fontSize: 14,
        color: '#101010'
    },
    searchBtn:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor: '#F0F0F0',
        paddingVertical: 1,
        paddingHorizontal: 10,
        borderRadius: 100,
    }
});

class HomePage extends Component {




    render() {
    return (
        
        <Container style={{ backgroundColor: '#FDFDFD',}}> 

            {/* 头部 */}
            <Header style={styles.header}>
                <Text style={styles.title}>极致英语</Text>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('VocaSearch', { transition: 'forHorizontal' });}}>
                    <View style={styles.searchBtn} >
                        <Icon name='search'  style={{color:'#303030', fontSize:20, paddingRight:5}}></Icon>
                        <Text style={{color:'#909090'}}>查词</Text>
                    </View>
                </TouchableOpacity>
                
                    
            </Header>
        
            <Content >
                {/* 首页菜单和任务列表 */}
                <Grid style={{height:440}}>
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
                                <Progress.Bar progress={0.3} height={2} width={280} color='#1890FF' unfilledColor='#DEDEDE' borderWidth={0}/>
                            </View>
                        </Row>
                        <Row size={4} style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            alignItems:'center',}}>
                            <View >
                                <Text style={{fontSize:16, color:'#1890FF'}}>List-001</Text>
                            </View>
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'flex-end',
                                alignItems:'center',
                            }}>
                                <AliIcon name='bofang1' size={22} color='#1890FF' style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='xiayige' size={20} color='#1890FF'  style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='bofangliebiaoicon' size={20} color='#1890FF'  style={{paddingRight:10}}></AliIcon>
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

