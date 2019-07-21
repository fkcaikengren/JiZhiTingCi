import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';
import { Container, Header, Content, Icon, Accordion, Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base"
import * as Progress from 'react-native-progress'
import {connect} from 'react-redux'
import {NavigationActions, StackActions} from 'react-navigation'

import AliIcon from '../../component/AliIcon'
import styles from './LearnCardStyle'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;



export default class LearnCardPage extends Component {


    constructor(props){
        super(props)
        this.state = {task:{curIndex:0, taskWords:null}, refresh:false}
        this.taskDao = this.props.navigation.getParam('taskDao');
        this.VocaDao = this.props.navigation.getParam('vocaDao');
        this.taskOrder = this.props.navigation.getParam('taskOrder')
    }

    componentDidMount(){
        //加载当前task数据
        let task = this.taskDao.getTask(this.taskOrder)
        
        //查询task里面的单词信息，补充进去（需要先判断是否查询并写入过数据）
        if(!task.dataCompleted){
            this.taskDao.modify(()=>{
                this.VocaDao.writeInfoToTask(task)
            })  
        }
       
        console.log('task:')
        console.log(task)
        this.setState({task})
    }

    componentWillUnmount(){
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

    //跳到下一个页面
    _nextPage = (page)=>{
        // 抹掉stack，跳转到指定路由
        const  resetAction = StackActions.reset({  
            index: 0,
            actions: [
                NavigationActions.navigate({routeName:page}, {
                    taskDao: this.taskDao,
                    vocaDao: this.vocaDao,
                    taskOrder: this.taskOrder
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    _nextWord = ()=>{
        //跳到下一个单词
        let task = this.state.task
        if(task.curIndex < task.taskWords.length-1){
            //fn:nextWord
            this.taskDao.modify(()=>{
                task.curIndex = task.curIndex+1
            })
            this.setState({refresh:!this.state.refresh})
        }else{
            //fn: finishCardLearn
            this.taskDao.modify(()=>{
                //完成卡片学习
                task.learnStatus = 'IN_LEARN_TEST1'
                task.curIndex = 0
            })
            //导航到测试页面
            this._nextPage('TestEnTran')
        }
    }





    render() {
        let {taskWords, curIndex } = this.state.task
        console.log(taskWords?taskWords[0]:'')
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
                            <Progress.Bar progress={taskWords?(curIndex+1)/taskWords.length:0} height={10} width={width-120} color='#F6B056' unfilledColor='#FFF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>{taskWords?`${curIndex+1}/${(taskWords.length)}`:'0/0'}</Text> 
                            </Progress.Bar>
                        </View>
                    </Body>
                </Header> 

                <Content padder style={{ backgroundColor:'#FDFDFD', }}>
                    <Grid>
                        {/* 单词 */}
                        <Row>
                            <Text style={{fontSize:20, fontWeight:'500', color:'#F6B056'}}>{taskWords?taskWords[curIndex].word:''}</Text>
                        </Row>
                        {/* 音标 */}
                        <Row style={[styles.row, ]}>
                            <View style={styles.row}>
                                <Text style={styles.phonetic}>{taskWords?taskWords[curIndex].enPhonetic:''}</Text>
                                <AliIcon name='shengyin' size={26} color='#E59AAA'></AliIcon>
                            </View>
                            <View style={[{marginLeft:20}, styles.row]}>
                                <Text style={styles.phonetic}>{taskWords?taskWords[curIndex].amPhonetic:''}</Text>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                            </View>
                        </Row>
                        {/* 英英释义 */}
                        <Row style={[styles.col, {marginTop:16}]}>
                            <View style={[styles.row]}>
                                <Text style={{fontSize:18,color:'#303030'}}>
                                    {taskWords && taskWords[curIndex] && taskWords[curIndex].trans && taskWords[curIndex].trans[0] && `${taskWords[curIndex].trans[0].property}. `}
                                </Text>
                                <Text>| 英英释义</Text>
                            </View>
                            <View style={{width:'100%', backgroundColor:'#C0E5FF', padding:4, borderRadius:4,}}>
                                <Text style={styles.fonts}>{taskWords?taskWords[curIndex].def:''}</Text>
                            </View>
                        </Row>
                        {/* 例句 */}
                        <Row style={[styles.col, {marginTop:16,} ]}>
                            <View style={[styles.row]}>
                                <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                                <Text>例句</Text>
                            </View>
                            <View style={{width:'100%', backgroundColor:'#C0E5FF', padding:5, borderRadius:4,}}>
                                <Text style={styles.fonts}>{taskWords?taskWords[curIndex].sentence:''}</Text>
                            </View>
                        </Row>

                        <Row style={[styles.col, {marginTop:16,}]}>
                            {taskWords && taskWords[curIndex] && taskWords[curIndex].trans &&
                                taskWords[curIndex].trans.map((item, index)=>(
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
// const mapStateToProps = state =>({
//     learnNew : state.learnNew,
// });

// const mapDispatchToProps = {
//     nextWord: LearnNewAction.nextWord,
//     finishCardLearn : LearnNewAction.finishCardLearn,
// };
