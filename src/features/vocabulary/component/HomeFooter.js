
import React, {Component} from 'react';
import {Platform, StyleSheet,View, Text, Image, TouchableOpacity} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import {PropTypes} from 'prop-types';
import * as Progress from '../../../component/react-native-progress';
import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'

const styles = StyleSheet.create({
    footer: {
        backgroundColor:'#FFF',
        position:'absolute',
        left:0,
        bottom:0
    },
})


export default class HomeFooter extends React.Component{
    static propTypes = {
        task:PropTypes.object
    };
    constructor(props){
        super(props)
    }

    _navVocaPlay = ()=>{      //跳到轮播页
        alert('Hello')
        // this.props.navigation.navigate('VocaPlay',{playMode:'PLAY_REVIEW', taskDao:this.taskDao});
    }

    render(){
        const {task } = this.props
        //任务名
        let name = ''
        if(task.taskOrder < 10){
            name = '00'+task.taskOrder
        }else if(task.taskOrder < 100){
            name = '0'+task.taskOrder
        }else{
            name = task.taskOrder
        }
        return (
            <TouchableOpacity
                // style={styles.touch}
                onPress={this._navVocaPlay}
                activeOpacity={0.7}
                    >
                <Grid style={styles.footer}>
                    {/* 左侧图 */}
                    <Col style={{width:70, height:55, }}>
                        <Row style={gstyles.r_center}>
                            <Image style={{width:50, height:50, borderRadius:50}} source={require('../../../image/h_icon.png')} />
                        </Row>
                    
                    </Col>
                    {/* 右侧布局 */}
                    <Col>
                        <Row size={1}>
                            <View style={[gstyles.r_center,{alignItems:'flex-end'}]}>
                                <Progress.Bar progress={0.3} height={2} width={280} color='#FFE957' unfilledColor='#DEDEDE' borderWidth={0}/>
                            </View>
                        </Row>
                        <Row size={4} style={gstyles.r_between}>
                            <View >
                                <Text style={{fontSize:16, color:'#404040'}}>{name}</Text>
                            </View>
                            <View style={gstyles.r_end}>
                                <AliIcon name='bofang1' size={22} color='#404040' style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='xiayige' size={20} color='#404040'  style={{paddingRight:20}}></AliIcon>
                                <AliIcon name='bofangliebiaoicon' size={18} color='#404040' style={{paddingRight:10}}></AliIcon>
                            </View>
                        </Row>
                    </Col>
                </Grid>
            </TouchableOpacity>
        )
    }
}