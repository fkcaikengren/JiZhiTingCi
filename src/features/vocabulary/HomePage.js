import React, { Component } from 'react';
import {StatusBar , StyleSheet,Image, View,FlatList,Animated, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import { Container,Content,  Grid, Col, Row,Text, Footer,  } from 'native-base';
import * as Progress from '../../component/react-native-progress';
import VocaDao from './dao/VocaDao'
import VocaTaskDao from './dao/VocaTaskDao'


import AliIcon from '../../component/AliIcon';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');





/**
 * @flow
 */

'use strict';

import Header from './component/header';
import Forecast from './component/forecast';
import Loading from './component/loading';

// import type { WeatherModel } from '../models/view'

const SCREEN_WIDTH = Dimensions.get('window').width;




export default class HomePage extends Component {
    static propTypes = {
      
    
    }
  
  // 组件参数默认属性
    static defaultProps = {
      
    }

  constructor(props) {
    super(props);

    this.state = {
      shift: new Animated.Value(0),
      current: 0
    };

  }

  render() {


    return (
      <View style={styles.container}>
          {/*顶部背景和任务列表 */}
        <Header offset={this.state.shift} current={this.state.current}>
            <Forecast forecast={[1,2,3,4,5,6,7]} />
            {/* [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] */}
        </Header>

        {/* 底部播放控制 */}
        <Footer style={{backgroundColor:'#FFF'}} >
            <Grid >
            <TouchableOpacity
                style={styles.touch}
                onPress={()=>{      //播放
                    this.props.navigation.navigate('VocaPlay',{playMode:'PLAY_REVIEW', taskDao:this.taskDao});
                }}
                activeOpacity={0.7}
                    >
                <Col style={{width:70, height:50, }}>
                    <Row style={styles.center}>
                        <Image style={{width:50, height:50, borderRadius:50}} source={require('../../image/h_icon.png')} />
                    </Row>
                
                </Col>
            </TouchableOpacity>
                <Col>
                    <Row size={1}>
                        <View style={[styles.center,{alignItems:'flex-end'}]}>
                            <Progress.Bar progress={0.3} height={2} width={280} color='#FFE957' unfilledColor='#DEDEDE' borderWidth={0}/>
                        </View>
                    </Row>
                    <Row size={4} style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center',}}>
                        <View >
                            <Text style={{fontSize:16, color:'#404040'}}>List-001</Text>
                        </View>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'flex-end',
                            alignItems:'center',
                        }}>
                            <AliIcon name='bofang1' size={22} color='#404040' style={{paddingRight:20}}></AliIcon>
                            <AliIcon name='xiayige' size={20} color='#404040'  style={{paddingRight:20}}></AliIcon>
                            <AliIcon name='bofangliebiaoicon' size={18} color='#404040' style={{paddingRight:10}}></AliIcon>
                        </View>
                        
                    </Row>
                </Col>
            </Grid>
        </Footer>
      </View>
    );
  }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9'
    },
    center:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },
});




