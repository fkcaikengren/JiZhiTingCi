import React, { Component } from 'react';
import {View} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux'

import styles from './HomeStyle'
import HomeHeader from './component/HomeHeader';
import Task from './component/Task';
import HomeFooter from './component/HomeFooter';
import VocaTaskService from './service/VocaTaskService'
import * as HomeAction from './redux/action/homeAction'
import _util from '../../common/util'

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
        setTimeout(()=>{
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
        }, 2000)

        //toastRef 引起刷新
        this.setState({toastRef:this.refs.toastRef})

    }


    render() {
        return (
            <View style={styles.container}>
                {/*顶部背景和任务列表 */}
                <HomeHeader {...this.props}  >
                    <Task {...this.props} tasks={this.props.home.tasks} toastRef={this.state.toastRef}/>
                </HomeHeader>

                {/* 底部播放控制 */}
                {/* <HomeFooter {...this.props} task={task}/> */}
                <Toast
                    ref="toastRef" 
                    position='top'
                    positionValue={120}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />  
            </View>
        );
    }

}

const mapStateToProps = state =>({
    home: state.home,
    vocaPlay: state.vocaPlay
})
  
  
const mapDispatchToProps = {
    loadTasks: HomeAction.loadTasks
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



