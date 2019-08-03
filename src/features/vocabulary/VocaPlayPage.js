import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, View, Text, FlatList,
    TouchableWithoutFeedback, TouchableOpacity, Easing } from 'react-native';
import {WhiteSpace} from '@ant-design/react-native'
import {Header, Button} from 'react-native-elements'
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
// import {NavigationActions, StackActions} from 'react-navigation'
import {PropTypes} from 'prop-types'
import * as Constant from './common/constant'
import * as vocaPlayAction from './redux/action/vocaPlayAction';
import AliIcon from '../../component/AliIcon';
import styles from './VocaPlayStyle'
import PlayController from './component/PlayController';
import StudyPlayController from './component/StudyPlayController'
import VocaUtil from './common/vocaUtil'
import gstyles from '../../style'


const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

global.VocaPlayFlatList = null; //声明全局遍历对象

class VocaPlayPage extends React.Component {

    static propTypes = {
        vocaDao: PropTypes.object,
        taskDao: PropTypes.object,
        mode: PropTypes.string,
        task: PropTypes.object,
    }

    constructor(props){
        super(props);
        // this.taskDao = this.props.navigation.getParam('taskDao',null)
        this.taskDao = this.props.taskDao
        // this.vocaDao = this.props.navigation.getParam('vocaDao', null)
        this.vocaDao = this.props.vocaDao
        // this.mode = this.props.navigation.getParam('mode', Constant.NORMAL_PLAY)
        this.mode = this.props.mode
        this.isStudyMode = false
        if(this.mode !== Constant.NORMAL_PLAY){  //新学和复习统称学习模式
            this.isStudyMode = true
        }
    }
    componentDidMount(){
        const { loadTask} = this.props
        //加载task
        // const task = navigation.getParam('task', null)
        loadTask(this.props.task, this.vocaDao, this.taskDao)

        //判断是否自动播放，task是从navigation中获取，一定存在curIndex
        if(this.isStudyMode){
            // 1s后自动播放
            // let tm = setTimeout(()=>{
            //     this._autoplay(0);
            // },1000)
        }
    }

    componentWillUnmount(){ //退出界面
       this._quitLearn();
    }

    //退出页面（学习模式下）
    _quitLearn(){
        if(this.isStudyMode){  
            VocaPlayFlatList = 0;
            const {autoPlayTimer, curIndex} = this.props.vocaPlay
            const {changePlayTimer} = this.props;  
            //停止播放
            if(autoPlayTimer){
                clearTimeout(autoPlayTimer);
            }
            // //重置单词列表
            // resetPlayList();
            

        }
    }

    /**
     * @description 自动播放 
     * @memberof SwiperFlatList
     */
    _autoplay = (index) => {
        const {task} = this.props.vocaPlay;
        const { words, wordCount} = task 
        const {changePlayTimer} = this.props;
        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if(wordCount > 0){
            console.log('run autoplay')
            if (VocaPlayFlatList) { 
                console.log('move');
                VocaPlayFlatList.scrollToIndex(params);
            }
            //2.播放单词音频


            //3.循环回调
            let timer = setTimeout(() => {
                const nextIndex = (index + 1) % wordCount;
                this._replay(  nextIndex);
                
            }, VocaPlayInterval * 1000);
            changePlayTimer(timer);     //改变
        }
  
        


        //4. 中断播放
        // if(this.isStudyMode){
        //     if(curIndex == words.length-1){  //最后一个 12
        //         this.learnPlayTime++
        //     }
       
        //     if(this.learnPlayTime >= 1){ //播放一遍后，进入下一阶段

        //         // 抹掉stack，跳转到指定路由
        //         const  resetAction = StackActions.reset({  
        //             index: 0,
        //             actions: [
        //                 NavigationActions.navigate({routeName:'LearnCard'})
        //             ]
        //         });
        //         this.props.navigation.dispatch(resetAction);
        //         //标记完成轮播学习
        //         finishPlay();
        //     }
        // }
    };
  
