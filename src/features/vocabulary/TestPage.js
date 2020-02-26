import React, { Component } from "react";
import { Dimensions, View, Text, BackHandler } from 'react-native';
import { Grid, Col, Row } from 'react-native-easy-grid'
import { Header, Button } from 'react-native-elements'
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modalbox';
import { PropTypes } from 'prop-types';

import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao'
import AliIcon from '../../component/AliIcon'
import gstyles from '../../style'
import styles from "./TestStyle";
import vocaUtil from './common/vocaUtil'
import _util from '../../common/util'
import VocaCard from "./component/VocaCard";
import * as Constant from './common/constant'
import AudioService from '../../common/AudioService'
import VocaTaskService from "./service/VocaTaskService";
import { VOCABULARY_DIR, COMMAND_MODIFY_TASK, COMMAND_MODIFY_PASSED } from "../../common/constant";
import _ from 'lodash'
import { store } from "../../redux/store";
import VocaGroupService from "./service/VocaGroupService";
import LookWordBoard from "./component/LookWordBoard";

const { width, height } = Dimensions.get('window');


export default class TestPage extends Component {

    constructor(props) {
        super(props);
        this.taskDao = VocaTaskDao.getInstance()
        this.vocaDao = VocaDao.getInstance()
        this.audioService = AudioService.getInstance()


        const task = this.props.navigation.getParam('task')
        this.state = {
            task: task,
            showWordArr: [], //未Pass的单词下标数组
            wrongWordArr: [], //错误单词下标数组
            curIndex: 0,    //测试数组中当前测试单词下标

            isDetailModalOpen: false,
            isAnsweredModalOpen: false,
            selectedIndex: -1,       //选择的下标
            selectedStatus: 0,       //选择的状态 [0:待选择，1:正确，2:错误]

            leftTime: this.props.testTime,  //倒计时

            showAnswer: false,      //显示答案
            isPassed: false          //显示单词是否被Pass
        }
        this.isRetest = this.props.navigation.getParam('isRetest', false)  //第n(n>1)轮测试
        this.allWordInfos = this.vocaDao.getWordInfos(task.taskWords.map((item, i) => item.word))
        this.testWordArr = []           //测试数组
        this.perPassWordArr = []         //一轮测试过程中Pass的单词
        this.options = []               //选项数组（存放单词下标）
        this.answerIndex = 0           //答案下标
        this.hasSeenDetail = false      //是否已经查看单词详情

        this.noPass = true
        this.timerArr = []          //定时器的timer

        //检查本地时间
        _util.checkLocalTime()
    }


    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this._goBack()
            return true
        })
        this._init()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')
        for (let timer of this.timerArr) {
            clearTimeout(timer)
        }
    }

    _init = () => {
        //1.初始化信息
        const task = this.props.navigation.getParam('task')
        const curIndex = task.curIndex
        const showWordArr = task.taskWords.map((tWord, index) => {
            if (tWord.passed !== true) {
                return index
            } else {
                return -1
            }
        }).filter((item, _) => {
            return (item !== -1)
        })

        console.log('showWordArr------------------------------')
        console.log(showWordArr)

        const wrongWordArr = task.taskWords.map((tWord, index) => {
            if (tWord.testWrongNum > 0) {
                return index
            } else {
                return -1
            }
        }).filter((item, _) => {
            return (item !== -1)
        })
        if (this.isRetest) {//当第n(n>1)轮的重测

            this.testWordArr = _.intersection(showWordArr, wrongWordArr) //取并集
        } else {
            this.testWordArr = showWordArr
        }

        //新学单词测试和虚拟列表测试不显示Pass
        this.noPass = (task.status === Constant.STATUS_0 ||
            this.props.vocaPlay.normalType === Constant.BY_VIRTUAL_TASK)

        //2.生成选项
        this._genOptions(this.testWordArr[curIndex])
        this.setState({
            task,
            curIndex,
            showWordArr,
            wrongWordArr: this.isRetest ? [] : wrongWordArr
        })



        //3.开始计时
        this._countDown()

        //4.自动发音
        this._autoPronounce()
    }


    // 自动发音
    _autoPronounce = () => {
        if (this.props.type === Constant.PRON_TRAN || this.props.type === Constant.WORD_TRAN) {
            const pron_url = this.allWordInfos[this.answerIndex] ? this.allWordInfos[this.answerIndex].pron_url : null
            this.props.playAudio(pron_url)
        }
    }


    //开始倒计时
    _countDown = () => {
        this.countTimer = setInterval(() => {
            //改变状态
            const leftTime = this.state.leftTime - 1
            if (leftTime >= 0) {
                this.setState({ leftTime })
            } else {
                //清理
                clearInterval(this.countTimer)
                this.hasSeenDetail = true
                this._openDetailModal()
            }

        }, 1000)
    }

    //停止计时
    _stopCountDown = () => {
        if (this.countTimer) {
            clearInterval(this.countTimer)
        }
    }

    //重新开始计时
    _reCountDown = () => {
        if (this.countTimer) {
            clearInterval(this.countTimer)
        }
        this.setState({ leftTime: this.props.testTime })
        this._countDown()
    }



    /**
     * 产生选项和答案
     */
    _genOptions = (indexOfAllWords) => {
        console.log(indexOfAllWords)
        this.answerIndex = indexOfAllWords
        const randomNum = vocaUtil.randomNum(0, 3)                  //产生一个随机下标
        this.options = vocaUtil.randomArr(0, this.allWordInfos.length - 1, [this.answerIndex], 3)     //3个选项
        this.options.splice(randomNum, 0, this.answerIndex)          //插入正确答案
        console.log('------->  options: ')
        console.log(this.options)
    }

    //判断答案 isWrong: 返回是否选错
    _judgeAnswer(option) {
        console.log('------选择答案：' + option)
        //index范围： [0,1,2,3,4],其中4是查看提示
        const newTask = { ...this.state.task }
        let isRight = false
        let selectedStatus = 0      //表示查看提示
        const wrongWordArr = this.state.wrongWordArr
        if (option === this.answerIndex) {    //选择正确 (包括查看提示)
            isRight = true
            selectedStatus = 1
            //看过答案，归为做错
            if (this.hasSeenDetail) {
                newTask.taskWords[this.answerIndex].wrongNum++
                newTask.taskWords[this.answerIndex].testWrongNum++
                wrongWordArr.push(this.answerIndex)
            }

        } else {                                  //选择错误
            selectedStatus = 2
            newTask.taskWords[this.answerIndex].wrongNum++
            newTask.taskWords[this.answerIndex].testWrongNum++
            wrongWordArr.push(this.answerIndex)
        }


        if (this.hasSeenDetail) {
            this.hasSeenDetail = false
        }
        this.setState({
            task: newTask,
            selectedIndex: option,
            selectedStatus,
            wrongWordArr
        })
        return isRight
    }




    // 测试下一个单词
    _nextWord = () => {
        console.log('^^^^_nextWord 下一个单词^^^^^^')
        const routeName = this.props.navigation.getParam('nextRouteName')
        const { task, curIndex, showWordArr, wrongWordArr } = this.state
        let progress = task.progress
        let isQuit = false      //是否退出测试
        let nextIndex = curIndex
        if (curIndex + 1 > this.testWordArr.length - 1) { //进入下一轮测试
            nextIndex = 0
            this.testWordArr = _.intersection(showWordArr, wrongWordArr)
            //清空上一轮pass的单词
            this.perPassWordArr = []
            //退出or进入重测
            if (this.testWordArr.length <= 0) {
                console.log('进入下一轮测试 -- 退出')
                isQuit = true
                if (routeName === 'Home') {               //回到Home
                    if (task.progress.startsWith('IN_LEARN')) {
                        progress = Constant.IN_LEARN_FINISH
                    } else if (task.progress.startsWith('IN_REVIEW')) {
                        progress = Constant.IN_REVIEW_FINISH
                        //统计已学单词数量
                        if (task.status === Constant.STATUS_1) {
                            this.props.changeLearnedWordCount({
                                learnedWordCount: new VocaTaskService().countLearnedWords()
                            })
                        }
                    }
                } else if (routeName && routeName.startsWith('Test')) { //进入第二轮测试
                    progress = Constant.IN_LEARN_TEST_2
                }
            } else {
                console.log('进入下一轮测试 -- 重测')
                this.isRetest = true
                switch (task.progress) {
                    case Constant.IN_LEARN_TEST_1:
                        progress = Constant.IN_LEARN_RETEST_1
                        break
                    case Constant.IN_LEARN_TEST_2:
                        progress = Constant.IN_LEARN_RETEST_2
                        break
                    case Constant.IN_REVIEW_TEST:
                        progress = Constant.IN_REVIEW_RETEST
                        break
                }
                console.log("progress : " + progress)
                this.setState({
                    task: { ...task, progress },
                    wrongWordArr: []
                })
            }

        } else {//继续本轮测试
            nextIndex = curIndex + 1
        }


        // 重新计时
        this._reCountDown()
        if (isQuit) { //完成测试，退出
            console.log('----------updateTask-同时测试次数+1-------')
            const newTask = {
                ...task,
                curIndex: 0,
                progress,
                testTimes: task.testTimes + 1,
                taskWords: task.taskWords.map((item, _) => {
                    item.testWrongNum = 0
                    return item
                })
            }
            if (this.props.mode === 'study') {      //学习模式下
                this.props.updateTask({ task: newTask })
                let params = {}
                if (routeName === 'Home') {
                    //上传数据（注：如果是新学则上传其1复数据）
                    let uploadedTask = newTask
                    if (newTask.status === Constant.STATUS_0) {
                        uploadedTask = vocaUtil.updateNewTaskToReviewTask(newTask)
                    }
                    this.props.syncTask({ command: COMMAND_MODIFY_TASK, data: uploadedTask })
                } else {
                    params = {
                        task: newTask,
                        nextRouteName: 'Home'
                    }
                }
                vocaUtil.goPageWithoutStack(this.props.navigation, routeName, { ...params, judgeFinishAllTasks: true })
            } else {                                //普通模式下
                this._normalTestEnd(newTask)
            }
            this.audioService.releaseSound()
        } else {     //继续测试
            this._genOptions(this.testWordArr[nextIndex])
            this.setState({
                curIndex: nextIndex,
                selectedStatus: 0,
                isPassed: false,
                showAnswer: false
            })
            //自动发音
            this._autoPronounce()
        }
    }

    //非学习模式下完成测试
    _normalTestEnd = (task) => {
        const showWordInfos = []
        let i = 0
        for (let tWord of task.taskWords) {
            if (tWord.passed === false) {
                showWordInfos.push(this.allWordInfos[i])
            }
            i++
        }
        const newTask = {
            ...task,
            curIndex: 0,
            taskWords: task.taskWords.map((item, _) => {
                item.testWrongNum = 0
                return item
            })
        }
        if (this.props.vocaPlay.normalType === Constant.BY_REAL_TASK) {
            //更新任务
            this.props.updatePlayTask(newTask, showWordInfos)
            //上传数据
            this.props.syncTask({ command: COMMAND_MODIFY_TASK, data: newTask })
        } else if (this.props.vocaPlay.normalType === Constant.BY_VIRTUAL_TASK) {
            if (task && task.taskOrder !== Constant.VIRTUAL_TASK_ORDER) {//如果是生词本
                this.props.changeTestTimes(task.testTimes)
                const vgService = new VocaGroupService()
                vgService.updateTestTimes(task.taskOrder, task.testTimes)
                console.log(task.taskOrder + '--生词本 测试次数--' + task.testTimes)
            }
        }
        this.props.navigation.goBack()
    }


    //创建单词详情modal, 
    _createDetailModal = (isAnswered) => {
        const bgColor = '#EC6760'

        const { curIndex, isAnsweredModalOpen, isDetailModalOpen, isPassed } = this.state
        // isAnswered=true，表示答题后的Modal；isAnswered=false,表示查看提示的Modal
        return <Modal style={gstyles.modal}
            isOpen={isAnswered ? this.state.isAnsweredModalOpen : this.state.isDetailModalOpen}
            onClosed={isAnswered ? this._closeAnsweredModal : this._closeDetailModal}
            onOpened={isAnswered ? this._openAnsweredModal : this._openDetailModal}
            backdrop={true}
            backdropPressToClose={false}
            swipeToClose={false}
            position={"bottom"}
            ref={ref => {
                this.detailModal = ref
            }}>
            <View style={gstyles.vocaModalView}>
                {this.allWordInfos[this.answerIndex] &&
                    <VocaCard
                        navigation={this.props.navigation}
                        lookWord={this.wordBoard ? this.wordBoard.lookWord : _ => null}
                        wordInfo={this.allWordInfos[this.answerIndex]} />
                }
                <View style={[styles.modalBottom, gstyles.r_between]}>
                    {!this.noPass &&
                        <Button
                            title={isPassed ? '' : 'Pass'}
                            icon={isPassed ? <AliIcon name='wancheng' size={30} color='#FFF' /> : null}
                            titleStyle={{ color: '#FFF', fontSize: 16 }}
                            containerStyle={{ flex: 1, marginRight: 20 }}
                            buttonStyle={[styles.selectBtn, { backgroundColor: bgColor }]}
                            onPress={() => {
                                if (this.state.task.wordCount <= 2) {
                                    store.getState().app.toast.show('超出Pass数量限制，不能再Pass了', 1000)
                                    return
                                }
                                this._passWord(this.allWordInfos[this.answerIndex].word)
                                if (isAnsweredModalOpen) {
                                    this._closeAnsweredModal()
                                } else if (isDetailModalOpen) {
                                    this._closeDetailModal()
                                }
                                this.timerArr.push(setTimeout(this._nextWord, 500))
                            }} //pass 
                        />
                    }
                    <Button
                        title={`完成巩固，继续做题`}
                        titleStyle={{ color: '#FFF', fontSize: 16 }}
                        containerStyle={{ flex: 4 }}
                        buttonStyle={[styles.selectBtn, { backgroundColor: bgColor }]}
                        onPress={() => {
                            if (isAnswered) { //答题后
                                this._closeAnsweredModal()
                                this._nextWord()
                            } else {      //查看提示或超时
                                this._closeDetailModal()
                                this._reCountDown()
                            }
                        }}
                    />
                </View>

            </View>
        </Modal>
    }
    //打开单词详情页
    _openDetailModal = () => {
        this._stopCountDown()
        this.setState({ isDetailModalOpen: true })
    }
    _closeDetailModal = () => {
        console.log('_closeDetailModal')
        this.setState({ isDetailModalOpen: false });
    }
    _openAnsweredModal = () => {
        this._stopCountDown()
        this.setState({ isAnsweredModalOpen: true })
    }
    _closeAnsweredModal = () => {
        console.log('_closeAnsweredModal')
        this.setState({ isAnsweredModalOpen: false });
    }

    /**
     * pass单词
     */
    _passWord = (passedWord) => {
        this.perPassWordArr.push(passedWord)
        const beforeWordCount = this.state.task.wordCount
        const task = { ...this.state.task, wordCount: beforeWordCount - 1 }
        const result = vocaUtil.passWordInTask(passedWord, task, null)
        const showWordArr = this.state.showWordArr.filter((item, i) => {
            return !(result.passedIndex === item)
        })
        this.setState({
            isPassed: true,
            task: result.task,
            showWordArr
        })
    }

    _goBack = () => {
        const curIndexWhenBack = this.state.curIndex - this.perPassWordArr.length
        const newTask = { ...this.state.task, curIndex: curIndexWhenBack }

        if (this.props.mode === 'study') { //更新上传任务
            this.props.updateTask({ task: newTask })
            this.props.syncTask({ command: COMMAND_MODIFY_TASK, data: newTask })
            vocaUtil.goPageWithoutStack(this.props.navigation, 'Home')
        } else {
            this._normalTestEnd(newTask)
        }
        this.audioService.releaseSound()
    }

    render() {
        const { selectedStatus, selectedIndex, curIndex, isPassed } = this.state
        console.log('--selectedStatus:' + selectedStatus)
        //已选择
        let selected = (selectedStatus != 0);
        //选择失败
        let selectWrong = (selectedStatus == 2);


        return (
            <View style={styles.container}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content"
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color='#555' onPress={this._goBack} />}
                    centerComponent={
                        <View style={gstyles.r_center}>
                            <Progress.Bar progress={this.testWordArr.length > 0 ? ((curIndex + 1) / this.testWordArr.length) : (1 / 100)} height={10} width={width - 120} color='#FFE957' unfilledColor='#EFEFEF' borderWidth={0} >
                                <Text style={{ fontSize: 10, position: 'absolute', left: (width - 120) / 2, top: -2, }}>{`${curIndex + 1}/${this.testWordArr.length}`}</Text>
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
                    this.props.renderContent(this.state.task.taskWords[this.answerIndex], this.allWordInfos[this.answerIndex], this.state.showAnswer)
                }
                <View style={{ width: width, height: 370 }}>
                    <Grid style={{ padding: 10, paddingBottom: 35 }}>
                        {this.options.length > 0 &&
                            this.options.map((option, index) => {
                                let showText = ''
                                let alignStyle = { textAlign: 'center' }
                                switch (this.props.type) {
                                    case Constant.WORD_TRAN:
                                    case Constant.PRON_TRAN:
                                        showText = this.allWordInfos[option] ? this.allWordInfos[option].translation : ''
                                        alignStyle = { textAlign: 'left' }
                                        break;
                                    case Constant.TRAN_WORD:
                                    case Constant.SEN_WORD:
                                        showText = this.allWordInfos[option] ? this.allWordInfos[option].word : ''
                                        break;
                                }
                                // 选项
                                const colorStyleArr = [
                                    (option === this.answerIndex && selected) ?
                                        { borderColor: '#1890FF', borderWidth: 1 } : null,
                                    (option === selectedIndex && selectWrong) ?
                                        { borderColor: '#EC6760', borderWidth: 1 } : null
                                ]
                                return <Row key={index} style={gstyles.r_center}>
                                    <Button
                                        title={showText}
                                        titleStyle={[
                                            {
                                                width: '90%',
                                                fontSize: 16,
                                                color: this.state.showAnswer ? '#555' : '#202020'
                                            },
                                            alignStyle,
                                            (option === this.answerIndex && selected) ? { color: '#1890FF', } : null,
                                            (option === selectedIndex && selectWrong) ? { color: '#EC6760', } : null
                                        ]}
                                        titleProps={{ numberOfLines: 1 }}
                                        containerStyle={[
                                            { width: '100%' },
                                        ]}
                                        buttonStyle={[
                                            styles.selectBtn,
                                            ...colorStyleArr
                                        ]}
                                        onPress={this.state.showAnswer ? null : () => {
                                            if (this._judgeAnswer(option)) { //回到
                                                this._stopCountDown()       //停止计时
                                                this.setState({ showAnswer: true }) //显示答案
                                                let url = null
                                                if (this.props.playType === "sentence") {
                                                    url = this.allWordInfos[this.answerIndex].sen_pron_url
                                                } else {
                                                    url = this.allWordInfos[this.answerIndex].pron_url
                                                }
                                                this.audioService.playSound({
                                                    pDir: VOCABULARY_DIR,
                                                    fPath: url
                                                }, null, () => {
                                                    this.timerArr.push(setTimeout(this._nextWord, 500))
                                                }, () => {
                                                    this.timerArr.push(setTimeout(this._nextWord, 500))
                                                })
                                            } else {                        //答错
                                                this._openAnsweredModal()
                                            }

                                        }} />
                                </Row>
                            })
                        }

                        <Row style={gstyles.r_between}>
                            {!this.noPass &&
                                <Button
                                    disabled={this.state.showAnswer}
                                    title={isPassed ? '' : 'Pass'}
                                    icon={isPassed ? <AliIcon name='wancheng' size={30} color='#F2753F' /> : null}
                                    titleStyle={{ color: '#F2753F', fontSize: 16 }}
                                    containerStyle={{ flex: 1, marginRight: 20 }}
                                    buttonStyle={[styles.selectBtn, { backgroundColor: '#FFE957', }]}
                                    onPress={() => {
                                        if (this.state.task.wordCount <= 2) {
                                            store.getState().app.toast.show('超出Pass数量限制，不能再Pass了', 1000)
                                            return
                                        }
                                        this._passWord(this.allWordInfos[this.answerIndex].word)
                                        this.timerArr.push(setTimeout(this._nextWord, 500))
                                    }} //pass
                                />
                            }
                            <Button
                                disabled={this.state.showAnswer}
                                title={`${this.state.leftTime}s  想不起来了，查看提示`}
                                titleStyle={{ color: '#F2753F', fontSize: 16 }}
                                containerStyle={{ flex: 4 }}
                                buttonStyle={[styles.selectBtn, { backgroundColor: '#FFE957' }]}
                                onPress={() => {
                                    this.hasSeenDetail = true
                                    this._openDetailModal()
                                }}
                            />
                        </Row>
                    </Grid>

                </View>

                {
                    this._createDetailModal(false)
                }
                {
                    this._createDetailModal(true)
                }
                <LookWordBoard
                    ref={comp => this.wordBoard = comp}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
}

TestPage.propTypes = {
    mode: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    playType: PropTypes.string,     //回答正确的音频播放类型
    testTime: PropTypes.number,     //测试实现
    renderContent: PropTypes.func, //题目内容
    playAudio: PropTypes.func,      //音频播放
}

TestPage.defaultProps = {
    mode: 'study',
    playType: 'word',
    testTime: 10,
    renderContent: (state) => null,
}