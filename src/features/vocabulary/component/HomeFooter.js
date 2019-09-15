
import React, {Component} from 'react';
import {Platform, StyleSheet,View, Text, Image, TouchableOpacity} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import {PropTypes} from 'prop-types';
import * as Progress from '../../../component/react-native-progress';
import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import VocaUtil from '../common/vocaUtil';
import * as Constant from '../common/constant'

import NotificationManage from '../../../modules/NotificationManage'
import VocaPlayService from '../service/VocaPlayService'

const styles = StyleSheet.create({
    footer: {
        backgroundColor:'#FFF',
        position:'absolute',
        left:0,
        bottom:0
    },
})


export default class HomeFooter extends React.Component{
    
    constructor(props){
        super(props)
        this.vocaPlayService = VocaPlayService.getInstance()
        this.vocaPlayService.changeCurIndex = this.props.changeCurIndex
        this.vocaPlayService.changePlayTimer = this.props.changePlayTimer
        this.vocaPlayService.stateRef =  null   //状态引用置为null， 从而使用vocaPlay的状态
    }

     //播放暂停切换
     togglePlay = ()=>{
        const {autoPlayTimer, curIndex, showWordInfos } = this.props.vocaPlay;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            this.props.changePlayTimer(0);
            NotificationManage.pause((e)=>{
                console.log(e)
            },()=>null);

        }else {
            //播放
            if(showWordInfos.length>0){
                this.vocaPlayService.autoplay(curIndex);
                NotificationManage.play((e)=>{
                    console.log(e)
                },()=>null);
            }
        }
    }
    render(){
        const {task, curIndex, autoPlayTimer, showWordInfos} = this.props.vocaPlay
        const {wordCount} = task
        const progressNum = wordCount==undefined?0:(curIndex+1)/wordCount
        //任务名
        let name = VocaUtil.genTaskName(task.taskOrder)
        let word = showWordInfos[curIndex]?showWordInfos[curIndex].word:''
        return (
           
            <Grid 
                style={styles.footer}
                onStartShouldSetResponder={(e)=>true}
                onResponderGrant={(e)=>{
                    this.props.navigation.navigate('VocaPlay',{mode:Constant.NORMAL_PLAY});
                }}
            >
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
                            <Progress.Bar progress={wordCount==0?0:progressNum} height={2} width={280} color='#FFE957' unfilledColor='#DEDEDE' borderWidth={0}/>
                        </View>
                    </Row>
                    <Row size={4} style={gstyles.r_between}>
                        <View style={gstyles.c_center_start}>
                            <Text style={{fontSize:16, color:'#303030'}}>{word}</Text>
                            <Text style={{fontSize:14, color:'#555555'}}>{name===''?'':`List-${name}`}</Text>
                        </View>
                        <View style={gstyles.r_end}>
                            <AliIcon name={autoPlayTimer===0?'bofang1':'zanting1'} size={22} color='#404040' style={{paddingRight:20}} onPress={()=>{
                                this.togglePlay();
                            }}/>
                            <AliIcon name='xiayige' size={20} color='#404040'  style={{paddingRight:20}} />
                        </View>
                    </Row>
                </Col>
            </Grid>
        )
    }
}