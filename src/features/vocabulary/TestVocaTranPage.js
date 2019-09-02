import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,TouchableNativeFeedback,} from 'react-native';
import {Grid, Col, Row} from 'react-native-easy-grid'
import {Header,Button} from 'react-native-elements'
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux'
import {NavigationActions, StackActions} from 'react-navigation'
import Modal from 'react-native-modalbox';

    
import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao'
import AliIcon from '../../component/AliIcon'
import styles from './TestVocaTranStyle'
import gstyles from '../../style'
import vocaUtil from './common/vocaUtil'
import VocaCard from "./component/VocaCard";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const StatusBarHeight = StatusBar.currentHeight;

class TestVocaTranPage extends Component {

    constructor(props){
        super(props);
        this.taskDao = VocaTaskDao.getInstance()
        this.vocaDao = VocaDao.getInstance()

        this.state = {
            task:{ words:[]},
            curIndex:0,
            wordInfos:[],
            isDetailModalOpen:false,
            isWrongModalOpen:false,
            selectedIndex:-1,       //选择的下标
            selectedStatus:0,       //选择的状态 [0:待选择，1:正确，2:错误]

            //倒计时
            leftTime:7,
        }
        this.options=[]             //选项数组（存放单词下标）
        this.answerIndex=-1         //答案下标

        console.disableYellowBox=true
    }

    componentDidMount(){
        //加载任务、加载单词信息
        // const taskOrder = this.props.navigation.getParam('taskOrder')
        // this.props.navigation.getParam('task')
        // this.props.navigation.getParam('wordInfos')
        const taskOrder = 3
        const task = this.taskDao.getTaskByOrder(taskOrder)
        const wordInfos = this.vocaDao.getWordInfos(task.words.map((item,i)=>item.word))
        this._genOptions(this.state.curIndex, task.words.length)  //第一次生成选项
        this.setState({task, wordInfos})
        this._countDown()
    }

    //开始倒计时
    _countDown = ()=>{
        this.countTimer = setInterval(()=>{
            //改变状态
            const leftTime = this.state.leftTime-1
            if(leftTime >= 0){
                this.setState({leftTime})
            }else{
                //清理
                clearInterval(this.countTimer)
                this._openDetailModal()
            }
            
        },1000)
    }

    //停止计时
    _stopCountDown = ()=>{
        if(this.countTimer){
            clearInterval(this.countTimer)
        }
    }

    //重新开始计时
    _reCountDown = ()=>{
        if(this.countTimer){
            clearInterval(this.countTimer)
        }
        this.setState({leftTime:7})
        this._countDown()
    }


     //产生选项和答案
     _genOptions = (curIndex, length)=>{
        //判断错误
        if((typeof curIndex !== "number") || (typeof length !== "number")){
            throw new Error('参数类型错误，curIndex, length 应该是number')
        }
        //生成选项
        this.answerIndex = vocaUtil.randomNum(0,3)                 //产生一个随机下标
        this.options = vocaUtil.randomArr(0, length-1, curIndex)       //3个选项
        this.options.splice(this.answerIndex, 0, curIndex)         
    }

    //  //判断答案 isWrong: 返回是否选错
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
    _createDetailModal = (isAnswered) =>{
        let bgColor = '#EC6760'
        if(this.state.selectedStatus === 1){
            bgColor = '#1890FF'
        }
        
        // isAnswered=true，表示答题后的Modal；isAnswered=false,表示查看提示的Modal
        return <Modal style={styles.modal}
                isOpen={isAnswered?this.state.isWrongModalOpen : this.state.isDetailModalOpen} 
                onClosed={isAnswered?this._closeAnsweredModal:this._closeDetailModal}
                onOpened={isAnswered?this._openAnsweredModal:this._openDetailModal}
                backdrop={true} 
                backdropPressToClose={false}
                swipeToClose={false}
                position={"bottom"} 
                ref={ref => {
                    this.detailModal = ref
                }}>
                {/* 主体 */}
                {this.state.wordInfos[this.state.curIndex] &&
                    <VocaCard wordInfo={this.state.wordInfos[this.state.curIndex]}/>
                }
               {/* 底部 */}
                <View style={[styles.modalBottom ,gstyles.r_between]}>
                    <Button 
                        title='Pass'
                        titleStyle={{color:'#FFF',fontSize:16}}
                        containerStyle={{width:'25%'}}
                        buttonStyle={[styles.selectBtn,{backgroundColor:bgColor }]} 
                        // onPress={} //pass
                    />
                    <Button 
                        title={`完成巩固，继续做题`}
                        titleStyle={{color:'#FFF',fontSize:16}}
                        containerStyle={{ width:'70%'}}
                        buttonStyle={[styles.selectBtn,{backgroundColor:bgColor}]} 
                        onPress={()=>{
                            if(isAnswered){ //答题后
                                this._closeAnsweredModal()
                                this._nextWord()
                            }else{      //查看提示
                                this._closeDetailModal()
                            }
                        }}
                    />
                </View>
        </Modal>
    }
     //打开单词详情页
    _openDetailModal = ()=>{
        this._stopCountDown()
        this.setState({isDetailModalOpen:true})
    }
    _closeDetailModal = ()=>{
        this._reCountDown()
        this.setState({isDetailModalOpen: false});
    }
    _openAnsweredModal = ()=>{
        this._stopCountDown()
        this.setState({isWrongModalOpen:true})
    }
    _closeAnsweredModal = ()=>{
        this._reCountDown()
        this.setState({isWrongModalOpen: false});
    }






