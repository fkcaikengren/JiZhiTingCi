import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,TouchableNativeFeedback,} from 'react-native';
import { Container, Header, Content, Icon, Accordion,  Body,Title, Grid, Col, Row,
    Button, Footer, FooterTab} from "native-base";
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux'
import {NavigationActions, StackActions} from 'react-navigation'
import Modal from 'react-native-modalbox';
import Ionicons from "react-native-vector-icons/Ionicons";
import DetailDictPage from './component/DetailDictPage'
    
import AliIcon from '../../component/AliIcon'



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

export default class TestEnTranPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            task:{curIndex:0, taskWords:[]},
            isDetailModalOpen:false,
            isWrongModalOpen:false,
            selectedIndex:-1,       //选择的下标
            selectedStatus:0,       //选择的状态 [0:待选择，1:正确，2:错误]
            refresh:false
        }
        this.options=[]             //选项数组（存放单词下标）
        this.answerIndex=-1         //答案下标
    }

    componentDidMount(){
        this.taskDao = this.props.navigation.getParam('taskDao');
        this.VocaDao = this.props.navigation.getParam('vocaDao');
        this.taskOrder = this.props.navigation.getParam('taskOrder')

        let task = this.taskDao.getTask(this.taskOrder)
        //是否需要查询
        console.log(' data :'+task.dataCompleted)
        if(!task.dataCompleted){
            this.taskDao.modify(()=>{
                this.VocaDao.writeInfoToTask(task)
                task.dataCompleted = true
            })  
        }
        this._genOptions(task.curIndex, task.taskWords.length)  //第一次生成选项
        this.setState({task})
    }
    componentWillUnmount(){

    }

     //产生选项和答案
     _genOptions(curIndex, length){
    
        //判断错误
        if((typeof curIndex !== "number") || (typeof length !== "number")){
            throw new Error('参数类型错误，curIndex, length 应该是number')
        }
        //生成选项
        this.answerIndex = this._randomNum(0,3)                                     //产生一个随机下标
        this.options = this._randomArr(0, length-1, curIndex)       //3个选项
        this.options.splice(this.answerIndex, 0, curIndex)         
    }

    
    //生成一个minNum到maxMum间的随机数数组 (不出现指定数)
    _randomArr = (minNum, maxNum, num) => {
        //判断错误
        if((typeof minNum !== "number") || (typeof maxNum !== "number") || (typeof num !== "number")){
            throw new Error('参数类型错误，minNum, maxNum, num 应该是number')
        }
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
        if((typeof minNum !== "number") || (typeof maxNum !== "number") ){
            throw new Error('参数类型错误，minNum, maxNum 应该是number')
        }
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }


     //判断答案 isWrong: 返回是否选错
     _judgeAnswer(index){
        //index范围： [0,1,2,3,4],其中4是查看提示
        let isWrong = false
        if(index == 4){                         //查看提示
            this.setState({selectedIndex:index, selectedStatus:0})
        }else if(index == this.answerIndex){    //选择正确
            this.setState({selectedIndex:index, selectedStatus:1})
        }else{                                  //选择错误
            this.setState({selectedIndex:index, selectedStatus:2})
            isWrong = true
        }
        return isWrong
    }


    

    //创建单词详情modal, 
    _createDetailModal = (isWrong) =>{
        const {curIndex, taskWords} = this.state.task
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
                
                    <DetailDictPage 
                    vocaDao={this.VocaDao}
                    vocaGroupDao={null}
                    word={taskWords[curIndex]?taskWords[curIndex].word:''}
                    tran={taskWords[curIndex]?taskWords[curIndex].tran:''}
                    />
                
               
                <View style={styles.modalBottom }>
                    <TouchableNativeFeedback  >
                    <View style={[styles.modalBtn,{width:width/5}]}>
                            <Text style={{fontSize:16,color:'#404040'}}>Pass</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>{
                        
                        if(isWrong){
                            this._closeWrongModal()
                            this._nextWord()
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






    _nextWord = ()=>{
       
        let {task} = this.state
        if(task.curIndex >= task.taskWords.length-1){   //返回
            alert('学习完毕')
            this.taskDao.modify(()=>{
                // 完成卡片学习
                task.learnStatus = 'LEARN_FINISH'
                task.curIndex = 0
            })
            console.log(task)
            this.props.navigation.goBack()
        }else{                                       //跳到下一个单词         
              //当前词下标+1
            this.taskDao.modify(()=>{
                task.curIndex = task.curIndex+1
            })
            this.setState({selectedStatus:0})
            this._genOptions(task.curIndex, task.taskWords.length)
            
            
            
        }
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

    render() {
        console.log('dao:')
        console.log(this.VocaDao)
        console.log(this.taskDao)
        let {selectedStatus,selectedIndex,task} = this.state
        const {taskWords,curIndex } = task
        let curWord = taskWords[curIndex]
        let testWrongNum = 0
        let def = ''
        if(curWord){
            testWrongNum = curWord.testWrongNum
            def = curWord.def
        }

        //已选择
        let selected = (selectedStatus != 0);
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
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>{`${curIndex}/${taskWords.length}`}</Text> 
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
                                <Text style={{color:'#EC6760',fontSize:16,}}>{`答错${testWrongNum}次`}</Text>
                            </View>
                            <View style={{flex:1, backgroundColor:'#C0E5FF', padding:4, borderRadius:4, marginTop:5}}>
                                <Text style={styles.enFont}>{def}</Text>
                            </View>
                        </Row>
                        
                    </Grid>
                </Content>

                <Grid style={{padding:10}}>
                    {this.options.length!=0 &&
                        this.options.map((option, index)=>{
                           
                            return <Row key={index} style={styles.row}>
                                <Button block style={[
                                    styles.selectBtn, 
                                    index==this.answerIndex&&selected?{borderColor:'#1890FF'}:{}, 
                                    index==selectedIndex&&selectWrong?{borderColor:'#EC6760'}:{}]} onPress={()=>{
                                    if(this._judgeAnswer(index)){ //选择错误
                                        this._openWrongModal()
                                    }else{                      //选择正确
                                        this._nextWord();
                                    }
                                    
                                    
                                }}>
                                    <Text style={[
                                        styles.btnFont, 
                                        index==this.answerIndex&&selected?{color:'#1890FF'}:{},
                                        index==selectedIndex&&selectWrong?{color:'#EC6760'}:{}]}>{taskWords[option]?taskWords[option].word:''}</Text>
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
                {taskWords[curIndex] && this.VocaDao && this.taskDao &&
                    this._createDetailModal(false)
                }
                {taskWords[curIndex] && this.VocaDao && this.taskDao &&
                    this._createDetailModal(true)
                }
            </Container>
        );
    }
}


