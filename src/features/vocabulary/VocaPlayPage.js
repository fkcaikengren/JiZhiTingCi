import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, View, Text, FlatList,
    TouchableWithoutFeedback, TouchableOpacity, Easing } from 'react-native';
import {WhiteSpace, Modal} from '@ant-design/react-native'
import {Header, Button} from 'react-native-elements'
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Bubbles } from 'react-native-loader';
// import {NavigationActions, StackActions} from 'react-navigation'
import {PropTypes} from 'prop-types'
import * as Constant from './common/constant'
import * as vocaPlayAction from './redux/action/vocaPlayAction';
import AliIcon from '../../component/AliIcon';
import styles from './VocaPlayStyle'
import PlayController from './component/PlayController';
import VocaUtil from './common/vocaUtil'
import gstyles from '../../style'


const ITEM_H = 55;
const StatusBarHeight = StatusBar.currentHeight;

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
        this.controlDisable = false
        if(this.mode !== Constant.NORMAL_PLAY){  //不是正常模式，则禁止操作控制栏
            this.controlDisable = true
        }
    }
    componentDidMount(){
        const { loadTask} = this.props
        //加载task
        // const task = navigation.getParam('task', null)
        loadTask(this.props.task, this.vocaDao, this.taskDao)

        //判断是否自动播放，task是从navigation中获取，一定存在curIndex
        if(this.controlDisable){
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
        if(this.controlDisable){  
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
        const { task} = this.props.vocaPlay;
        const { words} = task
        const {changePlayTimer} = this.props;

        // 1.滑动 {animated: boolean是否动画, index: item的索引, viewPosition:视图位置（0-1） };
        let params = { animated:true, index, viewPosition:0.5 };
        if (VocaPlayFlatList && words.length>0) { //当words不是空数组时才能移动
            console.log('move');
            VocaPlayFlatList.scrollToIndex(params);
        }


        //2.播放单词音频
        //3.循环回调
        let timer = setTimeout(() => {
            console.log(` words.length ${ words.length}`)
            const nextIndex = (index + 1) % words.length;
            console.log(nextIndex)
            this._replay(  nextIndex);
            
        }, VocaPlayInterval * 1000);
        changePlayTimer(timer);


        //4. 中断播放
        // if(this.controlDisable){
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
        console.log(index)
        const { autoPlayTimer, } = this.props.vocaPlay;
        const { changeCurIndex } = this.props;
        
        changeCurIndex(index);
        // 回调自动播放
        if (autoPlayTimer) {
            this._autoplay(index);  
        }

        
    }

    _renderItem = ({item, index})=>{
        const {showWord,showTran,task,themes, themeId} = this.props.vocaPlay;
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
        const curIndex  = task.curIndex?task.curIndex:0

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
            <TouchableWithoutFeedback onPress={()=>{
                
                Modal.alert('Pass单词', `确认Pass ${item.word}?`);
            }}>
                <View style={styles.item}>
                    <Text style={[styles.itemEnText,playEnStyle]}>{showWord?item.word:''}</Text>
                    <Text note numberOfLines={1} style={[styles.itemZhText,playZhStyle]}>
                        {showTran?translation:''}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _keyExtractor = (item, index) => index.toString();




    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) =>{
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    } 


    // 渲染任务列表
    _renderTaskItem = ({item, index})=>{
        let name = VocaUtil.genTaskName(item.taskOrder)
        return <TouchableOpacity onPress={()=>{
            this.props.loadTask(item, this.vocaDao, this.taskDao)
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
        console.log(isLoadPending)
        const {words} = task
        const Theme = themes[themeId]

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
            data:words,
            renderItem: this._renderItem,
            initialNumToRender: 16,
            getItemLayout: this._getItemLayout,
        }

        
        return(
        <LinearGradient 
        start={{x: 0.15, y: 0.15}} end={{x: 0.75, y: 0.75}}
        colors={Theme.bgColors} style={styles.container}>

            {/* 头部 */}
            <StatusBar translucent={true} />
            <Header
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle="light-content" // or directly
            leftComponent={ 
                <AliIcon name='fanhui' size={26} color='#FFF' onPress={()=>{
                    this.props.navigation.goBack();
                }}></AliIcon> }
            
            centerComponent={{ text: '四级词汇', style: { color: '#FFF', fontSize:18 } }}
            containerStyle={{
                backgroundColor: '#FCFCFC00',
                borderBottomColor: '#FCFCFC00',
            }}
            />

            {/* 内容列表区 */}
            <WhiteSpace size='lg'/>
            <View style={ styles.content}>
                <FlatList {...flatListProps}/>
            </View>
            {/* 底部播放控制区 */}
            <PlayController {...this.props} autoplay={this._autoplay} 
                openTaskListModal={this._openTaskListModal}  />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);