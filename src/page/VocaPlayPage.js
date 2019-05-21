import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Footer, Button, Icon, Left, Right, Body, Title,
 Grid, Col, Row} from 'native-base';
import * as Progress from 'react-native-progress';
// import {connect} from 'react-redux';

import VocaPlayList from '../component/VocaPlayList';
import AliIcon from '../component/AliIcon';
// import {changeSelectedPlayIndex , changePlayType,} from '../redux/actions/wordReview'
// import { PlayType } from '../constant/VocConstant';




const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
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
    }

});

/**
 *Created by Jacy on 19/03/29.
 */
export default class VocaPlayPage extends React.Component {
    constructor(props){
        super(props);
        this.state={iconName:'pause'}
    }


    componentDidMount(){
       
    }

    render(){

        return(


            <Container style={{backgroundColor:'#1890FFCC'}}>
                <StatusBar
                    translucent={true}
                    // hidden
                />
        
                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#77A3F0'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#77A3F000', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui-copy-copy' size={26} color='#fff' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Title>六级词汇</Title>
                    </Body>
                    
                </Header>
                {/* 内容 */}
                <Content style={{marginTop:30}}>
                     {/* 列表 */}
                    <View 
                    style={styles.container}>
                        <VocaPlayList {...this.props}/>
                    </View>
                    {/* <BottomPlayControl/> */}
                </Content>

                {/* 页脚 */}
                <Grid style={{width:width, position:'absolute', bottom:5}}>
                    <Row style={{
                        flexDirection:'row',
                        justifyContent:'space-around',
                        alignItems:'center',
                    }}>
                        <Button style={[styles.button, styles.center]}>
                            <Text style={styles.buttonText}> en </Text>
                        </Button>
                        <Button bordered style={[styles.outlineButton, styles.center]}>
                            <Text style={styles.buttonText}> 主题 </Text>
                        </Button>
                        <Button bordered style={[styles.outlineButton, styles.center]}>
                            <Text style={styles.buttonText}> 测试 </Text>
                        </Button>
                        <Button style={[styles.button, styles.center]}>
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



// const mapStateToProps = state =>({
//     playType : state.wordReview.playType,
// });

// const mapDispatchToProps = {
//     changePlayType,
// };

