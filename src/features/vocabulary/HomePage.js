import React, { Component } from 'react';
import {Image, View,Animated, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import styles from './HomeStyle'

import HomeHeader from './component/HomeHeader';
import Task from './component/Task';
import HomeFooter from './component/HomeFooter';
import VocaTaskService from './service/VocaTaskService'
import * as HomeAction from './redux/action/homeAction'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.taskService = new VocaTaskService()
        // this.vocaDao = VocaDao.getInstance()

        console.disableYellowBox = true
    }

    componentDidMount(){
        //加载task
        const tasks = this.taskService.getTodayTasks(this.props.home.tasks)
        this.props.loadTasks(tasks)
    }


    render() {
        const {tasks} = this.props
        return (
            <View style={styles.container}>
                {/*顶部背景和任务列表 */}
                <HomeHeader {...this.props}  >
                    <Task {...this.props} tasks={this.props.home.tasks} />
                </HomeHeader>

                {/* 底部播放控制 */}
                {/* <HomeFooter {...this.props} task={task}/> */}
            </View>
        );
    }

}

const mapStateToProps = state =>({
    home: state.home
})
  
  
const mapDispatchToProps = {
    loadTasks: HomeAction.loadTasks
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



