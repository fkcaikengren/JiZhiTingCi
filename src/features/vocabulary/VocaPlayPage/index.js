import React, { Component } from 'react';
import {
    Platform, StatusBar, View, Text, TouchableOpacity, Image, findNodeHandle
} from 'react-native';
import { Header, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types'
import Modal from 'react-native-modalbox';
import { BlurView } from "@react-native-community/blur";
import BackgroundTimer from 'react-native-background-timer'

import VocaCard from '../component/VocaCard'
import SwipeableFlatList from '../../../component/SwipeableFlatList'
import * as Constant from '../common/constant'
import * as HomeAction from '../redux/action/homeAction'
import * as VocaPlayAction from '../redux/action/vocaPlayAction';
import AliIcon from '../../../component/AliIcon';
import styles from './style'
import PlayController from './PlayController';
import StudyPlayController from './StudyPlayController'
import VocaUtil from '../common/vocaUtil'
import gstyles from '../../../style'
import VocaDao from '../service/VocaDao';
import VocaPlayService from '../service/VocaPlayService'
import NotificationManage from '../../../modules/NotificationManage'
import _util from "../../../common/util";
import { COMMAND_MODIFY_PASSED, COMMAND_MODIFY_LISTEN_TIMES } from '../../../common/constant';
import { store } from '../../../redux/store'
import LookWordBoard from '../component/LookWordBoard';
import ShareTemplate from '../../../component/ShareTemplate';



const ITEM_H = 55;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');




/**
 *  当在学习播放模式下，采用组件自身的状态
 *  当在常规播放模式下，采用redux中的状态
 */
class VocaPlayPage extends React.Component {

    static propTypes = {
        task: PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.vocaDao = VocaDao.getInstance()

        //当前模式
        this.mode = this.props.navigation.getParam('mode', Constant.NORMAL_PLAY)
        this.isStudyMode = false
        if (this.mode === Constant.LEARN_PLAY || this.mode === Constant.REVIEW_PLAY) {  //新学和复习统称学习模式
            this.isStudyMode = true
        }
        //检查本地时间
        if (this.isStudyMode) {
            // _util.checkLocalTime() #todo:检查时间
        }

        //初始化完成遍数
        this.finishedTimes = 0

        //播放服务
        this.vocaPlayService = VocaPlayService.getInstance()
        this.vocaPlayService.changeCurIndex = this._changeCurIndex
        this.vocaPlayService.changePlayTimer = this._changePlayTimer
        this.vocaPlayService.finishQuit = this.isStudyMode ? this._finishQuit : null




        //状态
        const studyState = this.isStudyMode ? {
            task: {
                taskWords: []
            },
            showWordInfos: [],
            curIndex: 0,
            autoPlayTimer: 0,
            interval: 1.4,
            showWord: true,
            showTran: true,

        } : {}
        this.state = {
            //学习模式特有状态
            ...studyState,
            //公共状态
            isTasksModalOpened: false,
            isVocaModalOpen: false,
            clickIndex: null,
            //blur处理
            viewRef: null,
        }

        this.vocaPlayService.stateRef = this.isStudyMode ? this.state : null
        this.disablePass = true
        this.timerArr = []
        console.disableYellowBox = true
    }


    //自定义改变状态函数
    changeState = (state) => {
        this.vocaPlayService.setStateRef(state)
        this.setState(state)
    }


    componentDidMount() {
        //修改当前normalType
        let normalType = this.props.navigation.getParam('normalType')
        if (normalType) {
            this.props.changeNormalType(normalType)
        } else {
            normalType = this.props.vocaPlay.normalType
        }
        this.disablePass = (this.mode === Constant.LEARN_PLAY || normalType === Constant.BY_VIRTUAL_TASK)

        //判断是否自动播放，task是从navigation中获取，一定存在curIndex
        if (this.isStudyMode) {
            //加载task 和word
            const task = this.props.navigation.getParam('task')
            const showWordInfos = this.vocaDao.getShowWordInfos(task.taskWords)

            this.totalTimes = this.mode === Constant.LEARN_PLAY ? Constant.LEARN_PLAY_TIMES : store.getState().mine.configReviewPlayTimes
            this.finishedTimes = task.leftTimes ? this.totalTimes - task.leftTimes : 0

            //设置单词、释义可见性
            if ((this.mode === Constant.LEARN_PLAY || this.mode === Constant.REVIEW_PLAY) && this.finishedTimes <= 0) {
                this._toggleTran(false)
                this._toggleWord(true)
            }

            //改变状态
            this.changeState({ task, showWordInfos, curIndex: task.curIndex })
            console.log('---chagne state------')
            // console.log(this.vocaPlayService.stateRef)

            // 1s后自动播放
            const timeoutId = BackgroundTimer.setTimeout(() => {
                this.vocaPlayService.autoplay(task.curIndex)
            }, 1000);
        } else {

            if (this.props.vocaPlay.normalType === Constant.BY_VIRTUAL_TASK || normalType === Constant.BY_VIRTUAL_TASK) {
                const task = this.props.navigation.getParam('task')
                console.log('-----------------virtual task---------------------')
                console.log(task)
                if (task) {
                    const showWordInfos = this.vocaDao.getShowWordInfos(task.taskWords)
                    this.props.loadTask(task, showWordInfos)
                    console.log('---chagne state------')
                    // console.log(this.vocaPlayService.stateRef)
                    NotificationManage.play((e) => {
                        console.log(e)
                    }, () => null);
                    // 1s后自动播放
                    const timeoutId = BackgroundTimer.setTimeout(() => {
                        this.vocaPlayService.autoplay(task.curIndex)
                    }, 1000);
                }
            }

        }
    }

    componentDidUpdate(prevProps, prevState) {
        //如果播放状态变化
        if (this.state.autoPlayTimer && prevState.autoPlayTimer !== this.state.autoPlayTimer) {
            this.vocaPlayService.listRef.closePassBtn()
        } else if (prevProps.vocaPlay.autoPlayTimer !== this.props.vocaPlay.autoPlayTimer) {
            this.vocaPlayService.listRef.closePassBtn()
        }


    }

    componentWillUnmount() { //退出界面
        for (let timer of this.timerArr) {
            clearTimeout(timer)
        }
        if (this.isStudyMode) {
            this._quitLearn();
        }
    }

    // 更新单词下标
    _changeCurIndex = (state, playIndex) => {
        const beforeCount = state.task.wordCount
        let listenTimes = state.task.listenTimes
        let leftTimes = state.task.leftTimes
        const normalType = this.props.navigation.getParam('normalType')

        //播放到最后一个单词
        if (playIndex + 1 === beforeCount) {
            listenTimes++
            if (leftTimes && leftTimes > 0) {
                leftTimes--
            }
            if (normalType !== Constant.BY_VIRTUAL_TASK) {
                VocaTaskDao.getInstance().modifyTask({ taskOrder: state.task.taskOrder, listenTimes: listenTimes, leftTimes })
            }
        }

        //分情况处理-----------
        if (this.isStudyMode) {
            this.changeState({
                task: { ...this.state.task, curIndex: playIndex, listenTimes, leftTimes },
                curIndex: playIndex
            })
        } else {
            this.props.changeCurIndex({ curIndex: playIndex, listenTimes })
            if (listenTimes === state.task.listenTimes + 1 && normalType !== Constant.BY_VIRTUAL_TASK) {
                //上传
                this.props.syncTask({
                    command: COMMAND_MODIFY_LISTEN_TIMES,
                    data: {
                        taskOrder: state.task.taskOrder,
                        listenTimes
                    }
                })
            }
        }
    }



    // 控制翻译显示
    _toggleTran = (showTran = null) => {
        if (this.isStudyMode) {
            showTran === null ? this.changeState({ showTran: !this.state.showTran })
                : this.changeState({ showTran })
        } else {
            this.props.toggleTran(showTran)
        }

    }

    // 控制单词显示
    _toggleWord = (showWord = null) => {
        if (this.isStudyMode) {
            showWord === null ? this.changeState({ showWord: !this.state.showWord })
                : this.changeState({ showWord })
        } else {
            this.props.toggleWord(showWord)
        }
    }

    // 暂停、播放
    _changePlayTimer = (autoPlayTimer) => {
        if (this.isStudyMode) {
            console.log('-------change autoPlayTimer--------' + autoPlayTimer)
            this.changeState({ autoPlayTimer })
        } else {
            this.props.changePlayTimer(autoPlayTimer)
        }
    }

    // 控制时间间隔
    _changeInterval = (interval) => {
        if (this.isStudyMode) {
            this.changeState({ interval })
        } else {
            this.props.changeInterval(interval)
        }
    }


    _passWordInState(state, word) {
        const beforeCount = state.task.wordCount
        let index = state.curIndex
        const showWordInfos = state.showWordInfos
        //当pass最后一个单词，修改下标
        if (index + 1 === beforeCount) {
            index = 0
        }
        const task = { ...state.task, wordCount: beforeCount - 1, curIndex: index }
        //pass任务中的单词
        const result = VocaUtil.passWordInTask(word, task, showWordInfos)

        //上传pass结果
        this.props.syncTask({
            command: COMMAND_MODIFY_PASSED,
            data: {
                word,
                passed: true,
                taskOrder: result.task.taskOrder
            }
        })

        return {
            task: result.task,
            curIndex: result.task.curIndex,
            showWordInfos: result.showWordInfos
        }
    }


    // pass单词
    _passWord = (word) => {
        if (this.isStudyMode) {
            this.changeState(this._passWordInState(this.state, word))
        } else {
            this.props.passWord(this._passWordInState(this.props.vocaPlay, word))
        }
    }

    //退出页面（学习模式下）
    _quitLearn() {
        const { autoPlayTimer } = this.state
        //停止播放
        if (this.isStudyMode && autoPlayTimer) {
            console.log('---清理--' + autoPlayTimer)
            clearTimeout(autoPlayTimer);
            this.vocaPlayService.setStateRef({ autoPlayTimer: 0 })
        }
    }

    /** 完成学习，退出页面 */
    _finishQuit = () => {

        //学习模式下：完成播放，退出
        const { task, showWordInfos, autoPlayTimer } = this.state
        if (this.isStudyMode && task.leftTimes <= 0) {

            // console.log('---清理--'+autoPlayTimer)
            // clearTimeout(autoPlayTimer);
            // this.vocaPlayService.setStateRef({autoPlayTimer:0})

            const routeName = this.props.navigation.getParam('nextRouteName')
            let nextRouteName = null
            //改变任务进度
            const finalTask = { ...task, curIndex: 0 }
            let otherParams = null
            if (task.status === Constant.STATUS_0) {
                //跳转到卡片学习页面
                nextRouteName = 'TestVocaTran'
                finalTask.progress = 'IN_LEARN_CARD'
                otherParams = {
                    showAll: false,
                    playWord: true,      //用于LearCard,自动播放单词
                    playSentence: true  //用于LearCard,自动播放例句
                }
            } else {
                //跳转到测试页面
                nextRouteName = 'Home'
                finalTask.progress = 'IN_REVIEW_TEST'
            }
            // 更新任务
            this.props.updateTask({ task: finalTask })

            // 抹掉stack，跳转
            console.log('--routeName--: ' + routeName)
            this.timerArr.push(setTimeout(() => {
                VocaUtil.goPageWithoutStack(this.props.navigation, routeName, {
                    task: finalTask,
                    showWordInfos: showWordInfos,
                    nextRouteName: nextRouteName,
                    ...otherParams
                })
            }, 1000))

            //结束
            return;
        }
    }


    //单词列表项
    _renderItem = ({ item, index }) => {
        const isShowPassBtn = (!this.disablePass
            && this.vocaPlayService.listRef
            && this.vocaPlayService.listRef.getOpenedRowKey() === index)
        if (item) {
            let { task, curIndex, showWord, showTran, themes, themeId } = this.props.vocaPlay
            if (this.isStudyMode) {
                task = this.state.task
                curIndex = this.state.curIndex
                showWord = this.state.showWord
                showTran = this.state.showTran
            }

            //主题
            const Theme = themes[themeId]
            //字幕的样式
            let playEnStyle = {}
            let playZhStyle = {}


            if (curIndex == index) {
                console.log(`curIndex: ${curIndex}`)
                playEnStyle = {
                    fontSize: 22,
                    color: Theme.playColor
                };
                playZhStyle = {
                    fontSize: 16,
                    color: Theme.playColor
                };
            }


            return (
                <View style={[{ width: '100%' }, gstyles.r_center]}>
                    <View style={{ flex: 1 }}></View>

                    <View style={{ flex: 4 }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({ clickIndex: index })
                            //弹框
                            this._openVocaModal()
                        }}>
                            <View style={styles.item}>
                                <Text style={[styles.itemEnText, playEnStyle]}>{showWord ? item.word : ''}</Text>
                                <Text note numberOfLines={1} style={[styles.itemZhText, playZhStyle]}>
                                    {showTran ? item.translation : ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        {isShowPassBtn &&
                            <Button
                                title='Pass'
                                titleStyle={{ color: '#FFF', fontSize: 14, fontWeight: '400' }}
                                buttonStyle={{ backgroundColor: '#F2753F', height: 30, marginLeft: 5, }}
                                onPress={() => {
                                    //关闭侧滑
                                    this.vocaPlayService.listRef.closePassBtn()
                                    if (task.wordCount <= 2) {
                                        this.props.app.toast.show('只剩2个单词，不能再Pass了', 1000)
                                    } else {
                                        this._passWord(item.word)
                                    }
                                }}
                            />
                        }
                    </View>
                </View>

            );
        } else {
            return null
        }
    };


    _keyExtractor = (item, index) => index;
    // length: item高度； offset: item的父组件的偏移量
    _getItemLayout = (data, index) => {
        return ({ length: ITEM_H, offset: ITEM_H * index, index });
    }

    _onOpen = (key) => {
        //暂停
        const { vocaPlay } = this.props
        if (this.isStudyMode) {
            if (this.state.autoPlayTimer) {
                BackgroundTimer.clearTimeout(this.state.autoPlayTimer);
                this._changePlayTimer(0);
            }
        } else {
            if (vocaPlay.autoPlayTimer) {
                BackgroundTimer.clearTimeout(vocaPlay.autoPlayTimer);
                this._changePlayTimer(0);
            }
        }
    }


    // 关闭任务列表 #todo:显示隐藏
    _closeTaskListModal = () => {
        this.setState({ isTasksModalOpened: false })
    }
    //打开任务列表
    _openTaskListModal = () => {
        this.setState({ isTasksModalOpened: true })
    }


    _openVocaModal = () => {
        //暂停
        const { vocaPlay } = this.props
        if (this.isStudyMode) {
            if (this.state.autoPlayTimer) {
                BackgroundTimer.clearTimeout(this.state.autoPlayTimer);
                this._changePlayTimer(0);
            }
        } else {
            if (vocaPlay.autoPlayTimer) {
                BackgroundTimer.clearTimeout(vocaPlay.autoPlayTimer);
                this._changePlayTimer(0);
            }
        }
        this.setState({ isVocaModalOpen: true }) //显示
    }
    _closeVocaModal = () => {
        this.setState({ isVocaModalOpen: false }) //隐藏
    }
    //单词详情modal
    _createVocaModal = () => {
        let showWordInfos = this.isStudyMode ? this.state.showWordInfos : this.props.vocaPlay.showWordInfos
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
            {this.state.clickIndex !== null && showWordInfos[this.state.clickIndex] &&
                <VocaCard
                    navigation={this.props.navigation}
                    lookWord={this.wordBoard.lookWord}
                    wordInfo={showWordInfos[this.state.clickIndex]} />
            }
            <View
                style={gstyles.closeBtn}
                onStartShouldSetResponder={() => true}
                onResponderStart={(e) => { this._closeVocaModal() }}
            >
                <AliIcon name='cha' size={20} color={gstyles.black} />
            </View>
        </Modal>
    }

    _renderController = () => {
        if (this.isStudyMode) {
            return <StudyPlayController  {...this.props}
                toastRef={this.props.app.toast}
                playState={this.state}
                mode={this.mode}
                autoplay={this.vocaPlayService.autoplay}
                finishedTimes={this.finishedTimes}
                changePlayTimer={this._changePlayTimer}
                changeInterval={this._changeInterval}
                toggleWord={this._toggleWord}
                toggleTran={this._toggleTran}
            />
        } else {
            return <PlayController
                navigate={this.props.navigation.navigate}
                autoplay={this.vocaPlayService.autoplay}
                changePlayTimer={this._changePlayTimer}
                changeInterval={this._changeInterval}
                toggleWord={this._toggleWord}
                toggleTran={this._toggleTran}
                changeBg={this.props.changeBg}
                changeNormalType={this.props.changeNormalType}
                loadTask={this.props.loadTask}
                changeTheme={this.props.changeTheme}
            />
        }
    }



    _renderShareContentView = () => {
        let { showWordInfos } = this.props.vocaPlay;
        if (this.isStudyMode) {
            showWordInfos = this.state.showWordInfos
        }
        return <View style={[gstyles.c_start, { width: '100%' }]}>
            {
                showWordInfos.map((item, i) => {
                    if (i > 4) {
                        return null
                    } else {
                        textStyle = { fontSize: 13, color: (i === 2) ? gstyles.mainColor : '#FFF' }
                        return <View style={[gstyles.c_center, { width: '70%' }]}>
                            <Text numberOfLines={1} style={textStyle}>{item.word}</Text>
                            <Text numberOfLines={1} style={[textStyle, { marginBottom: 3 }]}>{item.translation}</Text>
                        </View>
                    }
                })
            }
        </View>
    }



    render() {
        let { task, themeId, themes, showWordInfos, bgPath } = this.props.vocaPlay;
        if (this.isStudyMode) {
            task = this.state.task
            showWordInfos = this.state.showWordInfos
        }

        const name = VocaUtil.genTaskName(task.taskOrder)
        this.totalTimes = this.mode === Constant.LEARN_PLAY ? Constant.LEARN_PLAY_TIMES : store.getState().mine.configReviewPlayTimes
        this.finishedTimes = task.leftTimes ? this.totalTimes - task.leftTimes : 0

        const contentHeight = height - STATUSBAR_HEIGHT - 260

        const imgSource = (bgPath && bgPath !== '') ? { uri: Platform.OS === 'android' ? 'file://' + bgPath : '' + bgPath } :
            require('../../../image/play_bg.jpg')
        return (
            <View style={{ flex: 1, }}>
                <Image style={[styles.bgImage]}
                    ref={img => { this._backgroundImage = img }}
                    source={imgSource}
                    resizeMode={'cover'}
                    onLoadEnd={() => { this.setState({ viewRef: findNodeHandle(this._backgroundImage) }) }} />
                {this.state.viewRef && this.props.vocaPlay.showBlur &&
                    <BlurView
                        style={styles.absolute}
                        viewRef={this.state.viewRef}
                        blurType="light"
                        blurAmount={28} //最大模糊32
                        blurRadius={20} //最大24
                        overlayColor={'#80808066'}   // set a overlay
                    />
                }
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content" // or directly
                    leftComponent={this.isStudyMode ? null :
                        <AliIcon name='fanhui' size={26} color='#FFF' onPress={() => {
                            this.props.navigation.goBack()
                        }} />}
                    centerComponent={{ text: task.taskOrder ? name : '未选择', style: gstyles.lg_white_bold }}
                    rightComponent={this.isStudyMode ?
                        <Text style={{ color: '#FFF', fontSize: 16 }}>{`${this.finishedTimes + 1}/${this.totalTimes}`}</Text> :
                        <AliIcon name='fenxiang' size={26} color='#FFF' onPress={() => {
                            // 打开分享面板
                            ShareTemplate.show({
                                commonModal: this.props.app.commonModal,
                                bgSource: imgSource,
                                renderContentView: this._renderShareContentView()
                            })
                        }} />}
                    containerStyle={{
                        backgroundColor: '#FCFCFC00',
                        borderBottomColor: '#FCFCFC00',
                    }}
                />

                {/* 内容列表区 */}
                <TouchableOpacity onPress={() => {
                    this.props.showBlur(!this.props.vocaPlay.showBlur)
                }}>
                    <View style={[styles.content, { height: contentHeight }]}>
                        {task.taskOrder &&
                            <SwipeableFlatList
                                ref={comp => {
                                    this.vocaPlayService.listRef = comp
                                }
                                }
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                pagingEnabled={false}
                                // extraData={{showWord, showTran}}
                                keyExtractor={this._keyExtractor}
                                data={showWordInfos}
                                renderItem={this._renderItem}
                                initialNumToRender={16}
                                getItemLayout={this._getItemLayout}


                                bounceFirstRowOnMount={false}
                                onOpen={this._onOpen}
                                renderQuickActions={(data) => !this.disablePass}
                                maxSwipeDistance={40}
                            />
                        }
                    </View>
                </TouchableOpacity>

                {/* 底部播放控制区 */}
                {
                    this._renderController()
                }
                {
                    this._createVocaModal()
                }
                <LookWordBoard
                    ref={comp => this.wordBoard = comp}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    app: state.app,
    plan: state.plan,
    vocaPlay: state.vocaPlay,
});

const mapDispatchToProps = {
    updatePlayTask: VocaPlayAction.updatePlayTask,
    changePlayTimer: VocaPlayAction.changePlayTimer,
    changeCurIndex: VocaPlayAction.changeCurIndex,
    toggleWord: VocaPlayAction.toggleWord,
    toggleTran: VocaPlayAction.toggleTran,
    changeInterval: VocaPlayAction.changeInterval,
    passWord: VocaPlayAction.passWord,
    changeNormalType: VocaPlayAction.changeNormalType,
    setInPlan: VocaPlayAction.setInPlan,
    showBlur: VocaPlayAction.showBlur,
    changeBg: VocaPlayAction.changeBg,

    loadTask: VocaPlayAction.loadTask,
    loadThemes: VocaPlayAction.loadThemes,
    changeTheme: VocaPlayAction.changeTheme,
    updateTask: HomeAction.updateTask,
    syncTask: HomeAction.syncTask,

};

export default connect(mapStateToProps, mapDispatchToProps)(VocaPlayPage);