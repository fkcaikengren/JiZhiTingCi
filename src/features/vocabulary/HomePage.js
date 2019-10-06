import React, { Component } from 'react';
import {StatusBar, View} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux'
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

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            toastRef:null,
        }
        this.vts = new VocaTaskService()
        console.disableYellowBox = true
    }


    componentDidMount(){
        SplashScreen.hide();        //隐藏启动页
        this._init()            //加载任务
        this.setState({
            toastRef:this.refs.toastRef
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.home !== this.props.home ){
            console.log('---home is changed ------')
            return true
        }
        //vocaPlay的task 下标不变，不重绘
        const {task, autoPlayTimer} = this.props.vocaPlay
        if( nextProps.vocaPlay.autoPlayTimer === autoPlayTimer){
            return false
        }
        return true
    }


    _init = ()=>{
        const {tasks, lastLearnDate} = this.props.home
        const {plan} = this.props.vocaLib
        const today = _util.getDayTime(0)
        console.log(today)
        if(lastLearnDate && (today !== lastLearnDate)){  //任务过期(每天第一次打开App)
            const storedTasks = VocaUtil.filterRawTasks(tasks)
            //计算保存单词任务到本地
            console.log('---------任务过期-> 计算保存任务------------')
            this.vts.storeTasks(storedTasks)
            //统计
            this.props.changeLeftDays(this.vts.countLeftDays())
            //获取今日任务
            console.log('---------任务过期->加载今日任务------------')
            this.props.loadTasks(storedTasks,plan.taskCount,lastLearnDate)
        }
    }


    _closeDrawerPanel = () => {
        this._drawer.close()
        this.setState({modalVisible:false})
    };
    _openDrawerPanel = () => {
        this._drawer.open()
        this.setState({modalVisible:true})
    };


    render() {

        const {task} = this.props.vocaPlay
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
                    mainOverlay: {backgroundColor: '#AAA', opacity:0},
                }}
                tweenDuration={350}
                tweenHandler={ (ratio) => {
                    // console.log(ratio)
                    return {
                        mainOverlay: { opacity:ratio*0.6 }
                    }
                  }
                }
                >
                <View style={styles.container} >
                    <StatusBar translucent={false} barStyle="dark-content" />
                    <View style={styles.statusBar} />
                    {/*顶部背景和任务列表 */}
                    <HomeHeader navigation={this.props.navigation} home={this.props.home} vocaLib={this.props.vocaLib}
                                toastRef={this.state.toastRef} openDrawer={this._openDrawerPanel}>
                        <Task   navigation={this.props.navigation} home={this.props.home} updateTask={this.props.updateTask}
                                toastRef={this.state.toastRef}/>
                    </HomeHeader>

                    {/* 底部播放控制 */}
                    <HomeFooter {...this.props} task={task}/>
                    <Toast
                        ref="toastRef" 
                        position='top'
                        positionValue={120}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                    />  
                </View>
            </Drawer>
        );
    }

}

const mapStateToProps = state =>({
    home: state.home,
    vocaLib: state.vocaLib,
    vocaPlay: state.vocaPlay,
})
  
  
const mapDispatchToProps = {
    loadTasks: HomeAction.loadTasks,
    uploadTask : HomeAction.uploadTask,
    updateTask : HomeAction.updateTask,
    changeLeftDays : VocaLibAction.changeLeftDays,
    changePlayTimer : VocaPlayAction.changePlayTimer,
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



