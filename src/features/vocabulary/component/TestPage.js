import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,TouchableNativeFeedback,} from 'react-native';
import {Grid, Col, Row} from 'react-native-easy-grid'
import {Header,Button} from 'react-native-elements'
import * as Progress from 'react-native-progress';
import {NavigationActions, StackActions} from 'react-navigation'
import Modal from 'react-native-modalbox';
import {PropTypes} from 'prop-types';

import VocaTaskDao from '../service/VocaTaskDao';
import VocaDao from '../service/VocaDao'
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style'
import vocaUtil from '../common/vocaUtil'
import VocaCard from "./VocaCard";
import * as Constant from '../common/constant'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const StatusBarHeight = StatusBar.currentHeight;


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FEFEFE',
    },
    content:{
        padding:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        height:'35%'
    },
    phoneticView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    wordFont:{
        fontSize:30,
        color:'#202020',
        fontWeight:'600'
    },
    btnFont:{
        width:'90%',
        fontSize:16,
        color:'#202020',
    },
    selectBtn:{
        backgroundColor:'#EFEFEF',
        borderRadius:8,
    },
    modalBtn:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'#A0A0A0',
        borderRadius:2,
        
    },
})

export default class TestPage extends Component {

    constructor(props){
        super(props);
        this.taskDao = VocaTaskDao.getInstance()
        this.vocaDao = VocaDao.getInstance()

        this.state = {
            task:{ words:[]},
            showWordInfos:[],
            curIndex:0,
            isDetailModalOpen:false,
            isWrongModalOpen:false,
            selectedIndex:-1,       //选择的下标
            selectedStatus:0,       //选择的状态 [0:待选择，1:正确，2:错误]

            //倒计时
            leftTime:this.props.testTime,

            //第n轮测试
            isRetest:this.props.navigation.getParam('isRetest', false),
            //[true, ture, false, ...] 测试数组，用来实现二轮测试
            testArr:[],
            //当前测试个数
            leftCount:100,  
            //当前测试个数
            curCount:1,
        }
        this.options=[]             //选项数组（存放单词下标）
        this.answerIndex=-1         //答案下标
    }

    componentDidMount(){
        //加载任务、加载单词信息
        const {getParam} = this.props.navigation
        let task = getParam('task')
        console.log(task)
        if(!task){
            alert('getTask')
            const taskOrder = getParam('taskOrder')
            task = this.taskDao.getTaskByOrder(taskOrder)
        }
        const showWords = vocaUtil.getNotPassedWords(task.words)
        let showWordInfos = getParam('showWordInfos')
        if(!showWordInfos){
            showWordInfos = vocaUtil.getShowWordInfos(showWords)
        }

        //初始化 测试数组
        let wordCount = task.wordCount
        let curCount = this.state.curCount
        const testArr = []
        if(this.state.isRetest){ //重测
            wordCount = 0
            for(let w of showWords){
                if(w.testWrongNum > 0){
                    testArr.push(true)
                    wordCount++
                }else{
                    testArr.push(false)
                }
            }
            alert(wordCount)
        }else{ //1测
            for(let w of showWords){
                testArr.push(true)
            }
            curCount = task.curIndex+1
        }

        
        
        this._genOptions(task.curIndex, task.wordCount)  //第一次生成选项
        this.setState({task, showWordInfos, curIndex:task.curIndex, 
            testArr, leftCount:wordCount, curCount:curCount})
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
        this.setState({leftTime:this.props.testTime})
        this._countDown()
    }


     //产生选项和答案
     _genOptions = (curIndex, length)=>{
        //判断错误
        const r1 = typeof curIndex
        const r2 = typeof length
        if((r1 !== "number") || (r2 !== "number")){
            throw new Error(`参数类型错误，curIndex:${r1}; length:${r2}. curIndex, length 应该是number`)
        }
        //生成选项
        this.answerIndex = vocaUtil.randomNum(0,3)                 //产生一个随机下标
        this.options = vocaUtil.randomArr(0, length-1, curIndex)       //3个选项
        this.options.splice(this.answerIndex, 0, curIndex)         
    }

