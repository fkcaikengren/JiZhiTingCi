import React, { Component } from 'react';
import {Image, View,Animated, TouchableOpacity} from 'react-native';
import {   Grid, Col, Row,Text, Footer,  } from 'native-base';
import {connect} from 'react-redux'
import * as Progress from '../../component/react-native-progress';
import AliIcon from '../../component/AliIcon';
import styles from './HomeStyle'

import HomeHeader from './component/HomeHeader';
import Task from './component/Task';

class HomePage extends Component {
    constructor(props) {
        super(props);
            this.state = {
            shift: new Animated.Value(0),
            current: 0
        };

    }
    _navVocaPlay = ()=>{      //跳到轮播页
        // this.props.navigation.navigate('VocaPlay',{playMode:'PLAY_REVIEW', taskDao:this.taskDao});
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
                <Footer style={{backgroundColor:'#FFF'}} >
                    <Grid >
                    <TouchableOpacity
                        style={styles.touch}
                        onPress={this._navVocaPlay}
                        activeOpacity={0.7}
                            >
                        <Col style={{width:70, height:50, }}>
                            <Row style={styles.center}>
                                <Image style={{width:50, height:50, borderRadius:50}} source={require('../../image/h_icon.png')} />
                            </Row>
                        
                        </Col>
                    </TouchableOpacity>
                        <Col>
                            <Row size={1}>
                                <View style={[styles.center,{alignItems:'flex-end'}]}>
                                    <Progress.Bar progress={0.3} height={2} width={280} color='#FFE957' unfilledColor='#DEDEDE' borderWidth={0}/>
                                </View>
                            </Row>
                            <Row size={4} style={{
                                flexDirection:'row',
                                justifyContent:'space-between',
                                alignItems:'center',}}>
                                <View >
                                    <Text style={{fontSize:16, color:'#404040'}}>List-001</Text>
                                </View>
                                <View style={{
                                    flexDirection:'row',
                                    justifyContent:'flex-end',
                                    alignItems:'center',
                                }}>
                                    <AliIcon name='bofang1' size={22} color='#404040' style={{paddingRight:20}}></AliIcon>
                                    <AliIcon name='xiayige' size={20} color='#404040'  style={{paddingRight:20}}></AliIcon>
                                    <AliIcon name='bofangliebiaoicon' size={18} color='#404040' style={{paddingRight:10}}></AliIcon>
                                </View>
                            </Row>
                        </Col>
                    </Grid>
                </Footer>
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



