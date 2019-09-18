import React, {Component} from 'react';
import {Platform, StatusBar, View, Text, FlatList, TouchableOpacity,
    Easing } from 'react-native';
import {WhiteSpace} from '@ant-design/react-native'
import {Header, Button} from 'react-native-elements'
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast'
import {PropTypes} from 'prop-types'
import Modal from 'react-native-modalbox';
import BackgroundTask from 'react-native-background-task'
import BackgroundTimer from 'react-native-background-timer';

import VocaCard from './component/VocaCard'
import SwipeableFlatList from '../../component/SwipeableFlatList'
import * as Constant from './common/constant'
import * as homeAction from './redux/action/homeAction'
import * as vocaPlayAction from './redux/action/vocaPlayAction';
import AliIcon from '../../component/AliIcon';
import styles from './VocaPlayStyle'
import PlayController from './component/PlayController';
import StudyPlayController from './component/StudyPlayController'
import VocaUtil from './common/vocaUtil'
import gstyles from '../../style'
import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao';
import AudioFetch from './service/AudioFetch'
import VocaPlayService from './service/VocaPlayService'
import NotificationManage from '../../modules/NotificationManage'
import {PlaySoundJob} from './service/BackgroundJobService'


const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

BackgroundTask.define(() => {
    //测试： 设置一个定时器，判断后台是否继续运行
    console.log('....................后台任务......................')
    setInterval(()=>{
        console.log('-----定时器调用....-------')
    },2000)
    BackgroundTask.finish()
  })



class VocaPlayPage extends React.Component {

    static propTypes = {
        task: PropTypes.object,
    }

    constructor(props){
        super(props);

        this.taskDao = VocaTaskDao.getInstance()
        this.vocaDao = VocaDao.getInstance()
        this.audioFetch = AudioFetch.getInstance()
        
        //当前模式
        this.mode = this.props.navigation.getParam('mode', Constant.NORMAL_PLAY)
        this.isStudyMode = false
        if(this.mode !== Constant.NORMAL_PLAY){  //新学和复习统称学习模式
            this.isStudyMode = true
        }
        this.finishedTimes = 0

        //播放服务
        this.vocaPlayService = VocaPlayService.getInstance()
        this.vocaPlayService.changeCurIndex = this._changeCurIndex
        this.vocaPlayService.changePlayTimer = this._changePlayTimer
        this.vocaPlayService.finishQuit = this.isStudyMode?this._finishQuit:null

        //状态
        const studyState =  this.isStudyMode? {
            task:{
                words:[]
            },
            showWordInfos:[],
            curIndex:0,
            autoPlayTimer:0,
            interval:2.0,
            showWord:true,
            showTran:true,
        }:{}
        this.state = {
            //学习模式特有状态
            ...studyState,
            //公共状态
            isTasksModalOpened:false,
            isVocaModalOpen : false,
            clickIndex : null,
        }

        this.vocaPlayService.stateRef = this.isStudyMode?this.state:null
        console.disableYellowBox = true
        
    }

    //自定义改变状态函数
    changeState = (state)=>{
        this.vocaPlayService.setStateRef(state)
        this.setState(state)
    }
  
    
    componentDidMount(){
     

        //判断是否自动播放，task是从navigation中获取，一定存在curIndex
        if(this.isStudyMode){
            //加载task 和word
            const task = this.props.navigation.getParam('task')
            const showWordInfos = VocaUtil.getShowWordInfos(task.words)

            this.totalTimes = this.mode===Constant.LEARN_PLAY?Constant.LEARN_PLAY_TIMES:Constant.REVIEW_PLAY_TIMES
            this.finishedTimes = task.leftTimes?this.totalTimes-task.leftTimes:0

            if(this.mode === Constant.LEARN_PLAY){
                if(this.finishedTimes <= 0 ){
                    this._toggleTran(false)
                }
                
            }else if(this.mode === Constant.REVIEW_PLAY){
                if(this.finishedTimes <= 0){
                    this._toggleWord(false)
                    this._toggleTran(false)
                }else if(this.finishedTimes <= 1){
                    this._toggleTran(false)
                }
            }

            //改变状态
            this.changeState({task,showWordInfos, curIndex:task.curIndex})
            console.log('---chagne state------')
            console.log(this.vocaPlayService.stateRef)

            // 1s后自动播放
            const timeoutId = BackgroundTimer.setTimeout(()=>{
                this.vocaPlayService.autoplay(task.curIndex)
            },1000);
        }

    }

