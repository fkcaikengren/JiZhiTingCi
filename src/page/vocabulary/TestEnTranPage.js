import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,TouchableNativeFeedback,} from 'react-native';
import { Container, Header, Content, Icon, Accordion,  Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base";
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux'
import {NavigationActions, StackActions} from 'react-navigation'
import Modal from 'react-native-modalbox';
import Ionicons from "react-native-vector-icons/Ionicons";
    

import AliIcon from '../../component/AliIcon'
import * as LearnNewAction from '../../action/vocabulary/learnNewAction'
import DetailDictPage from '../../component/DetailDictPage'



const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F0F0F0',
    },
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    row:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    col:{
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    tipRow:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    enFont:{
        fontSize:18,
        color:'#303030'
    },
    btnFont:{
        fontSize:16,
        color:'#303030',
        fontWeight:'500'
    },
    selectBtn:{
        borderWidth:1,
        borderColor:'#FDFDFD',
        backgroundColor:'#FDFDFD',
        width:'100%',
        elevation:0,
    
    },
    modal: {
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
      },

    modal2: {
        width:width,
        height: height-StatusBarHeight,
        backgroundColor: "#FDFDFD"
    },
    modalBtn:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#A0A0A0',
        borderRadius:2,
        
    },
    modalBottom:{
        position:'absolute', 
        bottom:0, 
        width:width,
        height:50,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:'#EFEFEF'
    }
   
    
});

class TestEnTranPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            isDetailModalOpen:false,
            isWrongModalOpen:false
       }
    }

    componentDidMount(){
       this._genOptions(0)
      
    }


    //产生选项和答案
    _genOptions(curIndex){
        const {task, } = this.props.learnNew
        const {changeOptions} = this.props
        console.log(task.words.length);
        //生成选项
        let answerIndex = this._randomNum(0,3)                 //产生一个随机下标
        let options = this._randomArr(0, task.words.length-1, curIndex)            //3个选项
        options.splice(answerIndex, 0, curIndex)        //插入
        changeOptions(options, answerIndex)
    }

    //判断答案 isWrong: 返回是否选错
    _judgeAnswer(index){
        //index范围： [0,1,2,3,4],其中4是查看提示
        const {task, curIndex, answerIndex } = this.props.learnNew
        const {selectAnswer} = this.props
        let isWrong = false
        if(index == 4){     //查看提示
            selectAnswer(index, 3)
        }else if(index == answerIndex){ //选择正确
            selectAnswer(index, 1)
        }else{      //选择错误
            selectAnswer(index, 2)
            isWrong = true
        }
        return isWrong
    }


    //生成一个minNum到maxMum间的随机数数组 (不出现指定数)
    _randomArr = (minNum, maxNum, num) => {
        let options = []

        for(let i of [1,2,3]){ //产生3个选项
            let option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            while(options.includes(option) || option == num){
                option = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
            }
            options.push(option)
        }
        return options
    }

    //生成一个minNum到maxMum间的随机数
    _randomNum = (minNum, maxNum) => {
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    //回到首页
    _backToHome = ()=>{
        // 抹掉stack，跳转到指定路由
        const  resetAction = StackActions.reset({  
            index: 0,
            actions: [
                NavigationActions.navigate({routeName:'Home'}),
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }



    //创建单词详情modal, 
    _createDetailModal = (isWrong) =>{
        const {task, curIndex} = this.props.learnNew
        // isWrong=true，表示选错后的Modal；isWrong=false,表示查看提示的Modal
        return <Modal style={[styles.modal, styles.modal2]}
                isOpen={isWrong?this.state.isWrongModalOpen : this.state.isDetailModalOpen} 
                onClosed={isWrong?this._closeWrongModal:this._closeDetailModal}
                onOpened={isWrong?this._openWrongModal:this._openDetailModal}
                backdrop={true} 
                backdropPressToClose={false}
                swipeToClose={false}
                position={"bottom"} 
                ref={ref => {
                    this.detailModal = ref
                }}>
                <DetailDictPage word={task.words[curIndex].word}/>
                <View style={styles.modalBottom }>
                    <TouchableNativeFeedback  >
                    <View style={[styles.modalBtn,{width:width/5}]}>
                            <Text style={{fontSize:16,color:'#404040'}}>Pass</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>{
                        const {curIndex, task} = this.props.learnNew
                        const {nextWord, reset} = this.props
                        
                        if(isWrong){
                            if(curIndex >= task.words.length-1){ //结束本轮测试
                                //暂时设置为退出 => 回到首页
                                alert('学习完毕');
                                reset()
                                this._backToHome()

                            }else{
                                 //如果是做错题，则跳到下一个单词
                                this._closeWrongModal()
                                nextWord()
                                this._genOptions(curIndex+1)
                            }
                           

                            
                        }else{
                            this._closeDetailModal()
                        }
                    }}>
                        <View style={[styles.modalBtn, {width:width*3/5}]} >
                            <Text style={{fontSize:16,color:'#404040'}}>继续做题</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
        </Modal>
    }
     //打开单词详情页
    _openDetailModal = ()=>{
        this.setState({isDetailModalOpen:true})
    }
    _closeDetailModal = ()=>{
        this.setState({isDetailModalOpen: false});
    }

    _openWrongModal = ()=>{
        this.setState({isWrongModalOpen:true})
    }
    _closeWrongModal = ()=>{
        this.setState({isWrongModalOpen: false});
    }

    render() {
        const {task, curIndex,options, answerIndex,selectedIndex, selectedStatus} = this.props.learnNew
        const {words} = task
        const {nextWord,reset} = this.props
        let curWord = words[curIndex]

       

        //已选择
        let selected = (selectedStatus==1 || selectedStatus==2);
        //选择失败
        let selectWrong = (selectedStatus==2 );

        
      
        return (
            <Container style={styles.container}>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#1890FF', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <View style={[styles.center,]}>
                            <Progress.Bar progress={0.9} height={10} width={width-120} color='#F6B056' unfilledColor='#FFF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>3/15</Text> 
                            </Progress.Bar>
                        </View>
                    </Body>
                </Header> 

                {/* 内容 */}
                <Content padder style={{ backgroundColor:'#F0F0F0', }}>
                    <Grid style={{marginTop:40}}>
                        <Row style={[styles.col, {marginTop:16}]}>
                            <View style={styles.tipRow}>
                                <View style={[styles.row]}>
                                    <Text style={{color:'#303030',fontSize:16,}}>英英释义</Text>
                                </View>
                                <Text style={{color:'#EC6760',fontSize:16,}}>{`答错${curWord.testWrongNum}次`}</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'#C0E5FF', padding:4, borderRadius:4, marginTop:5}}>
                                <Text style={styles.enFont}>{curWord.def}</Text>
                            </View>
                        </Row>
                        
                    </Grid>
                </Content>

                <Grid style={{padding:10}}>
                    {options.length!=0 &&
                        options.map((option, index)=>{
                           
                            return <Row key={index} style={styles.row}>
                                <Button block style={[
                                    styles.selectBtn, 
                                    index==answerIndex&&selected?{borderColor:'#1890FF'}:{}, 
                                    index==selectedIndex&&selectWrong?{borderColor:'#EC6760'}:{}]} onPress={()=>{
                                    if(this._judgeAnswer(index)){ //选择错误
                                        this._openWrongModal()
                                    }else{                      //选择正确
                                        if(curIndex >= task.words.length-1){//结束测试
                                            alert('学习完毕')
                                            reset()
                                            this._backToHome()
                                        }else{
                                            nextWord()
                                            this._genOptions(curIndex+1)
                                        }
                                    }
                                    
                                    
                                }}>
                                    <Text style={[
                                        styles.btnFont, 
                                        index==answerIndex&&selected?{color:'#1890FF'}:{},
                                        index==selectedIndex&&selectWrong?{color:'#EC6760'}:{}]}>{words[option].word}</Text>
                                </Button>
                        </Row>
                        })
                    }
                    
                    
                    <Row style={styles.row}>
                        <Button block style={styles.selectBtn} onPress={this._openDetailModal}>
                            <Text style={{color:'#EC6760',fontSize:16,}}>7  想不起来了，查看提示</Text>
                        </Button>
                    </Row>
                </Grid>
                {
                    this._createDetailModal(false)
                }
                {
                    this._createDetailModal(true)
                }
            </Container>
        );
    }
}


const mapStateToProps = state =>({
    learnNew : state.learnNew
});

const mapDispatchToProps = {
    nextWord: LearnNewAction.nextWord,
    changeOptions: LearnNewAction.changeOptions,
    selectAnswer: LearnNewAction.selectAnswer,
    reset: LearnNewAction.reset,
};

export default connect(mapStateToProps, mapDispatchToProps)(TestEnTranPage);