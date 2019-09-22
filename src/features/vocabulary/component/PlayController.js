import React, {Component} from 'react';
import {Platform, StatusBar, FlatList,View, Text, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { Grid, Col, Row,} from 'react-native-easy-grid'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import BackgroundTimer from 'react-native-background-timer';
import NotificationManage from '../../../modules/NotificationManage'

import * as Progress from '../../../component/react-native-progress';
import AliIcon from '../../../component/AliIcon'
import styles from '../VocaPlayStyle'
import gstyles from '../../../style';

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class PlayController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen:false,
        }
    }


     //选择测试
     _chooseTest = (value) =>{
        const {navigate} = this.props.navigation
        const {task} = this.props.vocaPlay
        const testTask = {...task, curIndex:0}
        this._pause()
        switch(value){
            case 0: //中义选词测试
                // this.props.navigation.navigate('TestEnTran');
                break;
            case 1: //例句选词测试
                // this.props.navigation.navigate('TestSentence');
                break;
            case 2: //词选中义测试 
                navigate('TestVocaTran',{task:testTask, mode:'normal', isRetest:false})
                break;
            case 3: //听音选词测试
                alert(value);
                break;
        }
    }

    //选择主题
    _chooseTheme = (themeId)=>{
        console.log(`改变主题：${themeId}`)
        const {changeTheme} = this.props;
        changeTheme(themeId);
    }

    //选择播放时间间隔
    _chooseInterval = (interval)=>{
        const {changeInterval } = this.props;
        changeInterval(interval);
        
    }

    _pause = ()=>{
        const {autoPlayTimer, task, curIndex } = this.props.vocaPlay;
        const {changePlayTimer} = this.props;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
            NotificationManage.pause((e)=>{
                console.log(e)
            },()=>null);

        }
    }

    //播放暂停切换
    _togglePlay = ()=>{
        const {autoPlayTimer, task, curIndex } = this.props.vocaPlay;
        const {changePlayTimer} = this.props;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
            NotificationManage.pause((e)=>{
                console.log(e)
            },()=>null);

        }else {
            //播放
            this.props.autoplay(curIndex);
            NotificationManage.play((e)=>{
                console.log(e)
            },()=>null);
        }
    }

    


    render(){
        const {task, themes, themeId, autoPlayTimer,showWord, showTran, interval, curIndex} = this.props.vocaPlay;
        const {words,wordCount} = task
        const {toggleWord, toggleTran, } = this.props;
        //主题
        const Theme = themes[themeId]
        const selected = {
            color:'#FFF',
            borderColor:Theme.themeColor,
            backgroundColor:Theme.themeColor,
        }
        const progressNum = wordCount==undefined?0:(curIndex+1)/wordCount
        const popStyle = {fontSize:16, padding:6, color: Theme.themeColor}
        return(
            //  底部控制
             <Grid style={{width:width, position:'absolute', bottom:0}}>
                {/* 功能按钮 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    alignItems:'center',
                    marginHorizontal:10,
                    marginBottom:10,
                }}>
                 {/* 英文单词按钮 */}
                    <View 
                        onStartShouldSetResponder={(e)=>true}
                        onResponderGrant={(e)=>toggleWord()}
                        >
                        <Text style={[styles.textIcon, showWord?selected:styles.unSelected]}>en</Text>
                    </View>
                    {/* 主题按钮 */}
                    <Menu onSelect={this._chooseTheme} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger  text={Theme.themeName} customStyles={{triggerText: styles.triggerText,}}/>
                        <MenuOptions>
                            {
                                themes.map((item, index)=>{
                                    return (
                                        <MenuOption key={item.id} value={item.themeId} style={index+1===themes.length?{}:gstyles.haireBottom} >
                                            <Text style={popStyle}>{item.themeName}</Text>
                                        </MenuOption>
                                    );
                                })
                            }
                            
                        </MenuOptions>
                    </Menu>
                    {/* 测试按钮 */}
                    <Menu onSelect={this._chooseTest} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger text='测试' customStyles={{triggerText: styles.triggerText,}}/>
                        <MenuOptions>
                            <MenuOption style={gstyles.haireBottom}  value={0}  >
                                <Text style={popStyle}>中义选词测试</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom}  value={1}>
                                <Text style={popStyle}>例句选词测试</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom}  value={2}>
                                <Text  style={popStyle}>词选中义测试</Text>
                            </MenuOption>
                            <MenuOption value={3}>
                                <Text style={popStyle}>听音选词测试</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    {/* 中文按钮 */}
                    <View 
                        onStartShouldSetResponder={(e)=>true}
                        onResponderGrant={(e)=>toggleTran()}
                        >
                        <Text style={[styles.textIcon, showTran?selected:styles.unSelected]}>zh</Text>
                    </View>
                </Row>
            
                 {/* 进度条 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    marginBottom: 5,
                }}>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <Text style={{color:'#fff' , marginRight:5}}>{(wordCount==0 || wordCount==undefined)?0:curIndex+1}</Text>
                        <Progress.Bar 
                            progress={wordCount==0?0:progressNum}  //
                            height={2} 
                            width={width-100} 
                            color= {Theme.themeColor} 
                            unfilledColor='#DEDEDE' 
                            borderWidth={0}/>
                        <Text style={{color:'#fff' ,  marginLeft:10}}>{wordCount}</Text>
                    </View>
                </Row>
             
                {/* 播放按钮 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    alignItems:'center',
                    paddingHorizontal:14,
                    marginBottom:10,
                }}>
                    <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger text={Math.floor(interval)+'s'} customStyles={{triggerText: styles.intervalButton,}}/>
                        <MenuOptions>
                            <MenuOption style={gstyles.haireBottom} value={4.0}>
                                <Text style={popStyle}>4.0s</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={3.0}>
                                <Text style={popStyle}>3.0s</Text>
                            </MenuOption>
                            <MenuOption style={gstyles.haireBottom} value={2.0}>
                                <Text style={popStyle}>2.0s</Text>
                            </MenuOption>
                            <MenuOption value={1.4}>
                                <Text style={popStyle}>1.0s</Text>
                            </MenuOption>
                            
                        </MenuOptions>
                    </Menu>
                    <View style={{
                        width:width*(1/2)+30,
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        <TouchableNativeFeedback >
                            <View style={[styles.smallRoundBtn, {backgroundColor:Theme.themeColor}]}>
                                <AliIcon name='SanMiAppoutlinei1' size={20} color='#FFF'></AliIcon>
                            </View>
                        </TouchableNativeFeedback>
                        
                        
                        <TouchableNativeFeedback  onPress={this._togglePlay}>
                            <View style={[styles.bigRoundBtn,{paddingLeft:autoPlayTimer?0:5}, {backgroundColor:Theme.themeColor}]}>
                                <AliIcon name={autoPlayTimer?'zanting1':'play'} size={22} color='#FFF'></AliIcon>
                            </View>
                        </TouchableNativeFeedback>
                        
                        <TouchableNativeFeedback  >
                            <View style={[styles.smallRoundBtn, {backgroundColor:Theme.themeColor}]}>
                                <AliIcon name='SanMiAppoutlinei' size={20} color='#FFF'></AliIcon>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <TouchableNativeFeedback  onPress={this.props.openTaskListModal}>
                        <AliIcon name='bofangliebiaoicon' size={20} color='#FFF'></AliIcon>
                    </TouchableNativeFeedback>
                </Row>

            </Grid>
         
        );
    }
}