    componentDidUpdate(prevProps, prevState) {
        //如果播放状态变化
        if(this.isStudyMode){
            if(prevProps.vocaPlay.autoPlayTimer !== this.props.vocaPlay.autoPlayTimer) {
                this.vocaPlayService.listRef.closePassBtn()
            }
        }
    }

    componentWillUnmount(){ //退出界面
        if(this.isStudyMode){  
            this._quitLearn();
        }
    }


    // 改变下标，更新单词
    _changeCurIndex = (curIndex)=>{
        if(this.isStudyMode){
            const wordCount = this.state.task.wordCount
            let leftTimes = this.state.task.leftTimes
            let listenTimes = this.state.task.listenTimes
             //播放到最后一个单词
             if(this.state.curIndex+1 === wordCount){
                leftTimes--
                listenTimes++
            }
            this.changeState({
                task:{...this.state.task, curIndex:curIndex, leftTimes, listenTimes},
                curIndex:curIndex
            })
        }else{
            this.props.changeCurIndex(curIndex)
        }
    }
    // 控制翻译显示
    _toggleTran = (showTran=null)=>{
        if(this.isStudyMode){
            showTran === null?this.changeState({showTran:!this.state.showTran})
                :this.changeState({showTran})
        }else{
            this.props.toggleTran(showTran)
        }
        
       
    }

    // 控制单词显示
    _toggleWord = (showWord=null)=>{
        if(this.isStudyMode){
            showWord === null?this.changeState({showWord:!this.state.showWord})
                :this.changeState({showWord})
        }else{
            this.props.toggleWord(showWord)
        }
    }

    // 暂停、播放
    _changePlayTimer = (autoPlayTimer)=>{
        if(this.isStudyMode){
            console.log('-------change autoPlayTimer--------'+autoPlayTimer)
            this.changeState({autoPlayTimer})
        }else{
            this.props.changePlayTimer(autoPlayTimer)
        }
    }

    // 控制时间间隔
    _changeInterval = (interval)=>{
        if(this.isStudyMode){
            this.changeState({interval})
        }else{
            this.props.changeInterval(interval)
        }
    }

    // pass单词
    _passWord = (word)=>{
        if(this.isStudyMode){
            const beforeCount = this.state.task.wordCount
            let index = this.state.curIndex
            const task = this.state.task
            const showWordInfos = this.state.showWordInfos

            //修改passed, wordCount, 保存到realm数据库
            const res = VocaUtil.passWordInTask(task.words,word,task.taskOrder, beforeCount, showWordInfos)
            
            //pass最后一个单词，修改下标
            if(index+1 === beforeCount){
                index = 0
            }

            this.changeState({ 
                task:{...task, words:res.words, wordCount:beforeCount-1,curIndex:index,}, 
                curIndex:index,
                showWordInfos:res.showWordInfos
            })
        }else{
            this.props.passWord(word)
        }
        
        
    }

    //退出页面（学习模式下）
    _quitLearn(){
        const { autoPlayTimer} = this.state
        //停止播放
        if(this.isStudyMode && autoPlayTimer){
            console.log('---清理--'+autoPlayTimer)
            clearTimeout(autoPlayTimer);
            this.vocaPlayService.setStateRef({autoPlayTimer:0})
        }
    }

