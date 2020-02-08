
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, } from 'react-native';
import { Button } from 'react-native-elements'
import Picker from '@gregfrench/react-native-wheel-picker'
import AliIcon from './AliIcon'
import gstyles from '../style';
import { LEFT_PLUS_DAYS } from '../features/vocabulary/common/constant';

const PickerItem = Picker.Item;
const planOptions = [{
    value: '新学10 复习50',
    learnCount: 10,
    reviewCount: 50,
    taskCount: 1,
},
{
    value: '新学14 复习70',
    learnCount: 14,
    reviewCount: 70,
    taskCount: 1,
},
{
    value: '新学20 复习100',
    learnCount: 20,
    reviewCount: 100,
    taskCount: 2,
},
{
    value: '新学26 复习130',
    learnCount: 26,
    reviewCount: 130,
    taskCount: 2,
},
{
    value: '新学36 复习180',
    learnCount: 36,
    reviewCount: 180,
    taskCount: 3,
},]


/**
 * 关于CommonModal的展示模板
 */
export default class PlanSelectTemplate {


    static _renderPlanSelector = ({ commonModal, book, onConfirm }) => {
        return () => {
            const {
                getContentState,
                setContentState,
                hide
            } = commonModal
            const { itemList, selectedItem } = getContentState()
            const { learnCount, reviewCount, taskCount } = itemList[selectedItem]
            const totalDays = Math.ceil(book.count / learnCount) + LEFT_PLUS_DAYS
            return <View style={[gstyles.c_start, { flex: 1, width: "100%" }]}>
                <View style={{ position: "absolute", top: 5, right: 5 }}>
                    <AliIcon name='guanbi' size={26} color='#555' onPress={() => {
                        hide()
                    }} />
                </View>
                <Text style={[gstyles.lg_black_bold, { marginTop: 40 }]}>
                    {book.name}
                </Text>
                <Text style={[gstyles.md_black, { marginTop: 10 }]}>
                    每日新学<Text style={styles.emFont}>{learnCount}</Text>词, 复习<Text style={styles.emFont}>{reviewCount}</Text>词
                </Text>
                <Text style={[gstyles.md_black, { marginTop: 5 }]}>
                    完成需要<Text style={styles.emFont}>{totalDays}</Text>天
                    </Text>
                <Picker style={{ width: "100%", height: 200, marginTop: 10, }}
                    selectedValue={selectedItem}
                    itemStyle={{ color: "#202020", fontSize: 20 }}
                    onValueChange={(index) => {
                        setContentState({
                            selectedItem: index,
                        })
                    }}>
                    {itemList.map((item, i) => (
                        <PickerItem label={item.value} value={i} key={"plan" + item.value} />
                    ))}
                </Picker>
                <Button
                    title="确定"
                    titleStyle={gstyles.lg_black}
                    containerStyle={{ width: 150, height: 60, marginTop: 10 }}
                    buttonStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderRadius: 50,
                    }}
                    onPress={() => {
                        hide()
                        onConfirm({
                            bookId: book._id,
                            taskCount: taskCount,
                            taskWordCount: learnCount,
                            reviewWordCount: reviewCount,
                            totalDays
                        })
                    }}
                />


            </View>


        }
    }


    /**
     * 显示分享模板
     * @param {*} commonModal 
     */
    static show({
        commonModal, book, onConfirm
    }) {
        const {
            setContentState,
            show
        } = commonModal
        setContentState({
            selectedItem: 2,
            itemList: planOptions
        })
        show({
            renderContent: this._renderPlanSelector({ commonModal, book, onConfirm }),
            modalStyle: {
                width: 300,
                height: 440,
                borderRadius: 10,
                backgroundColor: "#FFF",
            },
        })
    }
}

const styles = StyleSheet.create({
    emFont: {
        fontSize: 16,
        color: gstyles.emColor,
    }
});

