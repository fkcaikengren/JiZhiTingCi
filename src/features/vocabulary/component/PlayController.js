import React, {Component} from 'react';
import {Platform, StatusBar, FlatList,View, Text, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import { Grid, Col, Row,} from 'react-native-easy-grid'
import {WhiteSpace} from '@ant-design/react-native'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import * as Progress from '../../../component/react-native-progress';
import AliIcon from '../../../component/AliIcon'
import styles from '../VocaPlayStyle'
import * as VocaConfig from '../common/vocaConfig'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
global.VocaPlayInterval = 1.0;

export default class PlayController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen:false,
        }
    }


     //选择测试
     _chooseTest = (value) =>{
        switch(value){
            case 0:
                // this.props.navigation.navigate('TestEnTran');
                break;
            case 1:
                // this.props.navigation.navigate('TestSentence');
                break;
            case 2:
                alert(value);
                break;
            case 3:
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
        const {words, curIndex} = task
        const {toggleWord, toggleTran, } = this.props;
        //主题
        const Theme = themes[themeId]
        const selected = {
            color:'#FFF',
            borderColor:Theme.themeColor,
            backgroundColor:Theme.themeColor,
        }


        return(
            //  底部控制
             <Grid style={{width:width, position:'absolute', bottom:0}}>
                {/* 功能按钮 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    alignItems:'center',
                }}>
                 {/* 英文单词按钮 */}
             
                    <TouchableWithoutFeedback onPress={this.props.toggleWord}>
                        <Text style={[styles.textIcon, showWord?selected:styles.unSelected]}>
                            en
                        </Text>
                    </TouchableWithoutFeedback>
                    {/* 主题按钮 */}
                    <Menu onSelect={this._chooseTheme} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger disabled={this.controlDisable}  text={Theme.themeName} customStyles={{triggerText: styles.triggerText,}}/>
                        <MenuOptions>
                            {
                                themes.map((item, index)=>{
                                    return (
                                        <MenuOption key={item.id} value={item.themeId}>
                                            <Text style={{color: Theme.themeColor}}>{item.themeName}</Text>
                                        </MenuOption>
                                    );
                                })
                            }
                            
                        </MenuOptions>
                    </Menu>
                    {/* 测试按钮 */}
                    <Menu onSelect={this._chooseTest} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger disabled={this.controlDisable} text='测试' customStyles={{triggerText: styles.triggerText,}}/>
                        <MenuOptions>
                            <MenuOption  value={0}  >
                                <Text style={{color: Theme.themeColor}}>英英释义选词</Text>
                            </MenuOption>
                            <MenuOption value={1}>
                                <Text style={{color: Theme.themeColor}}>例句选词</Text>
                            </MenuOption>
                            <MenuOption value={2}>
                                <Text style={{color: Theme.themeColor}}>看词选中义</Text>
                            </MenuOption>
                            <MenuOption value={3}>
                                <Text style={{color: Theme.themeColor}}>听音选词</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                    {/* 中文按钮 */}
                    <TouchableWithoutFeedback onPress={this.props.toggleTran}>
                        <Text style={[styles.textIcon, showTran?selected:styles.unSelected]}>
                            zh
                        </Text>
                    </TouchableWithoutFeedback>
                </Row>
            
                <WhiteSpace size='md'/>
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
                        <Text style={{color:'#fff' , marginRight:5}}>{curIndex?curIndex:0}</Text>
                        <Progress.Bar 
                            progress={curIndex?(curIndex+1)/VocaConfig.DEFAULT_TASK_WORD_COUNT:0} 
                            height={2} 
                            width={width-100} 
                            color= {Theme.themeColor} 
                            unfilledColor='#DEDEDE' 
                            borderWidth={0}/>
                        <Text style={{color:'#fff' ,  marginLeft:10}}>{words.length}</Text>
                    </View>
                </Row>
             
                <WhiteSpace size='sm'/>
                {/* 播放按钮 */}
                <Row style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    alignItems:'center',
                }}>
                    <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                        <MenuTrigger disabled={this.controlDisable} text={interval+'s'} customStyles={{triggerText: styles.intervalButton,}}/>
                        <MenuOptions>
                        <MenuOption value={5.0}>
                                <Text style={{color: Theme.themeColor}}>5.0s</Text>
                            </MenuOption>
                            <MenuOption value={4.0}>
                                <Text style={{color: Theme.themeColor}}>4.0s</Text>
                            </MenuOption>
                            <MenuOption value={3.0}>
                                <Text style={{color: Theme.themeColor}}>3.0s</Text>
                            </MenuOption>
                            <MenuOption value={2.0}>
                                <Text style={{color: Theme.themeColor}}>2.0s</Text>
                            </MenuOption>
                            <MenuOption value={1.0}>
                                <Text style={{color: Theme.themeColor}}>1.0s</Text>
                            </MenuOption>
                            
                        </MenuOptions>
                    </Menu>
                    <View style={{
                        width:width*(1/2),
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        <TouchableNativeFeedback >
                            <View style={[styles.smallRoundBtn, {backgroundColor:Theme.themeColor}]}>
                                <AliIcon name='SanMiAppoutlinei1' size={20} color='#FFF'></AliIcon>
                            </View>
                        </TouchableNativeFeedback>
                        
                        
                        <TouchableNativeFeedback  onPress={this.controlDisable?()=>{}:this._togglePlay}>
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
                <WhiteSpace size='lg'/>
            </Grid>
         
        );
    }
}