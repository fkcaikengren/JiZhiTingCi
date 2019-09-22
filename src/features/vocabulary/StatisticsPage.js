import React, { Component } from "react";
import {StyleSheet, StatusBar, Text, View,} from 'react-native';
import {Header} from "react-native-elements";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
    center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    
});


export default class StatisticsPage extends Component {

    render() {
        return (
            <View>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    leftComponent={//返回
                        <AliIcon name='fanhui' size={26} color='#555' onPress={()=>{
                        }}/> }
                    centerComponent={{ text: '打卡日历', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: '#FCFCFC00',
                        borderBottomColor: '#FCFCFC00',
                    }}
                />
                {/* 日历 */}

                <Calendar
                // 月份数据
                current={'2019-03-01'}
                minDate={'2019-01-01'}
                maxDate={'2019-05-30'}
                onDayPress={(day) => {console.log('selected day', day)}}
                onDayLongPress={(day) => {console.log('selected day', day)}}
                // 日历标题格式
                monthFormat={'yyyy年MM月'}
                onMonthChange={(month) => {console.log('month changed', month)}}
                hideArrows={false}
                // 切换月份箭头
                renderArrow={(direction) => {
                    if(direction == 'left'){
                        return <AliIcon name='youjiantou-copy-copy' size={26} color='#1890FF'></AliIcon>;
                    }else{
                        return <AliIcon name='youjiantou' size={26} color='#1890FF'></AliIcon>;
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
                markingType={'custom'}
                //标记
                markedDates={{
                    
                    '2019-05-17': {selected: true, },
                    '2019-05-18': {selected: true, },
                    '2019-05-19': {
                        customStyles: {
                            container: {
                              backgroundColor: '#FF6161'
                            },
                            text: {
                              color: '#FFF',
                            },
                        },
                    },
                    '2019-05-20': {selected: true, },
                    
                }}
                  // 日历样式
                theme={{
                    calendarBackground: '#FDFDFD',
                    textSectionTitleColor: '#2D4150',
                    dayTextColor: '#2D4150',
                    todayTextColor: '#F79131',
                    selectedDayTextColor: '#FFF',
                    selectedDayBackgroundColor: '#1890FF', //完成打卡的
                }}
                />

            </View>
        );
    }
}