    //判断答案 isWrong: 返回是否选错
     _judgeAnswer(index){
        //index范围： [0,1,2,3,4],其中4是查看提示
        let isWrong = false
        if(index == 4){                         //查看提示
            this.setState({selectedIndex:index, selectedStatus:0})
        }else if(index == this.answerIndex){    //选择正确
            this._doRight(index)
        }else{                                  //选择错误
            //修改realm数据库
            this._doWrong(index)
            isWrong = true
        }
        return isWrong
    }
    _doRight = (index)=>{
        const curIndex = this.state.curIndex
        const words = vocaUtil.getNotPassedWords(this.state.task.words)
        if(words[curIndex].testWrongNum > 0){
            words[curIndex].testWrongNum = words[curIndex].testWrongNum - 1
        }
        const testArr = [...this.state.testArr]
        testArr[this.state.curIndex] = false
        this.setState({selectedIndex:index, selectedStatus:1, testArr:testArr})
    }
    _doWrong = (index)=>{
        const curIndex = this.state.curIndex
        const words = vocaUtil.getNotPassedWords(this.state.task.words)
        words[curIndex].wrongNum = words[curIndex].wrongNum + 1
        words[curIndex].testWrongNum = words[curIndex].testWrongNum + 1
        const testArr = [...this.state.testArr]
        testArr[curIndex] = true
        this.setState({selectedIndex:index, selectedStatus:2, testArr:testArr})
    }

    // 测试下一个单词
    _nextWord = ()=>{
        const {wordCount} = this.state.task
        let {curIndex, isRetest, leftCount, curCount} = this.state
        let nextIndex = curIndex+1
        curCount++
        let isQuit = false
        let  newTask = null

        if(!isRetest){   
            const routeName = this.props.navigation.getParam('nextRouteName')

            let process = null
            if(this.state.task.process.startsWith('IN_LEARN')){
                process = Constant.IN_LEARN_RETEST_1
                if(routeName === 'Home'){
                    process = Constant.IN_LEARN_RETEST_2
                }
            }else if(this.state.task.process.startsWith('IN_REVIEW')){
                if(routeName === 'Home'){
                    process = Constant.IN_REVIEW_RETEST
                }
            }
            // 是否进行二轮测试
            if(curIndex >= wordCount-1){
                if(this.state.testArr.includes(true)){
                    //继续测试
                    newTask = {...this.state.task,curIndex:0, process}
                    isRetest = true
                    nextIndex = 0
                    curCount = 1
                    while(!this.state.testArr[nextIndex]){
                        nextIndex++
                        if(nextIndex > wordCount-1){
                            //跳转
                            isQuit = true
                            break;
                        }
                    }
                    leftCount = vocaUtil.getLeftCount(this.state.testArr)
                }else{//结束
                    isQuit = true
                }
            }

        }else{          //循环    
            while(!this.state.testArr[nextIndex]){
                nextIndex++
                if(nextIndex > wordCount-1){
                    const firstIndex = this._getFirstIndex(this.state.testArr)
                    if(firstIndex !== null){ //还存在测试的单词
                        nextIndex = firstIndex
                        curCount = 1
                        leftCount = vocaUtil.getLeftCount(this.state.testArr)
                    }else{
                        //跳转
                        isQuit = true
                    }
                    break;
                }
            }
            
        }

        if(isQuit){ //完成测试，退出页面
            const routeName = this.props.navigation.getParam('nextRouteName')
            
            //拷贝task
            let process = null
            if(this.state.task.process.startsWith('IN_LEARN')){
                process = Constant.IN_LEARN_TEST_2
                if(routeName === 'Home'){
                    process = Constant.IN_LEARN_FINISH
                }
            }else if(this.state.task.process.startsWith('IN_REVIEW')){
                if(routeName === 'Home'){
                    process = Constant.IN_REVIEW_FINISH
                }
            }
            const task = {...this.state.task, curIndex:0, process}
            //testWrongNum置零
            for(let w of task.words){
                w.testWrongNum = 0
            }
            this.props.updateTask(task)
            //跳转
            const params = routeName==='Home'?{}:{
                task:task, 
                showWordInfos:this.state.showWordInfos,
                nextRouteName:'Home'
            }
            vocaUtil.goPageWithoutStack(this.props.navigation, routeName, params)
        }else{     //测试下一词
            this._genOptions(nextIndex, wordCount)   
            const nextState = {
                curIndex:nextIndex, selectedStatus:0, isRetest:isRetest, leftCount:leftCount, curCount:curCount
            }
            if(newTask){
                nextState.task = newTask
            }
            this.setState(nextState)

        }
    }