    /** 完成学习，退出页面 */
    _finishQuit = ()=>{

        //学习模式下：完成播放，退出
        const {task, autoPlayTimer} = this.state
        if(this.isStudyMode && task.leftTimes <= 0){

            // console.log('---清理--'+autoPlayTimer)
            // clearTimeout(autoPlayTimer);
            // this.vocaPlayService.setStateRef({autoPlayTimer:0})


            const routeName = this.props.navigation.getParam('nextRouteName')
            let nextRouteName = null
            //改变任务进度
            const finalTask = {...task, curIndex:0}
            let otherParams = null
            if(task.status === Constant.STATUS_0){
                //跳转到卡片学习页面
                nextRouteName='TestVocaTran'
                finalTask.process='IN_LEARN_CARD'
                otherParams = {
                    showAll:false, 
                    playWord: true,      //用于LearCard,自动播放单词
                    playSentence: true  //用于LearCard,自动播放例句
                }
            }else{
                //跳转到测试页面
                nextRouteName='Home'
                finalTask.process='IN_REVIEW_TEST'
            }
            // 拷贝给home
            this.props.updateTask(finalTask)
            console.log(routeName)
            // 抹掉stack，跳转
            VocaUtil.goPageWithoutStack(this.props.navigation,routeName, {
                task:finalTask,
                showWordInfos:showWordInfos,
                nextRouteName:nextRouteName,
                ...otherParams
            })
            //结束
            return;
        }
    }


    //单词列表项
    _renderItem = ({item, index})=>{
        const isShowPassBtn = (this.mode !== Constant.LEARN_PLAY 
            && this.vocaPlayService.listRef 
            && this.vocaPlayService.listRef.getOpenedRowKey() === index)
        if(item){
            let {task,curIndex, showWord,showTran,themes, themeId} = this.props.vocaPlay
            if(this.isStudyMode){
                task = this.state.task
                curIndex = this.state.curIndex
                showWord = this.state.showWord
                showTran = this.state.showTran
            }
            //处理中文翻译
            const translation = VocaUtil.transToText(item.trans)
            //主题
            const Theme = themes[themeId]
            //字幕的样式
            let playEnStyle = {}
            let playZhStyle = {}


            if(curIndex == index){
                console.log(`curIndex: ${curIndex}`)
                playEnStyle = {
                    fontSize:20,
                    color:Theme.playColor
                };
                playZhStyle = {
                    fontSize:14,
                    color:Theme.playColor
                };
            }


            return (
                <View style={[{width:'100%'}, gstyles.r_center]}>
                    <View style={{flex:1}}></View>
                    
                        <View style={{flex:4}}>
                            <TouchableOpacity onPress={()=>{
                                this.setState({clickIndex:index})
                                //弹框
                                this._openVocaModal()
                            }}>
                                <View style={styles.item}>
                                    <Text style={[styles.itemEnText,playEnStyle]}>{showWord?item.word:''}</Text>
                                    <Text note numberOfLines={1} style={[styles.itemZhText,playZhStyle]}>
                                        {showTran?translation:''}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    <View style={{flex:1}}>
                        {isShowPassBtn &&
                            <Button
                                title='Pass'
                                titleStyle={{color:'#FFF',fontSize:14,fontWeight:'400'}}
                                buttonStyle={{backgroundColor:'#F2753F',height:30,marginLeft:5,}}
                                onPress={()=>{
                                    //关闭侧滑
                                    this.vocaPlayService.listRef.closePassBtn()
                                    if(task.wordCount <= 3){
                                        this.refs.toastRef.show('只剩5个了，不能再pass了哦')
                                    }else{
                                        this._passWord(item.word)
                                    }
                                }}
                            />
                        }
                    </View>
                </View>
                
            );
        }else{
            return null
        }
    };


    _keyExtractor = (item, index) => index;
    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 

    _onOpen = (key)=>{
        //暂停
        const {vocaPlay} = this.props
        if(this.isStudyMode){
            if(this.state.autoPlayTimer){
                BackgroundTimer.clearTimeout(autoPlayTimer);
                this._changePlayTimer(0);
            }
        }else{
            if(vocaPlay.autoPlayTimer){
                BackgroundTimer.clearTimeout(vocaPlay.autoPlayTimer);
                this._changePlayTimer(0);
            }
        }
    }

