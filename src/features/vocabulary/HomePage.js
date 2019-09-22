import React, { Component } from 'react';
import {StatusBar, View} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux'

import styles from './HomeStyle'
import HomeHeader from './component/HomeHeader';
import Task from './component/Task';
import HomeFooter from './component/HomeFooter';
import AliIcon from '../../component/AliIcon'
import VocaTaskService from './service/VocaTaskService'
import * as HomeAction from './redux/action/homeAction'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import _util from '../../common/util'
import LookWordBoard from './component/LookWordBoard'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.taskService = new VocaTaskService()

        this.state = {
            toastRef:null
        }
        console.disableYellowBox = true
    }

    componentDidMount(){
        const {tasks} = this.props.home
        //加载task
        const today = _util.getDayTime(0)
        if(tasks.length <= 0){
            const todayTasks = this.taskService.getTodayTasks(tasks)
            this.props.loadTasks(todayTasks)
        }else{
            console.log(today)
            console.log(tasks[0].vocaTaskDate)
            if(today !== tasks[0].vocaTaskDate){  //任务过期
                this.taskService.calculateTasks(tasks, 2)
                const todayTasks = this.taskService.getTodayTasks(tasks)
                this.props.loadTasks(todayTasks)
            }
        }

        //toastRef 引起刷新
        this.setState({toastRef:this.refs.toastRef})

    }


    render() {
        const {task} = this.props.vocaPlay
        return (
            <View style={styles.container}>
               <StatusBar translucent={false} backgroundColor="#FFF"  barStyle="dark-content" />
                <View style={styles.statusBar} />
                {/*顶部背景和任务列表 */}
                <HomeHeader {...this.props}  >
                    <Task {...this.props} tasks={this.props.home.tasks} toastRef={this.state.toastRef}/>
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
                {this.props.home.isUploading &&
                    <View style={{
                        position:'absolute', 
                        top:40,
                        right:60,
                    }}>
                        <AliIcon name='tongbu' size={26} color='red'></AliIcon>
                    </View>
                }
            </View>
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
    uploadTasks : HomeAction.uploadTasks,
    updateTask : HomeAction.updateTask,
    changePlayTimer : VocaPlayAction.changePlayTimer,
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