    _replay = (index) => {
        console.log(`replay index:${index}`)
        const { autoPlayTimer, } = this.props.vocaPlay;
        const { changeCurIndex } = this.props;
        
        //改变单词下标
        changeCurIndex(index,this.isStudyMode);

        // 回调自动播放
        if (autoPlayTimer) {
            this._autoplay(index);  
        }

        
    }

    //Pass单词
    _passWord = (word)=>{
        const {status} = this.props.vocaPlay.task
        this.props.passWord(word,status,this.isStudyMode, this.taskDao)
    }
    //查询单词
    _queryWord = (word)=>{

    }

    _renderItem = ({item, index})=>{
        const {showWord,showTran,curIndex,themes, themeId, autoPlayTimer} = this.props.vocaPlay;
        //处理中文翻译
        let translation = ''
        if(item.tran !==null && item.tran.length>0){
            const trans = JSON.parse(item.tran)
            for(let i in trans){
                let processdTran = ''
                if(i==0 && trans.length>1 && trans[i].tran.length>9){
                    processdTran = trans[i].tran.substr(0,9) + '..'
                }else{
                    processdTran = trans[i].tran
                }
                translation += `${trans[i].property}.${processdTran}；`
            }
        }
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

        if(autoPlayTimer>0){
            return (
                <View style={styles.item}>
                    <Text style={[styles.itemEnText,playEnStyle]}>{showWord?item.word:''}</Text>
                    <Text note numberOfLines={1} style={[styles.itemZhText,playZhStyle]}>
                        {showTran?translation:''}</Text>
                </View>
            );
        }else{
            return (
                <Menu>
                    <MenuTrigger  >
                        <View style={styles.item}>
                            <Text style={[styles.itemEnText,playEnStyle]}>{showWord?item.word:''}</Text>
                            <Text note numberOfLines={1} style={[styles.itemZhText,playZhStyle]}>
                                {showTran?translation:''}</Text>
                        </View>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption style={gstyles.haireBottom} onSelect={()=>this._passWord(item.word)} >
                            <View style={[gstyles.r_start, {paddingVertical:4}]}>
                                <AliIcon name='pass' size={20} color={Theme.themeColor}></AliIcon>
                                <Text style={{paddingLeft:10,fontSize:16,color: Theme.themeColor}}>Pass单词</Text>
                            </View>
                        </MenuOption>
                            
                        <MenuOption onSelect={() => this._queryWord(word)} >
                            <View style={[gstyles.r_start, {paddingVertical:4}]}>
                                <AliIcon name='chazhao' size={20} color={Theme.themeColor}></AliIcon>
                                <Text style={{paddingLeft:10,fontSize:16, color: Theme.themeColor}}>查询单词</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
    };

    _keyExtractor = (item, index) => index.toString();




    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 


    // 渲染任务列表
    _renderTaskItem = ({item, index})=>{
        const {autoPlayTimer} = this.props.vocaPlay
        const {loadTask , changePlayTimer} = this.props
        let name = VocaUtil.genTaskName(item.taskOrder)
        // 播放新的任务
        return <TouchableOpacity onPress={()=>{
            if(autoPlayTimer){ 
                clearTimeout(autoPlayTimer);
                changePlayTimer(0);
            }
            loadTask(item, this.vocaDao, this.taskDao)
            //顺序执行的缘故，_autoplay里面的wordCount无法立即刷新
            if(item.wordCount>0){
                this._autoplay(0)
            }
        }}>
            <View style={styles.taskItem}>
                <View style={styles.nameView}>
                    <Text style={styles.nameText}>{`List-${name}`}</Text>
                    <Text style={styles.noteText}>{`任务列表`}</Text>
                </View>
                <FontAwesome name="play-circle" size={24} color="#999"/>
            </View>
        </TouchableOpacity>
    }
    // 关闭任务列表
    _closeTaskListModal = ()=>{
        this.props.toggleTaskModal(false)
    }
    //打开任务列表
    _openTaskListModal = ()=>{
        this.props.toggleTaskModal(true)
    }
    // 创建任务列表
    _createTaskListModal = () =>{
        // 获取任务列表数据
        const {tasksModalOpened} = this.props.vocaPlay
        return <ModalBox style={[styles.tasksModal]}
            isOpen={tasksModalOpened} 
            onClosed={this._closeTaskListModal}
            onOpened={this._openTaskListModal}
            backdrop={true} 
            backdropPressToClose={true}
            swipeToClose={false}
            position={"bottom"} 
            easing={Easing.elastic(0.2)}
            ref={ref => {
                this.taskList = ref
            }}>
            <View style={[gstyles.c_start, {width:'100%'}]}>
                <View style={[styles.modalHeader,gstyles.r_center]}>
                    <Text>四级词汇</Text>
                </View>
                <View style={{height:40}}>
                </View>
                <FlatList
                    //数据源
                    data={this.taskDao.getLearnedTasks()}
                    //渲染列表数据
                    renderItem={this._renderTaskItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<View style={{width:'100%',height:50,backgroundColor:'#FFF'}}></View>}
                />
            </View>
        </ModalBox>
    }

    render(){

        const {task,  themeId, themes, autoPlayTimer, isLoadPending} = this.props.vocaPlay;
        const {words} = task
        const Theme = themes[themeId]

        let name = VocaUtil.genTaskName(task.taskOrder)
        const totalTimes = this.mode===Constant.LEARN_PLAY?Constant.LEARN_PLAY_TIMES:Constant.REVIEW_PLAY_TIMES
        const finishedTimes = task?totalTimes-task.leftTimes:0
        const contentHeight = this.isStudyMode?height-STATUSBAR_HEIGHT-200:height-STATUSBAR_HEIGHT-240
        //单词列表处理
        const showWords = []
        for(let w of words){
            if(!w.passed ){
                showWords.push(w)
            }
        }

        let flatListProps = {
            ref: component => {
                VocaPlayFlatList = component;
            },
            horizontal: false,
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            pagingEnabled: false,
            extraData: this.props.vocaPlay,      //促使FlatList刷新  
            keyExtractor: this._keyExtractor,
            data:showWords,
            renderItem: this._renderItem,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,
        }

        
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
                
                centerComponent={<Text style={gstyles.pageTitle} >{`List-${name}`}</Text>}
                rightComponent={this.isStudyMode?
                    <Text style={gstyles.pageTitle}>{`${finishedTimes}/${totalTimes}`}</Text>:
                    null}
                containerStyle={{
                    backgroundColor: '#FCFCFC00',
                    borderBottomColor: '#FCFCFC00',
                }}
                />

            {/* 内容列表区 */}
            <WhiteSpace size='lg'/>
            <View style={ [styles.content, {height:contentHeight}]}>
                <FlatList {...flatListProps}/>
            </View>
            {/* 底部播放控制区 */}
            {this.isStudyMode &&
                <StudyPlayController {...this.props} autoplay={this._autoplay} 
                openTaskListModal={this._openTaskListModal}  />
            }
            {!this.isStudyMode &&
                <PlayController {...this.props} autoplay={this._autoplay} 
                openTaskListModal={this._openTaskListModal}  />
            }
            {
                this._createTaskListModal()
            }
        </LinearGradient>
        );
    }
}



const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay,
});

const mapDispatchToProps = {
    loadTask : vocaPlayAction.loadTask,
    changePlayTimer : vocaPlayAction.changePlayTimer,
    changeCurIndex : vocaPlayAction.changeCurIndex,
    toggleWord : vocaPlayAction.toggleWord,
    toggleTran : vocaPlayAction.toggleTran,
    loadTheme : vocaPlayAction.loadThemes,
    changeTheme : vocaPlayAction.changeTheme,
    changeInterval : vocaPlayAction.changeInterval,
    toggleTaskModal : vocaPlayAction.toggleTaskModal,
    passWord : vocaPlayAction.passWord,
};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);