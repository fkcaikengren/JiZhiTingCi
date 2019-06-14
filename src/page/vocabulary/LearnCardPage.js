import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base";
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux'
import {NavigationActions, StackActions} from 'react-navigation'

import AliIcon from '../../component/AliIcon';
import * as LearnNewAction from '../../action/vocabulary/learnNewAction'
import * as VocaDao from '../../dao/vocabulary/VocaDao'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    iconText:{
        width:32,
        height:32, 
        backgroundColor:'#1890FF', 
        textAlign:'center', 
        lineHeight:32, 
        borderRadius:50,
    },
    bottomBtn:{
        width: (width-80)/2,
        elevation: 0,
        backgroundColor: '#1890FF',

    }, 
    fonts:{
        fontSize:16,
        color:'#404040',
        lineHeight:24,
    },
    phonetic:{
        fontSize: 16,
        color: '#101010',
    }
});




class LearnCardPage extends Component {


    constructor(props){
        super(props)

    }

    componentDidMount(){
        
    }

    //回到首页
    _backToHome = ()=>{
        // 抹掉stack，跳转到指定路由
        const  resetAction = StackActions.reset({  
            index: 0,
            actions: [
                NavigationActions.navigate({routeName:'Home'})
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    _nextWord = ()=>{
        //跳到下一个单词
        const {nextWord, finishCardLearn} = this.props
        const {curIndex, task} = this.props.learnNew
        if(curIndex < task.words.length-1){
            nextWord();
        }else{
            //完成卡片学习
            finishCardLearn();
            //导航到测试页面
            this.props.navigation.navigate('TestEnTran');
        }
    }


    _getWordDetail(){

    }

    _getWordRoot(){

    }



    render() {
        const {task, curIndex} = this.props.learnNew
        const {words} = task;
        return (
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#1890FF', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                            this._backToHome();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <View style={[styles.center,]}>
                            <Progress.Bar progress={0.9} height={10} width={width-120} color='#F6B056' unfilledColor='#FFF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>{words?`${curIndex+1}/${(words.length)}`:'0/0'}</Text> 
                            </Progress.Bar>
                        </View>
                    </Body>
                </Header> 

                <Content padder style={{ backgroundColor:'#FDFDFD', }}>
                    <Grid>
                        {/* 单词 */}
                        <Row>
                            <Text style={{fontSize:20, fontWeight:'500', color:'#F6B056'}}>{words?words[curIndex].word:''}</Text>
                        </Row>
                        {/* 音标 */}
                        <Row style={[styles.row, ]}>
                            <View style={styles.row}>
                                <Text style={styles.phonetic}>{words[curIndex].enPhonetic}</Text>
                                <AliIcon name='shengyin' size={26} color='#E59AAA'></AliIcon>
                            </View>
                            <View style={[{marginLeft:20}, styles.row]}>
                                <Text style={styles.phonetic}>{words[curIndex].amPhonetic}</Text>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                            </View>
                        </Row>
                        {/* 英英释义 */}
                        <Row style={[styles.col, {marginTop:16}]}>
                            <View style={[styles.row]}>
                                <Text style={{fontSize:18,color:'#303030'}}>
                                    {words[curIndex].trans[0] && `${words[curIndex].trans[0].property}. `}
                                </Text>
                                <Text>| 英英释义</Text>
                            </View>
                            <View style={{width:'100%', backgroundColor:'#C0E5FF', padding:4, borderRadius:4,}}>
                                <Text style={styles.fonts}>{words[curIndex].def}</Text>
                            </View>
                        </Row>
                        {/* 例句 */}
                        <Row style={[styles.col, {marginTop:16,} ]}>
                            <View style={[styles.row]}>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                                <Text>例句</Text>
                            </View>
                            <View style={{width:'100%', backgroundColor:'#C0E5FF', padding:5, borderRadius:4,}}>
                                <Text style={styles.fonts}>{words[curIndex].sentence}</Text>
                            </View>
                        </Row>

                        <Row style={[styles.col, {marginTop:16,}]}>
                            {words[curIndex].trans &&
                                words[curIndex].trans.map((item, index)=>(
                                    <View key={index} style={{flex:1, padding:5, borderRadius:4,}}>
                                        <Text numberOfLines={1} style={styles.fonts}>{`${item.property}. ${item.tran}`}</Text>
                                    </View>
                                ))

                            }
                            
                        </Row>
                        
                    </Grid>
                </Content>

                <Footer >
                    <FooterTab style={{backgroundColor:'#FDFDFD'}}>
                        <Button onPress={this._nextWord}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>下一个</Text>
                        </Button>
                        <Button onPress={()=>{
                            this.props.navigation.navigate('VocaDetail');
                        }}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>详情</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                
                   
                
            </Container>
        );
    }
}
const mapStateToProps = state =>({
    learnNew : state.learnNew,
});

const mapDispatchToProps = {
    nextWord: LearnNewAction.nextWord,
    finishCardLearn : LearnNewAction.finishCardLearn,
};

export default connect(mapStateToProps, mapDispatchToProps)(LearnCardPage);