import React, { Component } from 'react';
import { StatusBar, View, AppState } from 'react-native';
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import Drawer from 'react-native-drawer'

import styles from './HomeStyle'
import HomeDrawerPanel from './component/HomeDrawerPanel'
import HomeHeader from './component/HomeHeader'
import Task from './component/Task'
import HomeFooter from './component/HomeFooter'
import VocaTaskService from './service/VocaTaskService'
import * as HomeAction from './redux/action/homeAction'
import * as VocaLibAction from './redux/action/vocaLibAction'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import _util from '../../common/util'
import VocaUtil from "./common/vocaUtil";
import { BY_REAL_TASK } from "./common/constant";

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
            && nextProps.vocaLib === this.props.vocaLib) {
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


    _init = () => {
        const { tasks, lastLearnDate } = this.props.home
        const { plan } = this.props.vocaLib
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
            plan={this.props.vocaLib.plan} closeDrawer={this._closeDrawerPanel} />

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
                        home={this.props.home} vocaLib={this.props.vocaLib}
                        toastRef={this.props.app.toast} 
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
    vocaLib: state.vocaLib,
    vocaPlay: state.vocaPlay,
})


const mapDispatchToProps = {
    loadTasks: HomeAction.loadTasks,
    syncTask: HomeAction.syncTask,
    updateTask: HomeAction.updateTask,
    changeLeftDays: VocaLibAction.changeLeftDays,
    changePlayTimer: VocaPlayAction.changePlayTimer,
    clearPlay: VocaPlayAction.clearPlay,
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