    _nextWord = ()=>{
       
        let {task} = this.state
        if(this.state.curIndex >= task.words.length-1){   //返回
            alert('学习完毕')
            // 完成卡片学习
            task.learnStatus = 'LEARN_FINISH'
            this.state.curIndex = 0
            this.props.navigation.goBack()
        }else{                                       //跳到下一个单词      
            this._genOptions(this.state.curIndex+1, task.words.length)   
              //当前词下标+1
            this.setState({curIndex:this.state.curIndex+1, selectedStatus:0})
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
        let {selectedStatus,selectedIndex,task,wordInfos,curIndex} = this.state
        const {words } = task
        const testWrongNum = words[curIndex]?words[curIndex].testWrongNum:''
        const word = words[curIndex]?words[curIndex].word:''
        const phonetic = wordInfos[curIndex]?wordInfos[curIndex].am_phonetic:''
        //已选择
        let selected = (selectedStatus != 0);
        //选择失败
        let selectWrong = (selectedStatus==2 );

        
      
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} />
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content" // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color='#555' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon> }
                    
                    centerComponent={
                        <View style={gstyles.r_center}>
                            <Progress.Bar progress={curIndex===0?0:curIndex/task.wordCount} height={10} width={width-120} color='#FFE957' unfilledColor='#EFEFEF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>{`${curIndex}/${task.wordCount}`}</Text> 
                            </Progress.Bar>
                        </View>
                    }
                    containerStyle={{
                        backgroundColor: '#FCFCFC00',
                        borderBottomColor: '#FCFCFC00',
                    }}
                    />

                {/* 内容 */}
                <View  style={styles.content}>
                    <View style={{}}>
                        <Text style={styles.wordFont}>{word}</Text>
                    </View>
                    <View style={styles.phoneticView}>
                        <Text>{'[美]'+phonetic}</Text>
                        <AliIcon name='shengyin' size={26} color='#555' style={{marginLeft:5}}/>
                        {/* <Text style={{color:'#EC6760',fontSize:16,}}>{`答错${testWrongNum}次`}</Text> */}
                    </View>
                </View>

                <Grid style={{padding:10}}>
                    {this.options.length!=0 &&
                        this.options.map((option, index)=>{
                            const trans = wordInfos[option]?wordInfos[option].trans:''
                            const translation = vocaUtil.transToText(trans)
                            return <Row key={index} style={gstyles.r_center}>
                                <Button  
                                    title={translation}
                                    titleStyle={[
                                        styles.btnFont, 
                                        index==this.answerIndex&&selected?{color:'#1890FF'}:{},
                                        index==selectedIndex&&selectWrong?{color:'#EC6760'}:{}
                                    ]}
                                    titleProps={{numberOfLines:1}}
                                    containerStyle={[
                                        {width:'100%'},
                                        index==this.answerIndex&&selected?{borderColor:'#1890FF'}:{}, 
                                        index==selectedIndex&&selectWrong?{borderColor:'#EC6760'}:{}
                                    ]} 
                                    buttonStyle={[
                                        styles.selectBtn,
                                    ]}
                                    onPress={()=>{
                                        this._judgeAnswer(index)
                                        this._openAnsweredModal()
                                }}/>
                        </Row>
                        })
                    }
                    
                    
                    <Row style={gstyles.r_between}>
                        <Button 
                            title='Pass'
                            titleStyle={{color:'#F2753F',fontSize:16}}
                            containerStyle={{width:'25%'}}
                            buttonStyle={[styles.selectBtn,{backgroundColor:'#FFE957', }]} 
                            // onPress={} //pass
                        />
                        <Button 
                            title={`${this.state.leftTime}s  想不起来了，查看提示`}
                            titleStyle={{color:'#F2753F',fontSize:16}}
                            containerStyle={{ width:'70%'}}
                            buttonStyle={[styles.selectBtn,{backgroundColor:'#FFE957'}]} 
                            onPress={this._openDetailModal}
                        />
                    </Row>
                </Grid>
                {
                    this._createDetailModal(false)
                }
                {
                    this._createDetailModal(true)
                }
            </View>
        );
    }
}


const mapStateToProps = state=>({

})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(TestVocaTranPage)