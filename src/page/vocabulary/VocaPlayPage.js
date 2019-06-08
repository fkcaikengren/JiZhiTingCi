import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View, Text, FlatList} from 'react-native';
import { Container, Header, Content, Footer, Button, Icon, Left, Right, Body, Title,
 Grid, Col, Row, ActionSheet} from 'native-base';
import * as Progress from 'react-native-progress';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import {connect} from 'react-redux';
import * as vocaPlayAction from '../../action/vocabulary/vocaPlayAction';


import AliIcon from '../../component/AliIcon';
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;



const styles = StyleSheet.create({
  
    container:{
        width:width,
        height:height-50-STATUSBAR_HEIGHT,
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
        this.state={iconName:'pause'}
    }
    componentDidMount(){
       
    }

    _renderItem = ({item, index})=>{
        let {showWord,showTran} = this.props.vocaPlay;
        console.log(`word id: ${item.id}`);
        return (
            <View style={styles.item}>
                <Text style={[styles.itemText,]}>{showWord?item.word:''}</Text>
                    <Text note numberOfLines={1} style={[styles.itemText,]}>
                    {showTran?item.tran:''}
                </Text>
            </View>
        );
    };

    _keyExtractor = (item, index) => index.toString();

    _onScrollToIndexFailed = info => {
        setTimeout(() => this._scrollToIndex( false, info.index, info.vocs));
    };



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


    render(){

        let {wordList, themeId, themes} = this.props.vocaPlay;
        let {toggleWord, toggleTran} = this.props;
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
            
            // onScrollToIndexFailed: this._onScrollToIndexFailed,
            // initialNumToRender: 16,
            // getItemLayout: this._getItemLayout,
            
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
                <Content style={{marginTop:30}}>
                  <FlatList {...flatListProps}/>
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
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                        marginBottom:10,
                    }}>
                            {/* onPress={()=>{
                                const {playType} = this.props;
                                if(playType === PlayType.PLAYING){
                                    //暂停
                                    this
                                    this.props.pause();
                                    //改变图标
                                    let icon = this.state.iconName;
                                    if(icon == 'play'){
                                        this.setState({iconName:'pause'});
                                    }else if(icon == 'pause'){
                                        this.setState({iconName:'play'});
                                    }
                                }else if(playType === PlayType.PAUSED){
                                    //播放
                                    this.props.play();
                                } */}
                            
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
                                <AliIcon name='icon-' size={50} color='#FFF'></AliIcon>
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
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,

};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);