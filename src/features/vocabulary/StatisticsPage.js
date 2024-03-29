import React, { Component } from "react";
import { BackHandler, StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Header } from "react-native-elements";
import { Calendar } from 'react-native-calendars';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import { store } from "../../redux/store";
import VocaTaskService from "./service/VocaTaskService";


const styles = StyleSheet.create({
    itemView: {
        width: '90%',
        padding: 5,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 5,
    },
    flag: {
        fontSize: 22,
        color: gstyles.secColor,
        fontWeight: '800',
    }
});

export default class StatisticsPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            masteredWordCount: 0,
            finishedDays: {}
        }
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        //初始化
        this._init()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = async () => {
        const finishDays = await Storage.getAllDataForKey('finishDays')
        console.log(finishDays)
        const finishedDays = {}
        for (let item of finishDays) {
            finishedDays[item] = { selected: true }
        }
        const masteredWordCount = new VocaTaskService().countMasteredWords()
        console.log(masteredWordCount)
        this.setState({
            masteredWordCount,
            finishedDays
        })
    }

    _genCurDate = () => {
        const d = new Date()
        let m = d.getMonth() + 1
        if (m < 10) {
            m = '0' + m
        }
        return `${d.getFullYear()}-${m}-01`
    }

    render() {
        const { plan, leftDays, learnedWordCount, allLearnedCount, allLearnedDays } = store.getState().plan

        return (
            <View style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}
                    centerComponent={{ text: '学习统计', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/* 学习统计 */}
                <ScrollView
                    containerStyle={{ flex: 1 }}
                    contentContainerStyle={[gstyles.c_start, { backgroundColor: '#EFEFEF' }]}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[{ marginTop: 10 }, styles.itemView]}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                            this.props.navigation.navigate('HistoryBooks')
                        }}>
                            <View style={[{ width: '100%', height: 55, paddingHorizontal: 10 }, gstyles.r_between]}>
                                <Text style={gstyles.md_black_bold}>
                                    <Text style={styles.flag}>| </Text>
                                    已学的单词书
                                    </Text>
                                <AliIcon name='youjiantou' size={26} color={gstyles.gray} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemView}>
                        <View style={[{ width: '100%', paddingHorizontal: 10 }, gstyles.c_start_left]}>
                            <Text style={gstyles.md_black_bold}>
                                <Text style={styles.flag}>| </Text>
                                当前单词书
                            </Text>
                            {plan.bookId &&
                                <View style={[{ width: '100%', paddingVertical: 5, paddingHorizontal: 10 }]}>
                                    <View style={[{ flex: 1 }, gstyles.r_between]}>
                                        <Text style={[{ flex: 1 }, gstyles.md_black]}>已学单词:
                                        <Text style={{ color: gstyles.emColor }}> {learnedWordCount}个</Text>
                                        </Text>
                                        <Text style={[{ flex: 1 }, gstyles.md_black]}>已掌握单词:
                                        <Text style={{ color: gstyles.emColor }}> {this.state.masteredWordCount}个</Text>
                                        </Text>
                                    </View>
                                    <View style={[{ flex: 1 }, gstyles.r_between]}>
                                        <Text style={[{ flex: 1 }, gstyles.md_black]}>总单词数:
                                        <Text style={{ color: gstyles.emColor }}> {plan.totalWordCount}个</Text>
                                        </Text>
                                        <Text style={[{ flex: 1 }, gstyles.md_black]}>学习天数:
                                        <Text style={{ color: gstyles.emColor }}> {plan.totalDays - leftDays + 1}天</Text>
                                        </Text>
                                    </View>
                                </View>
                            }
                            {!plan.bookId &&
                                <Text style={[gstyles.md_black, { paddingHorizontal: 10 }]}>暂无数据</Text>
                            }
                            <Text style={[gstyles.md_black_bold, { marginTop: 15 }]}>
                                <Text style={styles.flag}>| </Text>
                                累计学习
                            </Text>
                            <View style={[{ paddingVertical: 5, paddingHorizontal: 10 }]}>
                                <Text style={gstyles.md_black} >累计学习单词:
                                    <Text style={{ color: gstyles.emColor }}> {allLearnedCount}个</Text>
                                </Text>
                                <Text style={gstyles.md_black} >累计学习天数:
                                    <Text style={{ color: gstyles.emColor }}> {allLearnedDays}天</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* 打卡日历 */}
                    <View style={styles.itemView}>
                        <Text style={[gstyles.md_black_bold, { marginLeft: 10 }]}>
                            <Text style={styles.flag}>| </Text>
                            打卡日历
                        </Text>
                        <Calendar
                            // 月份数据
                            current={this._genCurDate()}
                            minDate={'2020-01-01'}
                            maxDate={'2090-01-30'}
                            onDayPress={(day) => { console.log('selected day', day) }}
                            onDayLongPress={(day) => { console.log('selected day', day) }}
                            // 日历标题格式
                            monthFormat={'yyyy年MM月'}
                            onMonthChange={(month) => { console.log('month changed', month) }}
                            hideArrows={false}
                            // 切换月份箭头
                            renderArrow={(direction) => {
                                if (direction == 'left') {
                                    return <AliIcon name='youjiantou-copy-copy' size={26} color={gstyles.secColor} />;
                                } else {
                                    return <AliIcon name='youjiantou' size={26} color={gstyles.secColor} />
                                }
                            }}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={false}
                            // 禁止切换月份
                            disableMonthChange={true}
                            // 从星期一开始
                            firstDay={1}
                            // 星期名
                            hideDayNames={false}
                            // 在左侧显示周数
                            showWeekNumbers={false}
                            onPressArrowLeft={substractMonth => substractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            //标记
                            markedDates={this.state.finishedDays}
                            // 日历样式
                            theme={{
                                textSectionTitleColor: '#2D4150',
                                dayTextColor: '#2D4150',
                                todayTextColor: gstyles.emColor,
                                selectedDayTextColor: '#FFF',
                                selectedDayBackgroundColor: '#30DE76', //完成打卡的
                            }}
                        />
                    </View>
                </ScrollView>
            </View >
        );
    }
}
