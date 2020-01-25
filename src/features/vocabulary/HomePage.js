import React, { Component } from 'react';
import { Platform, StatusBar, View, AppState } from 'react-native';
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import Drawer from 'react-native-drawer'
import { DURATION } from 'react-native-easy-toast'

import styles from './HomeStyle'
import HomeDrawerPanel from './component/HomeDrawerPanel'
import HomeHeader from './component/HomeHeader'
import Task from './component/Task'
import HomeFooter from './component/HomeFooter'
import VocaTaskService from './service/VocaTaskService'
import * as HomeAction from './redux/action/homeAction'
import * as PlanAction from './redux/action/planAction'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import _util from '../../common/util'
import VocaUtil from "./common/vocaUtil";
import { BY_REAL_TASK } from "./common/constant";
import { USER_DIR } from '../../common/constant';

import RNFetchBlob from 'rn-fetch-blob'
import FileService from '../../common/FileService';
import * as MineAction from '../mine/redux/action/mineAction';
const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            appState: AppState.currentState
        }
        this.vts = new VocaTaskService()
        console.disableYellowBox = true
    }


    componentDidMount() {
        SplashScreen.hide();        //隐藏启动页
        this._init()            //加载任务
        //上传数据
        this.props.syncTask(null)

        //监听App状态
        AppState.addEventListener('change', this._handleAppStateChange);
    }


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    shouldComponentUpdate(nextProps, nextState) {

        const { task, autoPlayTimer, bgPath } = this.props.vocaPlay
        //vocaPlay的task 下标不变，不重绘
        if (nextProps.vocaPlay.autoPlayTimer === autoPlayTimer
            && nextProps.vocaPlay.bgPath === bgPath
            && nextProps.home === this.props.home
            && nextProps.plan === this.props.plan) {
            return false
        }
        return true
    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App 到前台')
        }
        if (this.state.appState.match(/active/) && nextAppState === 'background') {
            console.log('App 到后台')

        }
        this.setState({ appState: nextAppState });
    }


    _init = async () => {

        //1. 登录进入首页
        if (IsLoginToHome) {
            this.props.app.loader.show("同步数据...", DURATION.FOREVER)
            const loginUserInfo = this.props.navigation.getParam("loginUserInfo")

            if (loginUserInfo) {
                const { avatarUrl, vocaGroups, vocaTasks } = loginUserInfo
                //保存头像
                if (avatarUrl) {
                    const res = await FileService.getInstance().fetch(avatarUrl, DocumentDir + USER_DIR + 'avatar.jpg')
                    const avatarSource = { uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }
                    this.props.setAvatarSource({ avatarSource })
                }
                // 保存vocaGroups
                if (vocaGroups && vocaGroups.length > 0) {
                    const vgDao = VocaGroupDao.getInstance()
                    vgDao.deleteAllGroups()
                    vgDao.saveVocaGroups(vocaGroups)
                }

                // 保存vocaTasks
                if (vocaTasks && vocaTasks.length > 0) {
                    const vtDao = VocaTaskDao.getInstance()
                    vtDao.deleteAllTasks()
                    vtDao.saveVocaTasks(vocaTasks, 10) //plan.taskWordCount 暂时用10
                }
            }
            this.props.app.loader.close()
        }

        //2. 加载今日数据
        const { tasks, lastLearnDate } = this.props.home
        const { plan } = this.props.plan
        const today = _util.getDayTime(0)
        console.log(today)
        if ((lastLearnDate && (today !== lastLearnDate)) || IsLoginToHome) {  //任务过期(每天第一次打开App)
            const storedTasks = VocaUtil.filterRawTasks(tasks)

            //统计
            this.props.changeLeftDays(this.vts.countLeftDays())
            //判断是否清空VocaPlay
            const { task, normalType } = this.props.vocaPlay
            if (normalType === BY_REAL_TASK) {
                for (let st of storedTasks) {
                    if (st.taskOrder && st.taskOrder === task.taskOrder) {
                        this.props.clearPlay()
                        break
                    }
                }
            }
            //获取今日任务
            console.log('---------重新 加载今日任务------------')
            this.props.loadTasks(storedTasks, plan.taskCount, lastLearnDate)
        }
    }


    _closeDrawerPanel = () => {
        this._drawer.close()
        this.setState({ modalVisible: false })
    };
    _openDrawerPanel = () => {
        this._drawer.open()
        this.setState({ modalVisible: true })
    };


    render() {

        const { task } = this.props.vocaPlay
        const DrawerPanel = <HomeDrawerPanel navigation={this.props.navigation}
            plan={this.props.plan.plan} closeDrawer={this._closeDrawerPanel} />

        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="static"
                content={DrawerPanel}
                captureGestures={true}
                panOpenMask={0.4}
                panCloseMask={0.2}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                styles={{
                    mainOverlay: { backgroundColor: '#AAA', opacity: 0 },
                }}
                tweenDuration={350}
                tweenHandler={(ratio) => {
                    // console.log(ratio)
                    return {
                        mainOverlay: { opacity: ratio * 0.6 }
                    }
                }
                }
            >
                <View style={styles.container} >
                    <StatusBar translucent={false} barStyle="dark-content" />
                    <View style={styles.statusBar} />
                    {/*顶部背景和任务列表 */}
                    <HomeHeader
                        navigation={this.props.navigation}
                        home={this.props.home}
                        plan={this.props.plan}
                        app={this.props.app}
                        openDrawer={this._openDrawerPanel}>
                        <Task
                            navigation={this.props.navigation}
                            home={this.props.home}
                            updateTask={this.props.updateTask}
                            toastRef={this.props.app.toast} />
                    </HomeHeader>

                    {/* 底部播放控制 */}
                    <HomeFooter {...this.props} task={task} />
                </View>
            </Drawer>
        );
    }

}

const mapStateToProps = state => ({
    app: state.app,
    home: state.home,
    plan: state.plan,
    vocaPlay: state.vocaPlay,
})


const mapDispatchToProps = {
    setAvatarSource: MineAction.setAvatarSource,
    loadTasks: HomeAction.loadTasks,
    syncTask: HomeAction.syncTask,
    updateTask: HomeAction.updateTask,
    changeLeftDays: PlanAction.changeLeftDays,
    changePlayTimer: VocaPlayAction.changePlayTimer,
    clearPlay: VocaPlayAction.clearPlay,
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