    // 渲染任务列表
    _renderTaskItem = ({item, index})=>{
        const {autoPlayTimer} = this.props.vocaPlay
        const { loadTask} = this.props
        let name = VocaUtil.genTaskName(item.taskOrder)
        const listenTimes = item.listenTimes
        const wrongAvg = VocaUtil.calculateWrongAvg(item.words)
        let dotColor = ''
        if(wrongAvg < 1){ 
            dotColor = '#1890FF'
        }else if(wrongAvg > 2){
            dotColor = '#F2753F'
        }else{
            dotColor = '#FFE957'
        }
        // 播放新的任务
        return <TouchableOpacity  onPress={()=>{
            if(autoPlayTimer){ 
                BackgroundTimer.clearTimeout(autoPlayTimer);
                this._changePlayTimer(0);
            }
            //数据库加载任务
            const task = this.taskDao.getTaskByOrder(item.taskOrder)
            const showWordInfos = VocaUtil.getShowWordInfos(task.words)
            loadTask(task, showWordInfos)
            //顺序执行的缘故，_autoplay里面的wordCount无法立即刷新
            this.vocaPlayService.autoplay(0)
            // NotificationManage.play((e)=>{
            //     console.log(e)
            // },()=>null);
        }}>
            <View style={styles.taskItem}>
                <View style={gstyles.r_start}>
                    <View style={[gstyles.c_center, {marginRight:10}]}>
                        <Text style={gstyles.serialText}>{index<9?'0'+(index+1):(index+1)}</Text>
                        <View style={[styles.WrongAvgDot,{backgroundColor:dotColor}]} />
                    </View>
                    <View style={styles.nameView}>
                        <Text style={styles.nameText}>{`List-${name}`}</Text>
                        <Text style={[styles.noteText]}>{`共${item.wordCount}词，已听${listenTimes}遍`}</Text>
                    </View>
                </View>
                <FontAwesome name="play-circle" size={24} color="#999" style={{marginRight:10}}/>
            </View>
        </TouchableOpacity>
    }
    // 关闭任务列表
    _closeTaskListModal = ()=>{
        this.setState({isTasksModalOpened:false})
    }
    //打开任务列表
    _openTaskListModal = ()=>{
        this.setState({isTasksModalOpened:true})
    }
    // 创建任务列表
    _createTaskListModal = () =>{
        // 获取任务列表数据
        const {isTasksModalOpened} = this.state
        return <ModalBox style={[styles.tasksModal]}
            isOpen={isTasksModalOpened} 
            onClosed={this._closeTaskListModal}
            onOpened={this._openTaskListModal}
            backdrop={true} 
            backdropPressToClose={true}
            swipeToClose={false}
            position={"bottom"} 
            easing={Easing.elastic(0.2)}
            ref={ref => {
                this.taskListRef = ref
            }}>
            <View style={[gstyles.c_start, {width:'100%'}]}>
                <View style={[styles.modalHeader,gstyles.r_center]}>
                    <Text>四级词汇</Text>
                </View>
                <View style={{height:40}}>
                </View>
                <FlatList
                    style={{width:'100%'}}
                    //数据源
                    data={this.taskDao.getLearnedTasks()}
                    //渲染列表数据
                    renderItem={this._renderTaskItem}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={<View style={{width:'100%',height:50,backgroundColor:'#FFF'}}></View>}
                />
            </View>
        </ModalBox>
    }

    _openVocaModal = ()=>{
        //暂停
        const {vocaPlay} = this.props
        if(this.isStudyMode){
            if(this.state.autoPlayTimer){
                BackgroundTimer.clearTimeout(this.state.autoPlayTimer);
                this._changePlayTimer(0);
            }
        }else{
            if(vocaPlay.autoPlayTimer){
                BackgroundTimer.clearTimeout(vocaPlay.autoPlayTimer);
                this._changePlayTimer(0);
            }
        }
        this.setState({isVocaModalOpen:true}) //显示
    }
    _closeVocaModal = ()=>{
        this.setState({isVocaModalOpen:false}) //隐藏
    }
    //单词详情modal
    _createVocaModal = ()=>{
        let showWordInfos = this.isStudyMode?this.state.showWordInfos:this.props.vocaPlay.showWordInfos
        // isAnswered=true，表示答题后的Modal；isAnswered=false,表示查看提示的Modal
        return <Modal style={gstyles.modal}
                isOpen={this.state.isVocaModalOpen} 
                onClosed={this._closeVocaModal}
                onOpened={this._openVocaModal}
                backdrop={true} 
                backdropPressToClose={false}
                swipeToClose={false}
                position={"bottom"} 
                ref={ref => {
                    this.vocaModal = ref
                }}>
                {/* 主体 */}
                {this.state.clickIndex!==null && showWordInfos[this.state.clickIndex] &&
                    <VocaCard wordInfo={showWordInfos[this.state.clickIndex]}/>
                }
                {/* 底部 */}
                <View style={[gstyles.modalBottom ,gstyles.r_end]}>
                    <AliIcon name='guanbi' size={40} color='#FFE957' onPress={()=>{
                        this._closeVocaModal()
                    }}/>
                </View>
        </Modal>
    }

