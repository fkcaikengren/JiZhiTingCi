
import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet,View, Text, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { Grid, Col, Row,} from 'react-native-easy-grid'
import {WhiteSpace} from '@ant-design/react-native'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import * as Progress from '../../../component/react-native-progress';
import AliIcon from '../../../component/AliIcon'
// import styles from '../VocaPlayStyle'
import * as VocaConfig from '../common/vocaConfig'
import gstyles from '../../../style';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


const styles = StyleSheet.create({
    textIcon:{
        height:22,
        width:22,
        textAlign:'center',
        borderWidth:1,
        borderRadius:2,
    },
    unSelected:{
        color:'#FFF',
        borderColor:'#FFF',
        
    },
    bigRoundBtn:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:55,
        height:55,
        borderRadius:60,
    },
    intervalButton: {
        width:26,
        color:'#FFF',  
        paddingHorizontal:3,
        fontSize:14,
        textAlign:'center', 
        lineHeight:20, 
        borderWidth:1,
        borderColor:'#FFF',
        borderRadius:5
    },
   
})

export default class StudyPlayController extends React.Component {
    constructor(props){
        super(props);
    }


    
    //选择播放时间间隔
    _chooseInterval = (interval)=>{
        const {changeInterval } = this.props;
        VocaPlayInterval = interval;
        changeInterval(VocaPlayInterval);
        
    }

    //播放暂停切换
    _togglePlay = ()=>{
        const {autoPlayTimer, task } = this.props.vocaPlay;
        const {curIndex} = task
        const {changePlayTimer} = this.props;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
        }else {
            //播放
            this.props.autoplay(curIndex);
        }
    }


    render(){
        const {task, themes, themeId, autoPlayTimer,showWord, showTran, interval, } = this.props.vocaPlay;
        const {words,wordCount, curIndex} = task
        const {toggleWord, toggleTran, } = this.props;
        //主题
        const Theme = themes[themeId]
        const selected = {
            color:'#FFF',
            borderColor:Theme.themeColor,
            backgroundColor:Theme.themeColor,
        }
        const progressNum = wordCount==undefined?0:(curIndex+1)/wordCount

        return(
            //  底部控制
             <Grid style={{width:width, position:'absolute', bottom:0}}>
                {/* 功能按钮 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    paddingHorizontal:20,
                }}>
                 {/* 英文单词按钮 */}
             
                    <TouchableWithoutFeedback onPress={this.props.toggleWord}>
                        <Text style={[styles.textIcon, showWord?selected:styles.unSelected]}>
                            en
                        </Text>
                    </TouchableWithoutFeedback>
                  
                    {/* 中文按钮 */}
                    <TouchableWithoutFeedback onPress={this.props.toggleTran}>
                        <Text style={[styles.textIcon, showTran?selected:styles.unSelected]}>
                            zh
                        </Text>
                    </TouchableWithoutFeedback>
                </Row>
            
                <WhiteSpace size='xl'/>
                 {/* 进度条 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <Text style={{color:'#fff' , marginRight:5}}>{wordCount==0?0:curIndex+1}</Text>
                        <Progress.Bar 
                            progress={wordCount==0?0:progressNum} 
                            height={2} 
                            width={width-100} 
                            color= {Theme.themeColor} 
                            unfilledColor='#DEDEDE' 
                            borderWidth={0}/>
                        <Text style={{color:'#fff' ,  marginLeft:10}}>{wordCount}</Text>
                    </View>
                </Row>
             
                <WhiteSpace size='sm'/>
                {/*  */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    alignItems:'center',
                    paddingHorizontal:30,
                }}>
                    {/* 退出 */}
                    <AliIcon name='iconfontshouye' size={26} color='#FFF'></AliIcon>
                    {/* 控制播放 */}
                    <View style={{
                        width:width*(1/2),
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        <TouchableNativeFeedback  onPress={this._togglePlay}>
                            <View style={[styles.bigRoundBtn,{paddingLeft:autoPlayTimer?0:5}, {backgroundColor:Theme.themeColor}]}>
                                <AliIcon name={autoPlayTimer?'zanting1':'play'} size={22} color='#FFF'></AliIcon>
                            </View>
                        </TouchableNativeFeedback>
                      
                    </View>
                    {/* 控制间隔 */}
                    <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger text={interval+'s'} customStyles={{triggerText: styles.intervalButton,}}/>
                        <MenuOptions>
                            <MenuOption style={gstyles.haireBottom} value={5.0}>
                                <Text style={{color: Theme.themeColor}}>5.0s</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={4.0}>
                                <Text style={{color: Theme.themeColor}}>4.0s</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={3.0}>
                                <Text style={{color: Theme.themeColor}}>3.0s</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={2.0}>
                                <Text style={{color: Theme.themeColor}}>2.0s</Text>
                            </MenuOption>
                            <MenuOption value={1.0}>
                                <Text style={{color: Theme.themeColor}}>1.0s</Text>
                            </MenuOption>
                            
                        </MenuOptions>
                    </Menu>
                </Row>
                <WhiteSpace size='lg'/>
            </Grid>
         
        );
    }
}

