
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, } from 'react-native';
import { Button } from 'react-native-elements'
import Picker from '@gregfrench/react-native-wheel-picker'
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style';
import { LEFT_PLUS_DAYS } from '../common/constant';
import { store } from '../../../redux/store';
import VocaTaskService from '../service/VocaTaskService';

const PickerItem = Picker.Item;
const planOptions = [{
    value: '新学10 复习50',
    learnCount: 10,
    reviewCount: 50,
    taskCount: 1,
    taskWordCount: 10,
},
{
    value: '新学14 复习70',
    learnCount: 14,
    reviewCount: 70,
    taskCount: 1,
    taskWordCount: 14,
},
{
    value: '新学20 复习100',
    learnCount: 20,
    reviewCount: 100,
    taskCount: 2,
    taskWordCount: 10,
},
{
    value: '新学26 复习130',
    learnCount: 26,
    reviewCount: 130,
    taskCount: 2,
    taskWordCount: 13,
},
{
    value: '新学36 复习180',
    learnCount: 36,
    reviewCount: 180,
    taskCount: 3,
    taskWordCount: 12,
},]


/**
 * 关于CommonModal的展示模板
 */
export default class PlanSelectTemplate {


    static _renderPlanSelector = ({ commonModal, book, onConfirm, isModifyPlan }) => {
        return () => {
            const {
                getContentState,
                setContentState,
                hide
            } = commonModal
            const { itemList, selectedItem } = getContentState()
            const { learnCount, reviewCount, taskCount, taskWordCount } = itemList[selectedItem]
            let totalDays = Math.ceil(book.count / learnCount) + LEFT_PLUS_DAYS
            let leftDays = 0
            if (isModifyPlan) {
                leftDays = new VocaTaskService().countLeftDays(taskCount, taskWordCount)
                const { plan } = store.getState()
                totalDays = leftDays + (plan.plan.totalDays - plan.leftDays)
                console.log('----修改计划后，leftDays:' + leftDays)
                console.log('-----修改计划后，totalDays:' + totalDays)
            }
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
                        let params = {
                            bookId: book._id,
                            taskCount: taskCount,
                            taskWordCount: taskWordCount,
                            reviewWordCount: reviewCount,
                            totalDays
                        }
                        if (isModifyPlan) {
                            params = {
                                taskCount: taskCount,
                                taskWordCount: taskWordCount,
                                reviewWordCount: reviewCount,
                                totalDays,
                                leftDays
                            }
                            //计划不变
                            const { plan } = store.getState().plan
                            if (learnCount === plan.taskCount * plan.taskWordCount) {
                                return
                            }
                        }
                        console.log(params)
                        onConfirm(params)
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
        commonModal, book, learnCount = 0, onConfirm, isModifyPlan = false
    }) {
        const {
            setContentState,
            show
        } = commonModal
        //判断selectedItem
        let i = 0
        let selectedItem = 0
        if (learnCount > 0) {
            for (let option of planOptions) {
                if (option.learnCount === learnCount) {
                    selectedItem = i
                }
                i++
            }
        }
        setContentState({
            selectedItem: selectedItem,
            itemList: planOptions
        })
        show({
            renderContent: this._renderPlanSelector({ commonModal, book, onConfirm, isModifyPlan }),
            modalStyle: {
                width: 300,
                height: 440,
                borderRadius: 10,
                backgroundColor: "#FFF",
            },
            //动画
            animationDuration: 200
        })
    }
}

const styles = StyleSheet.create({
    emFont: {
        fontSize: 16,
        color: gstyles.emColor,
    }
});