    _renderController = ()=>{
        if(this.isStudyMode){
            return <StudyPlayController  {...this.props} 
                toastRef = {this.refs.toastRef}
                playState = {this.state}
                mode = {this.mode}
                autoplay={this.vocaPlayService.autoplay} 
                finishedTimes={this.finishedTimes}
                changePlayTimer={this._changePlayTimer}
                changeInterval={this._changeInterval}
                toggleWord={this._toggleWord}
                toggleTran={this._toggleTran}
                />
        }else{
            return <PlayController {...this.props} autoplay={this.vocaPlayService.autoplay} 
                openTaskListModal={this._openTaskListModal}  />
        }
    }

    _renderList = ()=>{
        let {task, showWordInfos} = this.props.vocaPlay
        if(this.isStudyMode){
            task = this.state.task
            showWordInfos = this.state.showWordInfos
        }
        const flatListProps = {
            ref: comp => {
                this.vocaPlayService.listRef = comp;
            },
            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,
            extraData: this.isStudyMode?this.state:this.props.vocaPlay,      //促使FlatList刷新  
            keyExtractor: this._keyExtractor,
            data:showWordInfos,
            renderItem: this._renderItem,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,

        }
        if(this.mode === Constant.LEARN_PLAY){
            return <FlatList   {...flatListProps} />
        }else{
            if(task.taskOrder){
                return <SwipeableFlatList 
                    {...flatListProps}
                    bounceFirstRowOnMount={false}
                    onOpen={this._onOpen}
                    renderQuickActions={(data)=>true}
                    maxSwipeDistance={50}
                />
            }
        }
        
    }
    render(){

        let {task, themeId, themes} = this.props.vocaPlay;
        if(this.isStudyMode){
            task = this.state.task
            showWordInfos = this.state.showWordInfos
        }
        const Theme = themes[themeId]

        const name = VocaUtil.genTaskName(task.taskOrder)
        this.totalTimes = this.mode===Constant.LEARN_PLAY?Constant.LEARN_PLAY_TIMES:Constant.REVIEW_PLAY_TIMES
        this.finishedTimes = task.leftTimes?this.totalTimes-task.leftTimes:0
       
        const contentHeight = this.isStudyMode?height-STATUSBAR_HEIGHT-200:height-STATUSBAR_HEIGHT-240
        
        return(
        <LinearGradient 
        start={{x: 0.15, y: 0.15}} end={{x: 0.75, y: 0.75}}
        colors={Theme.bgColors} style={styles.container}>
            <StatusBar translucent={true} />
            <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={this.isStudyMode?null:
                    <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                
                centerComponent={<Text style={gstyles.pageTitle} >{task.taskOrder?`List-${name}`:'未选择'}</Text>}
                rightComponent={this.isStudyMode?
                    <Text style={gstyles.pageTitle}>{`${this.finishedTimes+1}/${this.totalTimes}`}</Text>:
                    null}
                containerStyle={{
                    backgroundColor: '#FCFCFC00',
                    borderBottomColor: '#FCFCFC00',
                }}
                />

            {/* 内容列表区 */}
            <WhiteSpace size='lg'/>
            <View style={ [styles.content, {height:contentHeight}]}>
                {
                    this._renderList()
                }
                
            </View>
            <Toast
                ref="toastRef"
                position='top'
                positionValue={120}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
            />
            {/* 底部播放控制区 */}
            {
                this._renderController()
            }
            {
                this._createTaskListModal()
            }
            {
                this._createVocaModal()
            }
        </LinearGradient>
        );
    }
}



const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    
    changePlayTimer : vocaPlayAction.changePlayTimer,
    changeCurIndex : vocaPlayAction.changeCurIndex,
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    changeInterval : vocaPlayAction.changeInterval,
    passWord : vocaPlayAction.passWord,

    loadTask : vocaPlayAction.loadTask,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,
    updateTask: homeAction.updateTask
};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);