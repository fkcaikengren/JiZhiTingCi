import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View, Text, FlatList, TouchableNativeFeedback} from 'react-native';
import { Container, Header, Content, Footer, Button, Icon, Left, Right, Body, Title,
 Grid, Col, Row, ActionSheet} from 'native-base';
import * as Progress from 'react-native-progress';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import {connect} from 'react-redux';
const Sound = require('react-native-sound');
import {NavigationActions, StackActions} from 'react-navigation'

import * as vocaPlayAction from '../../action/vocabulary/vocaPlayAction';
import {PLAY_LEARN,  PLAY_REVIEW } from '../../constant'
import AliIcon from '../../component/AliIcon';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

global.VocaPlayFlatList = null; //声明全局遍历对象
global.VocaPlayInterval = 1.0;

const styles = StyleSheet.create({
  
    container:{
        width:width,
        height:height-240-STATUSBAR_HEIGHT,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    video:{
        width:width,
        height:260,
    },
    circle:{
        justifyContent:'center',
        alignItems:'center',
    
        width: 26,
        height:26,
        borderColor:'blue',
        borderWidth:1,
        borderRadius:20,
    },

    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    buttonText:{
        color:'#FFF',  
        padding:2,
        fontSize:14,
        textAlign:'center', 
        lineHeight:22, 
    },
    selectedButton:{
        borderColor:'#E59AAA',
        borderWidth:1,
        backgroundColor:'#E59AAA',
        height:22,
        elevation:0,
    },
    unSelectedButton:{
        borderColor:'#FFFFFF',
        borderWidth:1,
        backgroundColor:'#FFFFFF00',
        height:22,
        elevation:0,
    },
    outlineButton:{
        borderColor:'#fff',
        height:22,
        elevation:0
    },
    


    //列表样式
    item: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height: ITEM_H,
        backgroundColor:'#FFFFFF00'
    },

    itemText:{
        color:'#FFFFFFAA',
    },

    playText:{
        fontSize:20,
        color:'red'
    },

    triggerText:{
        color:'#FFF',  
        paddingHorizontal:3,
        fontSize:14,
        textAlign:'center', 
        lineHeight:20, 
        borderWidth:1,
        borderColor:'#FFF',
        borderRadius:1
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
    intervalFont:{
        fontSize:12,
    }

});


class VocaPlayPage extends React.Component {
    constructor(props){
        super(props);
        let playMode = this.props.navigation.getParam('playMode', PLAY_REVIEW)
        this.controlDisable = false
        if(playMode === PLAY_LEARN){
            this.controlDisable = true
            this.learnPlayTime = 0//播放遍数
        }

    }
    componentDidMount(){
        const {curIndex} = this.props.vocaPlay
        //根据传递参数判断，是否自动播放
        if(this.controlDisable){
            this._autoplay(curIndex);
        }

    }

    componentWillUnmount(){ //退出界面
       this._quitLearn();
    }

    //退出页面（学习模式下）
    _quitLearn(){
        if(this.controlDisable){  
            VocaPlayFlatList = 0;
            const {autoPlayTimer, curIndex} = this.props.vocaPlay
            const {changePlayTimer, resetPlayList} = this.props;  
            //停止播放
            if(autoPlayTimer){
                clearTimeout(autoPlayTimer);
            }
            //重置单词列表
            resetPlayList();
            

        }
}

    

    /**
     * @description 自动播放 
     * @memberof SwiperFlatList
     */
    _autoplay = (index) => {
        const { wordList,curIndex, autoPlayTimer} = this.props.vocaPlay;
        const {changePlayTimer} = this.props;

        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if (VocaPlayFlatList ) { //this._flatListRef
            console.log('move');
            VocaPlayFlatList.scrollToIndex(params);
        }


        //2.播放单词音频
        let wordAudio = new Sound(wordList[index].word+'.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            // loaded successfully
            // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
          
            // Play the sound with an onEnd callback
            wordAudio.play((success) => {
              if (success) {
                console.log('successfully finished playing');
                wordAudio.release();
              } else {
                console.log('playback failed due to audio decoding errors');
            }
            });
        });
        //3.循环回调
        let timer = setTimeout(() => {
            const nextIndex = (index + 1) % wordList.length;
            this._replay(  nextIndex);
            
        }, VocaPlayInterval * 1000);
        changePlayTimer(timer);


        //4. 中断播放
        if(this.controlDisable){
            if(curIndex == wordList.length-1){  //最后一个 12
                this.learnPlayTime++
            }
       
            if(this.learnPlayTime >= 1){ //播放一遍后，进入下一阶段

                // 抹掉stack，跳转到指定路由
                const  resetAction = StackActions.reset({  
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName:'LearnCard'})
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }
        }
    };
  
    _replay = (index) => {
        const { autoPlayTimer, } = this.props.vocaPlay;
        const { changeCurIndex } = this.props;
        
        changeCurIndex(index);
        // 回调自动播放
        if (autoPlayTimer) {
            this._autoplay(index);  
        }

        
    }

    _renderItem = ({item, index})=>{
        let {showWord,showTran,curIndex} = this.props.vocaPlay;
        console.log(item.tran)
        let playStyle = {}
        if(curIndex == item.id){
            playStyle = styles.playText;
        }

        return (
            <View style={styles.item}>
                <Text style={[styles.itemText,playStyle]}>{showWord?item.word:''}</Text>
                <Text note numberOfLines={1} style={[styles.itemText,playStyle]}>
                    {showTran?item.tran:''}</Text>
            </View>
        );
    };

    _keyExtractor = (item, index) => index.toString();




    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 

    //选择测试
    _chooseTest = (value) =>{
        switch(value){
            case 0:
                this.props.navigation.navigate('TestEnTran');
                break;
            case 1:
                this.props.navigation.navigate('TestSentence');
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
        const {autoPlayTimer} = this.props.vocaPlay;
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
        const {autoPlayTimer, curIndex, } = this.props.vocaPlay;
        const {changePlayTimer} = this.props;
        if(autoPlayTimer){
            //暂停
            clearTimeout(autoPlayTimer);
            changePlayTimer(0);
        }else {
            //播放
            this._autoplay(curIndex);
        }
    }


    render(){

        const {wordList,  curIndex, themeId, themes, autoPlayTimer,showWord, showTran, interval, } = this.props.vocaPlay;
        const {toggleWord, toggleTran, } = this.props;
        const {navigate} = this.props.navigation
        
        let bgStyle = {backgroundColor: themes[themeId].bgColor};

        let flatListProps = {
            ref: component => {
                VocaPlayFlatList = component;
            },
            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,
            extraData: this.props.vocaPlay,  //wordList是没有变化
            keyExtractor: this._keyExtractor,
            data:wordList,
            renderItem: this._renderItem,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,
        }

        
        return(
            <Container style={bgStyle}>
                <StatusBar
                    translucent={true}
                    // hidden
                />
        
                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#77A3F0'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#77A3F000', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Title>六级词汇</Title>
                    </Body>
                    
                </Header>

                {/* 内容列表 */}
                <Content style={[{marginTop:30},]}>
                    <View style={ styles.container}>
                        <FlatList {...flatListProps}/>
                    </View>
                </Content>

                {/* 底部控制 */}
                <Grid style={{width:width, position:'absolute', bottom:5}}>
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        {/* 英文单词按钮 */}
                        <Button disabled={this.controlDisable} style={[showWord?styles.selectedButton:styles.unSelectedButton, styles.center]} onPress={()=>{toggleWord()}}>
                            <Text style={styles.buttonText}> en </Text>
                        </Button>
                        {/* 主题按钮 */}
                        <Menu onSelect={this._chooseTheme} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger disabled={this.controlDisable}  text='主题' customStyles={{triggerText: styles.triggerText,}}/>
                            <MenuOptions>
                                {
                                    themes.map((item, index)=>{
                                        return (
                                            <MenuOption key={item.id} value={item.id}>
                                                <Text style={{color: 'red'}}>{item.name}</Text>
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
                                <MenuOption value={0} text='英英释义选词' />
                                <MenuOption value={1}>
                                    <Text style={{color: 'red'}}>例句选词</Text>
                                </MenuOption>
                                <MenuOption value={2}>
                                    <Text style={{color: 'red'}}>看词选中义</Text>
                                </MenuOption>
                                <MenuOption value={3}>
                                    <Text style={{color: 'red'}}>听音选词</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                        {/* 中文按钮 */}
                        <Button disabled={this.controlDisable} style={[showTran?styles.selectedButton:styles.unSelectedButton, styles.center]} onPress={()=>{toggleTran()}}>
                            <Text style={styles.buttonText}> zh </Text>
                        </Button>
                    </Row>
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        paddingVertical:10
                    }}>
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'center',
                            alignItems:'center',
                        }}>
                            <Text style={{color:'#fff' , marginRight:5}}>7</Text>
                            <Progress.Bar progress={0.3} height={2} width={width-100} color='#F79131' unfilledColor='#DEDEDE' borderWidth={0}/>
                            <Text style={{color:'#fff' ,  marginLeft:10}}>20</Text>
                        </View>
                    </Row>
                    {/* 播放按钮 */}
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                        marginBottom:10,
                    }}>
                        
                        <Menu onSelect={this._chooseInterval} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger disabled={this.controlDisable} text={interval+'s'} customStyles={{triggerText: styles.intervalButton,}}/>
                            <MenuOptions>
                            <MenuOption value={5.0}>
                                    <Text>5.0s</Text>
                                </MenuOption>
                                <MenuOption value={4.0}>
                                    <Text>4.0s</Text>
                                </MenuOption>
                                <MenuOption value={3.0}>
                                    <Text>3.0s</Text>
                                </MenuOption>
                                <MenuOption value={2.0}>
                                    <Text>2.0s</Text>
                                </MenuOption>
                                <MenuOption value={1.0}>
                                    <Text>1.0s</Text>
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
                                <AliIcon name='icon-2' size={32} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                            
                            
                            <TouchableNativeFeedback  onPress={this.controlDisable?()=>{}:this._togglePlay}>
                                <AliIcon name={autoPlayTimer?'icon-3':'icon-'} size={50} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                            
                            <TouchableNativeFeedback  >
                                <AliIcon name='icon-1' size={32} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                        </View>
                        <TouchableNativeFeedback  >
                            <AliIcon name='bofangliebiaoicon' size={20} color='#FFF'></AliIcon>
                        </TouchableNativeFeedback>
                        
                        
                            
                    </Row>
                </Grid>
                
            </Container>

        );
    }
}



const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    changePlayTimer : vocaPlayAction.changePlayTimer,
    changeCurIndex : vocaPlayAction.changeCurIndex,
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,
    changeInterval : vocaPlayAction.changeInterval,
    resetPlayList : vocaPlayAction.resetPlayList,
    
};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);