    _getFirstIndex = (testArr)=>{
        let count = 0
        for(let v of testArr){
            if(v === true){
                return count
            }
            count++
        }
        return null
    }
     //创建单词详情modal, 
     _createDetailModal = (isAnswered) =>{
        let bgColor = '#EC6760'
        if(this.state.selectedStatus === 1){
            bgColor = '#1890FF'
        }
        
        // isAnswered=true，表示答题后的Modal；isAnswered=false,表示查看提示的Modal
        return <Modal style={gstyles.modal}
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
                {this.state.showWordInfos[this.state.curIndex] &&
                    <VocaCard wordInfo={this.state.showWordInfos[this.state.curIndex]}/>
                }
               {/* 底部 */}
                <View style={[gstyles.modalBottom ,gstyles.r_between]}>
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


    render() {
        const {selectedStatus,selectedIndex,task,showWordInfos,curIndex, leftCount, curCount} = this.state
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
                            this.props.updateTask({...task,curIndex:curIndex})
                            vocaUtil.goPageWithoutStack(this.props.navigation,'Home')
                        }}></AliIcon> }
                    
                    centerComponent={
                        <View style={gstyles.r_center}>
                            <Progress.Bar progress={curCount===undefined?1/100:curCount/leftCount} height={10} width={width-120} color='#FFE957' unfilledColor='#EFEFEF' borderWidth={0} >
                                <Text style={{fontSize:10, position:'absolute', left:(width-120)/2, top:-2,}}>{`${curCount}/${leftCount}`}</Text> 
                            </Progress.Bar>
                        </View>
                    }
                    containerStyle={{
                        backgroundColor: '#FCFCFC00',
                        borderBottomColor: '#FCFCFC00',
                    }}
                    />

                {/* 内容 */}
                {
                    this.props.renderContent(showWordInfos, curIndex, task)
                }

                <Grid style={{padding:10}}>
                    {this.options.length!=0 &&
                        this.options.map((option, index)=>{
                            let alignStyle = {textAlign:'center'}
                            let showText = ''
                            switch(this.props.type){
                                case Constant.WORD_TRAN:
                                case Constant.PRON_TRAN:
                                    const trans = showWordInfos[option]?showWordInfos[option].trans:''
                                    showText = vocaUtil.transToText(trans)
                                    alignStyle = {textAlign:'left'}
                                break;
                                case Constant.TRAN_WORD:
                                case Constant.SEN_WORD:
                                    showText = showWordInfos[option]?showWordInfos[option].word:''
                                break;
                                        

                                
                            }
                            return <Row key={index} style={gstyles.r_center}>
                                <Button  
                                    title={showText}
                                    titleStyle={[
                                        styles.btnFont, 
                                        alignStyle,
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

TestPage.propTypes = {
    mode:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    testTime:PropTypes.number
}

TestPage.defaultProps = {
    mode:'study',
    testTime:7
}