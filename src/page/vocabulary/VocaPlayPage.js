import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View, Text, FlatList, TouchableNativeFeedback} from 'react-native';
import { Container, Header, Content, Footer, Button, Icon, Left, Right, Body, Title,
 Grid, Col, Row, ActionSheet} from 'native-base';
import * as Progress from 'react-native-progress';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import {connect} from 'react-redux';
import * as vocaPlayAction from '../../action/vocabulary/vocaPlayAction';
const Sound = require('react-native-sound');

import AliIcon from '../../component/AliIcon';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;



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
    button:{
        backgroundColor:'#E59AAA',
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
    }

});


class VocaPlayPage extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        const {curIndex, autoPlay} = this.props.vocaPlay;
        if(!autoPlay){
            alert(curIndex);
            let params = { animated:true, index:curIndex, viewPosition:0.5 };
            if (this._flatListRef) {
                this._flatListRef.scrollToIndex(params);
            }
        }
    }




    /**
     * @description 自动播放 
     * @memberof SwiperFlatList
     */
    _autoplay = (index) => {
        const {interval, wordList} = this.props.vocaPlay;

        if (this.autoplayTimer) {
            clearTimeout(this.autoplayTimer);
        }

        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if (this._flatListRef) {
            this._flatListRef.scrollToIndex(params);
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
        this.autoplayTimer = setTimeout(() => {
            const nextIndex = (index + 1) % wordList.length;
            this._replay(  nextIndex);
            
        }, interval * 1000);
    };
  
    _replay = (index) => {
        let { autoPlay, } = this.props.vocaPlay;
        let { changeCurIndex } = this.props;
        
        changeCurIndex(index);
        // 回调自动播放
        if (autoPlay) {
            this._autoplay(index);  
        }

        
    }

    _renderItem = ({item, index})=>{
        let {showWord,showTran,curIndex} = this.props.vocaPlay;
        let playStyle = {}
        if(curIndex == item.id){
            playStyle = styles.playText;
        }
        console.log(`word id: ${item.id}`);
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

    _chooseTheme = (themeId)=>{
        let {changeTheme} = this.props;
        changeTheme(themeId);
    }

    _togglePlay = ()=>{
        let {autoPlay, curIndex, } = this.props.vocaPlay;
        let {togglePlay} = this.props;
        if(autoPlay){
            //暂停
            this.setState({iconName:'play'});
            if(this.autoplayTimer){
                clearTimeout(this.autoplayTimer);
            }
        }else {
            //播放
            this._autoplay(curIndex);
            this.setState({iconName:'pause'});
        }
        togglePlay();

    }

    render(){

        const {wordList, themeId, themes, autoPlay} = this.props.vocaPlay;
        const {toggleWord, toggleTran} = this.props;
        let bgStyle = {backgroundColor: themes[themeId].bgColor};

        let flatListProps = {
            ref: component => {
                this._flatListRef = component;
            },

            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,

            extraData: this.props.vocaPlay,
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
                        <Button style={[styles.button, styles.center]} onPress={()=>{toggleWord()}}>
                            <Text style={styles.buttonText}> en </Text>
                        </Button>
                        <Menu onSelect={this._chooseTheme} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger text='主题' customStyles={{triggerText: styles.triggerText,}}/>
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
                        <Menu onSelect={this._chooseTest} renderer={renderers.Popover} rendererProps={{placement: 'top'}}>
                            <MenuTrigger text='测试' customStyles={{triggerText: styles.triggerText,}}/>
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
                       
                        <Button style={[styles.button, styles.center]} onPress={()=>{toggleTran()}}>
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
                        <Button transparent style={{ borderColor:'#fff'}}>
                            <Text  style={{
                                color:'#fff' , 
                                borderColor:'#fff',
                                fontSize:16,
                                }}>
                            1.0s
                            </Text>
                        </Button>
                        <View style={{
                            width:width*(1/2),
                            flexDirection:'row',
                            justifyContent:'space-around',
                            alignItems:'center',
                        }}>
                            <AliIcon name='icon-2' size={32} color='#FFF'></AliIcon>
                            <TouchableNativeFeedback onPress={this._togglePlay}>
                                <AliIcon name={autoPlay?'zanting':'icon-'} size={50} color='#FFF'></AliIcon>
                            </TouchableNativeFeedback>
                            
                            <AliIcon name='icon-1' size={32} color='#FFF'></AliIcon>
                        </View>
                        
                        <AliIcon name='bofangliebiao1' size={30} color='#FFF'></AliIcon>
                            
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
    togglePlay : vocaPlayAction.togglePlay,
    changeCurIndex : vocaPlayAction.changeCurIndex,
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,

};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);