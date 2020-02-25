
import React, { Component } from 'react';
import { Platform, Easing, StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';
import Swiper from 'react-native-swiper'
import BackgroundTimer from 'react-native-background-timer'
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style';
import VocaTaskDao from '../service/VocaTaskDao';
import VocaUtil from '../common/vocaUtil';
import { store } from '../../../redux/store'
import * as Constant from '../common/constant';
import VocaGroupService from '../service/VocaGroupService';
import NotificationManage from '../../../modules/NotificationManage';

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');


/**
 * 关于CommonModal的展示模板
 */
export default class PlayListPane extends Component {

    constructor(props) {
        super(props)
        this.taskDao = VocaTaskDao.getInstance()
        this.vgService = new VocaGroupService()
    }

    render() {
        return null
    }

    // 渲染任务列表
    _renderTaskItem = ({ item, index }) => {
        const { autoplay, changePlayTimer, changeNormalType, changeTheme, changePlayListIndex } = this.props
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
            const { app, vocaPlay } = store.getState()
            const { autoPlayTimer, themes, playTaskList, playListIndex } = vocaPlay
            //判断VocaTask是否处于今日任务中 
            if (item.disablePlay) {
                app.toast.show("该列表正在学习中,无法播放", 1000)
                return //结束
            }
            if (autoPlayTimer) {
                BackgroundTimer.clearTimeout(autoPlayTimer);
                changePlayTimer(0);
            }
            changeNormalType(Constant.BY_REAL_TASK)

            let curPlayListIndex = playListIndex
            for (let i in playTaskList) {
                if (playTaskList[i] === item.taskOrder) {
                    curPlayListIndex = i
                }
            }
            changePlayListIndex({ //改变播放下标，重新加载播放数据
                changeType: 0,
                playListIndex: parseInt(curPlayListIndex)
            })

            //顺序执行的缘故，_autoplay里面的wordCount无法立即刷新
            autoplay(0)
            NotificationManage.play((e) => {
                console.log(e)
            }, () => null);
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


    _renderGroupItem = ({ item, index }) => {

        const { autoplay, changePlayTimer, changeNormalType, changeTheme, changePlayListIndex } = this.props
        const listenTimes = item.listenTimes
        const testTimes = item.testTimes
        const label = '生词'
        const disablePlay = (item.count < 5)
        let dotColor = '#1890FFEE'
        if (disablePlay) {
            dotColor = '#F2553FEE'
        }
        // 播放新的列表
        return <TouchableOpacity onPress={() => {
            const { app, vocaPlay } = store.getState()
            const { autoPlayTimer, themes, playGroupList, playListIndex } = vocaPlay
            if (disablePlay) {
                app.toast.show("单词数量少于5个,无法播放", 1000)
                return //结束
            }
            if (autoPlayTimer) {
                BackgroundTimer.clearTimeout(autoPlayTimer);
                changePlayTimer(0);
            }
            changeNormalType(Constant.BY_VIRTUAL_TASK)
            let curPlayListIndex = playListIndex
            for (let i in playGroupList) {
                if (playGroupList[i] === item.id) {
                    curPlayListIndex = i
                }
            }
            changePlayListIndex({ //改变播放下标，重新加载播放数据
                changeType: 0,
                playListIndex: parseInt(curPlayListIndex)
            })
            //顺序执行的缘故，_autoplay里面的wordCount无法立即刷新
            autoplay(0)
            NotificationManage.play((e) => {
                console.log(e)
            }, () => null);
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
                        <Text style={gstyles.lg_white}>{item.groupName}</Text>
                        <View style={[gstyles.r_start]}>
                            <Text style={[gstyles.labelText]}>{label}</Text>
                            <Text style={[gstyles.noteText, { color: '#FFF' }]}>{`共${item.count}词，已听${listenTimes}遍，已测试${testTimes}次`} </Text>
                        </View>
                    </View>
                </View>
                <FontAwesome name="play-circle" size={24} color="#EFEFEF" style={{ marginRight: 10 }} />
            </View>
        </TouchableOpacity>

    }

    _onIndexChanged = (index) => {
        const { setContentState } = store.getState().app.commonModal
        setContentState({ pageIndex: index })
    }

    _renderPlayList = () => {
        const { plan } = store.getState().plan
        const { getContentState, hide } = store.getState().app.commonModal
        return () => {
            const { pageIndex, playTasks, playGroups, isLoadingTasks, isLoadingGroups } = getContentState()
            return <View style={[gstyles.c_start, { width: '100%', height: height - 200 }]}>
                <View style={[styles.modalHeader, gstyles.r_center]}>
                    <Text style={gstyles.md_white}>{pageIndex === 1 ? '生词' : plan.bookName}</Text>
                </View>
                <Swiper
                    style={styles.listSize}
                    ref={comp => this.swiper = comp}
                    showsPagination={true}
                    loop={false}
                    onIndexChanged={this._onIndexChanged}
                    index={pageIndex}
                    loadMinimal loadMinimalSize={2}
                    dotColor='#FFFFFFAA'
                    activeDotColor='#FFE957'
                    paginationStyle={styles.dotPosition}
                >
                    {/* 任务播放列表 */}
                    <View style={[styles.listSize, gstyles.c_start]}>
                        {isLoadingTasks &&
                            <Text style={[gstyles.md_white, { marginTop: (styles.listSize.height / 2) }]}>加载中...</Text>
                        }
                        {!isLoadingTasks && playTasks.length > 0 &&
                            <FlatList
                                style={{ width: '100%' }}
                                data={playTasks}
                                renderItem={this._renderTaskItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={<View style={[{ width: '100%', height: 30, }, gstyles.r_center]}>
                                </View>}
                            />
                        }
                        {!isLoadingTasks && playTasks.length <= 0 &&
                            <View style={[gstyles.c_center, { marginTop: 120 }]}>
                                <AliIcon name={'no-data'} size={80} color='#DFDFDF' />
                                <Text style={gstyles.md_white}>暂无学习过的单词</Text>
                            </View>
                        }
                    </View>
                    {/* 生词播放列表 */}
                    <View style={[styles.listSize, gstyles.c_start]}>
                        {isLoadingGroups &&
                            <Text style={[gstyles.md_white, { marginTop: 180 }]}>加载中...</Text>
                        }
                        {!isLoadingGroups &&
                            <FlatList
                                style={{ width: '100%' }}
                                data={playGroups}
                                renderItem={this._renderGroupItem}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={<View style={[{ width: '100%', height: 30, }, gstyles.r_center]}>
                                </View>}
                            />
                        }
                    </View>
                </Swiper>
                <TouchableOpacity activeOpacity={0.7} style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                }} onPress={hide}>
                    <View style={styles.closeBtn}>
                        <Text style={gstyles.md_white}>关闭</Text>
                    </View>
                </TouchableOpacity>

            </View>
        }
    }


    /**
     * 显示播放列表
     */
    show() {
        const { commonModal } = store.getState().app
        const { show, setContentState } = commonModal

        setContentState({
            pageIndex: 0,
            playTasks: [],
            isLoadingTasks: true,
            playGroups: [],
            isLoadingGroups: true,

        })
        show({
            renderContent: this._renderPlayList(),
            modalStyle: {
                height: height - 200,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                backgroundColor: '#808080EE',
            },
            backdropPressToClose: true,
            position: 'bottom'
        })
        // 加载数据，改变状态
        const playTasks = this.taskDao.getAllTasks().map((task, i) => {
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
        setContentState({
            playTasks: playTasks, isLoadingTasks: false
        })
        Storage.load({ key: 'groupOrdersString' }).then(groupOrdersData => {
            const groupOrders = JSON.parse(groupOrdersData)
            const vocaGroups = this.vgService.getAllGroups()
            const playGroups = groupOrders.map((order, i) => vocaGroups[order])
            setContentState({
                playGroups: playGroups, isLoadingGroups: false
            })
        })

    }
}

const styles = StyleSheet.create({
    modalHeader: {
        width: width,
        height: 40,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderColor: '#EFEFEF66',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    listSize: {
        width: width,
        height: height - 300
    },
    taskItem: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: '#777777EE',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },

    statusDot: {
        width: 4,
        height: 4,
        borderRadius: 20
    },
    dotPosition: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        width: width,
        height: 40,
        ...gstyles.c_center
    }
});

PlayListPane.propTypes = {
    autoplay: PropTypes.func.isRequired,
    changePlayTimer: PropTypes.func.isRequired,
    changeNormalType: PropTypes.func.isRequired,
    changeTheme: PropTypes.func.isRequired,
    changePlayListIndex: PropTypes.func.isRequired,
}




