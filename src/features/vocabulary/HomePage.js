import React, { Component } from 'react';
import {Image, View,Animated, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux'
import styles from './HomeStyle'

import HomeHeader from './component/HomeHeader';
import Task from './component/Task';
import HomeFooter from './component/HomeFooter';

class HomePage extends Component {
    constructor(props) {
        super(props);
            this.state = {
            shift: new Animated.Value(0),
            current: 0
        };

    }


    render() {
        const {tasks} = this.props
        return (
            <View style={styles.container}>
                {/*顶部背景和任务列表 */}
                <HomeHeader {...this.props} offset={this.state.shift} current={this.state.current}>
                    <Task {...this.props} tasks={tasks} />
                </HomeHeader>
                {/* 底部播放控制 */}
                {/* <HomeFooter {...this.props} task={task}/> */}
            </View>
        );
    }

}

const mapStateToProps = state =>({
    tasks: state.home.tasks
})
  
  
const mapDispatchToProps = dispatch=>({

})
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)



