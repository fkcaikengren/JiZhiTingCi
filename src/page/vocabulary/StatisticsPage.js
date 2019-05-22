import React, { Component } from "react";
import {StyleSheet, StatusBar} from 'react-native';
import { Container, Header, Text, View, Body,Title,Button} from "native-base";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import AliIcon from '../../component/AliIcon';

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
            <Container>
                <StatusBar
                    translucent={true}
                    // hidden
                />

                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#77A3F0'}}></View>
                {/* 头部 */}
                <Header translucent noLeft noShadow style={{backgroundColor:'#FDFDFD', elevation:0,}}>
                    <Button transparent style={{position:'absolute', left:10}}>
                        <AliIcon name='fanhui' size={26} color='#1890FF' onPress={()=>{
                            this.props.navigation.goBack();
                        }}></AliIcon>
                    </Button>
                    <Body style={{flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',}}>
                        <Text style={{fontSize:16, color:'#1890FF', fontWeight:'500'}}>打卡日历</Text>
                    </Body>
                    <Button transparent style={{position:'absolute', right:10}}>
                        <AliIcon name='fenxiang' size={26} color='#1890FF'></AliIcon>
                    </Button>
                </Header> 
                
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

            </Container>
        );
    }
}
