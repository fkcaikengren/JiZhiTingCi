
import React, { Component } from 'react';
import { Platform, StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style';
import VocaTaskDao from '../service/VocaTaskDao';
import VocaDao from '../service/VocaDao';
import VocaUtil from '../common/vocaUtil';
import { store } from '../../../redux/store'
import * as Constant from '../common/constant';



const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const PaneBgColor = '#808080EE'

/**
 * 关于CommonModal的展示模板
 */
export default class PlayListPane extends Component {

    constructor(props) {
        super(props)
        this.taskDao = VocaTaskDao.getInstance()
        this.vocaDao = VocaDao.getInstance()
    }

    render() {
        return null
    }

    // 渲染任务列表
    _renderTaskItem = ({ item, index }) => {
        const { app, vocaPlay } = store.getState()
        const { autoPlayTimer, themes } = vocaPlay
        const { autoplay, changePlayTimer, loadTask, changeNormalType, changeTheme } = this.props

        let name = VocaUtil.genTaskName(item.taskOrder)
        const listenTimes = item.listenTimes
        const testTimes = item.testTimes
        const label = item.status === Constant.STATUS_200 ? '掌握' : '学习'

        let dotColor = '#1890FFEE'
        if (item.disablePlay) {
            dotColor = '#F2553FEE'
        }
        // 播放新的任务
        return <TouchableOpacity onPress={() => {
            //判断VocaTask是否处于今日任务中 
            if (item.disablePlay) {
                app.toast.show("该列表正在学习中,暂时无法播放", 1000)
                return //结束
            }
            if (autoPlayTimer) {
                BackgroundTimer.clearTimeout(autoPlayTimer);
                changePlayTimer(0);
            }
            //数据库加载任务
            const task = VocaUtil.copyTaskDeep(this.taskDao.getTaskByOrder(item.taskOrder), true)
            const showWordInfos = this.vocaDao.getShowWordInfos(task.taskWords)
            changeNormalType(Constant.BY_REAL_TASK)
            // this.disablePass = false #todo:不能Pass单词
            loadTask(task, showWordInfos)
            //顺序执行的缘故，_autoplay里面的wordCount无法立即刷新
            autoplay(0)
            // NotificationManage.play((e)=>{
            //     console.log(e)
            // },()=>null);
            //随机切换主题
            changeTheme(VocaUtil.randomNum(0, themes.length - 1))
        }}>
            <View style={[styles.taskItem, gstyles.r_between]}>
                <View style={[{ flex: 1, height: '100%' }, gstyles.r_start]}>
                    <View style={[gstyles.c_center, { marginRight: 10 }]}>
                        <Text style={[gstyles.serialText, { color: '#FFF' }]}>{index < 9 ? '0' + (index + 1) : (index + 1)}</Text>
                        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={gstyles.lg_white}>{name}</Text>
                        <View style={[gstyles.r_start]}>
                            <Text style={[gstyles.labelText]}>{label}</Text>
                            <Text style={[gstyles.noteText, { color: '#FFF' }]}>{`共${item.wordCount}词，已听${listenTimes}遍，已测试${testTimes}次`} </Text>
                        </View>
                    </View>
                </View>
                <FontAwesome name="play-circle" size={24} color="#EFEFEF" style={{ marginRight: 10 }} />
            </View>
        </TouchableOpacity>
    }

    _renderPlayList = () => {
        const { plan } = store.getState().plan
        return () => {
            const data = this.taskDao.getAllTasks().map((task, i) => {
                let disablePlay = false
                if (VocaUtil.isLearningInTodayTasks(task.taskOrder)) {
                    disablePlay = true
                }
                return {
                    disablePlay,
                    taskOrder: task.taskOrder,
                    status: task.status,
                    listenTimes: task.listenTimes,
                    testTimes: task.testTimes,
                    wordCount: task.wordCount
                }
            })
            return <View style={[gstyles.c_start, { width: '100%', }]}>
                <View style={[styles.modalHeader, gstyles.r_center]}>
                    <Text style={gstyles.white}>{plan.bookName}</Text>
                </View>
                <View style={{ height: 40 }}>
                </View>
                {data.length > 0 &&
                    <FlatList
                        style={{ width: '100%' }}
                        data={data}
                        renderItem={this._renderTaskItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<View style={[{ width: '100%', height: 50, }, gstyles.r_center]}>
                        </View>}
                    />
                }
                {data.length <= 0 &&
                    <View style={[gstyles.c_center, { marginTop: 80 }]}>
                        <AliIcon name={'nodata_icon'} size={80} color={gstyles.white} />
                        <Text style={gstyles.md_white}>你还没有学过的单词列表哦</Text>
                    </View>
                }
            </View>



        }
    }


    /**
     * 显示分享模板
     * @param {*} commonModal 
     */
    show() {
        const { app } = store.getState()
        app.commonModal.show({
            renderContent: this._renderPlayList(),
            modalStyle: {
                height: 420,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                backgroundColor: PaneBgColor,
            },
            backdropPressToClose: true,
            position: 'bottom'
        })
    }
}

const styles = StyleSheet.create({
    modalHeader: {
        width: width,
        height: 40,
        position: 'absolute',
        top: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderColor: '#EFEFEF88',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    taskItem: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: '#666666EE',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    statusDot: {
        width: 4,
        height: 4,
        borderRadius: 20
    },
});


PlayListPane.propTypes = {
    autoplay: PropTypes.func.isRequired,
    changePlayTimer: PropTypes.func.isRequired,
    changeNormalType: PropTypes.func.isRequired,
    loadTask: PropTypes.func.isRequired,
    changeTheme: PropTypes.func.isRequired,
}




