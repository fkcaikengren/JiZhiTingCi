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
import AudioFetch from '../service/AudioFetch'

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
        this.audioFetch = AudioFetch.getInstance()

        this.state = {
            task:{ words:[]},
            showWordInfos:[],
            curIndex:0,
            isDetailModalOpen:false,
            isAnsweredModalOpen:false,
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

            //显示答案
            showAnswer: false,
        }
        this.options=[]             //选项数组（存放单词下标）
        this.answerIndex=-1         //答案下标
        this.hasSeenDetail = false  //已经查看单词详情
        
        this.passedWords = []     //某一轮测试中pass的单词
        this.wordInfos = []     //task所有单词信息（包括passed）
    }

    componentDidMount(){
        //加载任务、加载单词信息
        const {getParam} = this.props.navigation
        let task = getParam('task')
       
        if(!task){
            alert('getTask')
            const taskOrder = getParam('taskOrder')
            task = this.taskDao.getTaskByOrder(taskOrder)
        }
        this.wordInfos =  this.vocaDao.getWordInfos(task.words.map((item, i)=>item.word))
        const showWords = vocaUtil.getNotPassedWords(task.words)
        let showWordInfos = getParam('showWordInfos')
        if(!showWordInfos){
            showWordInfos = vocaUtil.getShowWordInfos(showWords, this.wordInfos )
        }

        //初始化 测试数组
        let wordCount = task.wordCount
        let curCount = 0
        const testArr = []
        if(this.state.isRetest){ //重测
            let i = 0
            wordCount = 0
            for(let w of showWords){
                if(w.testWrongNum > 0){
                    testArr.push(true)
                    wordCount++
                    if(i <= task.curIndex){
                        curCount++
                    }
                }else{
                    testArr.push(false)
                }
                i++
            }
            
        }else{ //1测
            for(let w of showWords){
                if(w.testWrongNum > 0){
                    testArr.push(true)
                }else{
                    testArr.push(false)
                }
            }
            curCount = task.curIndex+1
        }

        
        
        this._genOptions(task.curIndex, this.wordInfos.length)  //第一次生成选项
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
                this.hasSeenDetail = true
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
        this.answerIndex = vocaUtil.randomNum(0,3)                  //产生一个随机下标
        this.options = vocaUtil.randomArr(0, length-1, curIndex)     //3个选项
        this.options.splice(this.answerIndex, 0, curIndex)          //插入正确答案      
    }

    //判断答案 isWrong: 返回是否选错
     _judgeAnswer(index){
        //index范围： [0,1,2,3,4],其中4是查看提示
        let isRight = false
        if(index == 4){                         //查看提示
            this.setState({selectedIndex:index, selectedStatus:0})
        }else if(index === this.answerIndex){    //选择正确
            this._doRight(index)
            isRight = true
        }else{                                  //选择错误
            this._doWrong(index)
        }
        return isRight
    }
    _doRight = (index)=>{
        const curIndex = this.state.curIndex
        const words = vocaUtil.getNotPassedWords(this.state.task.words)
        if(this.hasSeenDetail){ //看过答案，归为做错
            words[curIndex].wrongNum = words[curIndex].wrongNum + 1
            words[curIndex].testWrongNum = words[curIndex].testWrongNum + 1
        }else{
            if(words[curIndex].testWrongNum > 0){
                words[curIndex].testWrongNum = words[curIndex].testWrongNum - 1
            }
        }
        
        const testArr = [...this.state.testArr]
        testArr[this.state.curIndex] = this.hasSeenDetail?true:false //看过答案，归为做错
        this.setState({selectedIndex:index, selectedStatus:1, testArr:testArr})

        if(this.hasSeenDetail){
            this.hasSeenDetail = false
        }
    }
    _doWrong = (index)=>{
        const curIndex = this.state.curIndex
        const words = vocaUtil.getNotPassedWords(this.state.task.words)
        words[curIndex].wrongNum = words[curIndex].wrongNum + 1
        words[curIndex].testWrongNum = words[curIndex].testWrongNum + 1
        const testArr = [...this.state.testArr]
        testArr[curIndex] = true
        this.setState({selectedIndex:index, selectedStatus:2, testArr:testArr})

        if(this.hasSeenDetail){
            this.hasSeenDetail = false
        }
    }

    //统计pass数据,计算返回下一个状态
    _calculateNextStateByPassed = ()=>{
        const {task, showWordInfos, testArr} = this.state
        console.log('-----passed words----------')
        console.log(this.passedWords)
        if(this.passedWords.length > 0){
            //重计算task 、showWordInfos、testArr、 curIndex
            const newTestArr = []
            const newShowWordInfos = showWordInfos.filter((item, i)=>{
                if(this.passedWords.includes(item.word)){ //pass
                    return false
                }else{
                    newTestArr.push(testArr[i])
                    return true
                }
            })
            const newWords = task.words.map((w,i)=>{
                if(this.passedWords.includes(w.word)){ 
                    return {...w,passed:true}
                }else{
                    return w
                }
            })

            
            const wordCount = task.wordCount - this.passedWords.length
            const curIndex = this.state.curIndex - this.passedWords.length

            //清空this.passedWords 
            this.passedWords = []

            return {
                task:{...task, words:newWords, wordCount, curIndex},
                showWordInfos:newShowWordInfos,
                testArr:newTestArr, 
                curIndex:curIndex
            }
        }

        return {task, showWordInfos, testArr, curIndex:this.setState.curIndex} 
    }

    // 测试下一个单词
    _nextWord = ()=>{
        const {wordCount} = this.state.task
        const {curIndex} = this.state
        let { isRetest, leftCount, curCount} = this.state
        let nextIndex = curIndex+1
        let process = null
        curCount++
        let isQuit = false //退出
        let nextState = null
        
        // 重新计时
        this._reCountDown()

        if(!isRetest){   
            // 进行二轮测试
            if(curIndex >= wordCount-1){//出界
                nextState = this._calculateNextStateByPassed() //统计passed单词，计算下一个状态

                const routeName = this.props.navigation.getParam('nextRouteName')
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
                if(nextState.testArr.includes(true)){
                    //继续测试
                    isRetest = true
                    nextIndex = 0
                    curCount = 1
                    while(!nextState.testArr[nextIndex]){
                        nextIndex++
                        if(nextIndex > wordCount-1){//出界
                            //跳转
                            isQuit = true
                            break;
                        }
                    }
                    leftCount = vocaUtil.getLeftCount(nextState.testArr)
                }else{//结束
                    isQuit = true
                }
            }
            
        }else{          //循环    
            while(!this.state.testArr[nextIndex]){
                nextIndex++
                if(nextIndex > wordCount-1){//出界
                    nextState = this._calculateNextStateByPassed() //统计passed单词，计算下一个状态

                    const firstIndex = this._getFirstIndex(nextState.testArr)
                    if(firstIndex !== null){ //还存在测试的单词
                        nextIndex = firstIndex
                        curCount = 1
                        leftCount = vocaUtil.getLeftCount(nextState.testArr)
                    }else{
                        //跳转
                        isQuit = true
                    }
                    break;
                }
            }
            
        }

        if(isQuit){ //完成测试，退出页面
            if(!nextState){
                nextState = this._calculateNextStateByPassed() //统计passed单词，计算下一个状态
            }

            const routeName = this.props.navigation.getParam('nextRouteName')
            //拷贝task
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
            const task = {...nextState.task, curIndex:0, process}
            //testWrongNum置零
            for(let w of task.words){
                w.testWrongNum = 0
            }
            console.log('-------测试完成退出----拷贝task到home-------')
            console.log(task)
            this.props.updateTask(task)
            //跳转
            const params = routeName==='Home'?{}:{
                task:task, 
                showWordInfos:this.state.showWordInfos,
                nextRouteName:'Home'
            }
            vocaUtil.goPageWithoutStack(this.props.navigation, routeName, params)
            this.audioFetch.releaseSound()
        }else{     //测试下一词

            this._genOptions(nextIndex, this.wordInfos.length)   
            const newState = {
                ...nextState,
                curIndex:nextIndex, 
                selectedStatus:0, 
                isRetest:isRetest, 
                leftCount:leftCount, 
                curCount:curCount, 
                showAnswer:false
            }
            if(process){
                newState.task.process = process
            }
            this.setState(newState)

        }
    }


    //查询testArr的第一个true下标
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
        const bgColor = '#EC6760'
        const isNewLearn = (this.state.task.status === Constant.STATUS_0)
        const {showWordInfos, curIndex, isAnsweredModalOpen, isDetailModalOpen} = this.state
        // isAnswered=true，表示答题后的Modal；isAnswered=false,表示查看提示的Modal
        return <Modal style={gstyles.modal}
                isOpen={isAnswered?this.state.isAnsweredModalOpen : this.state.isDetailModalOpen} 
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
                {showWordInfos[curIndex] &&
                    <VocaCard wordInfo={showWordInfos[curIndex]}/>
                }
               {/* 底部 */}
                <View style={[gstyles.modalBottom ,gstyles.r_between]}>
                    {!isNewLearn &&
                        <Button 
                            title='Pass'
                            titleStyle={{color:'#FFF',fontSize:16}}
                            containerStyle={{flex:1, marginRight:20}}
                            buttonStyle={[styles.selectBtn,{backgroundColor:bgColor }]} 
                            onPress={()=>{
                                this._passWord(showWordInfos[curIndex].word)
                                if(isAnsweredModalOpen){
                                    this._closeAnsweredModal()
                                }else if(isDetailModalOpen){
                                    this._closeDetailModal()
                                }
                                this._nextWord()
                            }} //pass 
                        />
                    }
                    <Button 
                        title={`完成巩固，继续做题`}
                        titleStyle={{color:'#FFF',fontSize:16}}
                        containerStyle={{flex:4}}
                        buttonStyle={[styles.selectBtn,{backgroundColor:bgColor}]} 
                        onPress={()=>{
                            if(isAnswered){ //答题后
                                this._closeAnsweredModal()
                                this._nextWord()
                            }else{      //查看提示或超时
                                this._closeDetailModal()
                                this._reCountDown()
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
        console.log('_closeDetailModal')
        this.setState({isDetailModalOpen: false});
    }
    _openAnsweredModal = ()=>{
        this._stopCountDown()
        this.setState({isAnsweredModalOpen:true})
    }
    _closeAnsweredModal = ()=>{
        console.log('_closeAnsweredModal')
        this.setState({isAnsweredModalOpen: false});
    }

    //pass单词
    _passWord = (word)=>{
        const beforeCount = this.state.task.wordCount
        const task = this.state.task
        const showWordInfos = this.state.showWordInfos

        //修改passed, wordCount, 保存到realm数据库
        const passedWord = vocaUtil.passWordInTask(task.words,word,task.taskOrder, beforeCount, showWordInfos,false)
        
        //存储pass的单词下标
        this.passedWords.push(passedWord)
        // 在重测、返回、结束时用pass的数据对state进行修改
    }

    render() {
        const {selectedStatus,selectedIndex,task,showWordInfos,curIndex, leftCount, curCount} = this.state
        //是否是新学
        const isNewLearn = (task.status === Constant.STATUS_0)
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
                            this._calculateNextStateByPassed() //计算pass的单词
                            this.props.updateTask({...task,curIndex:curIndex})
                            vocaUtil.goPageWithoutStack(this.props.navigation,'Home')
                            this.audioFetch.releaseSound()
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
                    this.props.renderContent(this.state)
                }

                <Grid style={{padding:10}}>
                    {this.options.length!=0 &&
                        this.options.map((option, index)=>{
                            let showText = ''
                            let optionIsAnswer = (curIndex === option)
                            let alignStyle = {textAlign:'center'}
                            switch(this.props.type){
                                case Constant.WORD_TRAN:
                                case Constant.PRON_TRAN:
                                    const trans = optionIsAnswer?
                                        (showWordInfos[option]?showWordInfos[option].trans:'')
                                        :(this.wordInfos[option]?this.wordInfos[option].trans:'')
                                    showText = vocaUtil.transToText(trans)
                                    alignStyle = {textAlign:'left'}
                                break;
                                case Constant.TRAN_WORD:
                                case Constant.SEN_WORD:
                                    showText = optionIsAnswer?
                                        (showWordInfos[option]?showWordInfos[option].word:'')
                                        :(this.wordInfos[option]?this.wordInfos[option].word:'')
                                break;
                                        
                            }
                            // 选项
                            return <Row key={index} style={gstyles.r_center}>
                                <Button  
                                    title={showText}
                                    titleStyle={[
                                    {
                                        width:'90%',
                                        fontSize:16,
                                        color:this.state.showAnswer?'#555':'#202020'
                                    },
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
                                    onPress={this.state.showAnswer?null:()=>{
                                        if(this._judgeAnswer(index)){ //答对
                                            this._stopCountDown()       //停止计时
                                            this.setState({showAnswer:true}) //显示答案
                                            let url = null
                                            if(this.props.playType === "sentence"){ 
                                                url = showWordInfos[curIndex].sen_pron_url
                                            }else{
                                                url = showWordInfos[curIndex].am_pron_url
                                            }
                                            this.audioFetch.playSound(url, null, ()=>{
                                                this._nextWord()
                                            }, ()=>{
                                                this._nextWord()
                                            })
                                        }else{                        //答错
                                            this._openAnsweredModal()
                                        }
                                        
                                }}/>
                        </Row>
                        })
                    }
                    
                    
                    <Row style={gstyles.r_between}>
                        {!isNewLearn &&
                            <Button 
                                disabled={this.state.showAnswer}
                                title='Pass'
                                titleStyle={{color:'#F2753F',fontSize:16}}
                                containerStyle={{flex:1, marginRight:20}}
                                buttonStyle={[styles.selectBtn,{backgroundColor:'#FFE957', }]} 
                                onPress={()=>{
                                    this._passWord(showWordInfos[curIndex].word)
                                    this._nextWord()
                                }} //pass
                            />
                        }
                        <Button 
                            disabled={this.state.showAnswer}
                            title={`${this.state.leftTime}s  想不起来了，查看提示`}
                            titleStyle={{color:'#F2753F',fontSize:16}}
                            containerStyle={{flex:4}}
                            buttonStyle={[styles.selectBtn,{backgroundColor:'#FFE957'}]} 
                            onPress={()=>{
                                this.hasSeenDetail = true
                                this._openDetailModal()
                            }}
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
    playType:PropTypes.string,  //回答正确的音频播放类型
    testTime:PropTypes.number,  //测试实现
    renderContent: PropTypes.func, //题目内容
}

TestPage.defaultProps = {
    mode: 'study',
    playType: 'word',
    testTime: 30,
    renderContent: (state)=>null,
}