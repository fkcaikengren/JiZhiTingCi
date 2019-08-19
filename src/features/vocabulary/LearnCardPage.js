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
        
    }

    componentDidMount(){
        
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

                <Footer >
                    <FooterTab style={{backgroundColor:'#FDFDFD'}}>
                        <Button onPress={this._nextWord}>
                            <Text style={{fontSize:14,color:'#1890FF', fontWeight:'500'}}>下一个</Text>
                        </Button>
                        <Button onPress={()=>{
                            
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
