import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, } from 'react-native';
import { CheckBox, Button } from 'react-native-elements'

import AliIcon from '../../../component/AliIcon';
import gstyles from '../../../style';
import VocaDao from '../service/VocaDao';
import VocaGroupService from '../service/VocaGroupService';


/**
 * 关于CommonModal的展示模板
 */
export default class AddVocaTemplate {

    static _renderErrroSelector({ commonModal, title, groupName, onSucceed }) {
        // 返回一个函数
        return () => {
            const {
                getContentState,
                setContentState,
                hide,
            } = commonModal
            return <View style={[{ width: "100%" }, gstyles.c_center]}>
                <View style={[{ width: "100%" }, gstyles.c_center]}>
                    <View style={{ position: "absolute", top: 5, right: 5 }}>
                        <AliIcon name='guanbi' size={26} color='#555' onPress={() => {
                            hide()
                        }} />
                    </View>
                    <Text style={[gstyles.lg_black, { marginTop: 30 }]}>{title}</Text>
                </View >

                <TextInput
                    style={styles.addInputStyle}
                    multiline={true}
                    numberOfLines={200}
                    underlineColorAndroid="transparent"
                    value={getContentState().addContent}
                    placeholder="一行一个单词(不支持短语)"
                    onChangeText={(addContent) => {
                        setContentState({ addContent })
                    }}
                />
                <Text>{getContentState().addContent.split('\n').length}/200</Text>
                < Button
                    disabled={getContentState().disablePress}
                    title="确认添加"
                    buttonStyle={{
                        marginTop: 15,
                        width: 120,
                        backgroundColor: gstyles.emColor,
                    }}
                    onPress={() => {
                        setContentState({
                            disablePress: true
                        })
                        //获取所有词汇
                        const arr = getContentState().addContent.split('\n')
                        let vocas = []
                        for (let item of arr) {
                            item = item.trim()
                            if (item) {
                                vocas.push(item)
                            }
                        }
                        // 去重
                        vocas = [...new Set(vocas)]
                        console.log(vocas)
                        // 开始添加
                        const groupWords = []
                        const notFoundWords = []
                        for (let voca of vocas) {
                            const wordInfo = voca.includes(' ') ? null : VocaDao.getInstance().lookWordInfo(voca)
                            if (wordInfo && wordInfo.word) {
                                groupWords.push({
                                    word: wordInfo.word,
                                    enPhonetic: wordInfo.en_phonetic ? wordInfo.en_phonetic : wordInfo.phonetic,
                                    enPronUrl: wordInfo.en_pron_url ? wordInfo.en_pron_url : wordInfo.pron_url,
                                    amPhonetic: wordInfo.am_phonetic ? wordInfo.am_phonetic : wordInfo.phonetic,
                                    amPronUrl: wordInfo.am_pron_url ? wordInfo.am_pron_url : wordInfo.pron_url,
                                    translation: wordInfo.translation
                                })
                            } else {
                                notFoundWords.push(voca)
                            }
                        }
                        const results = new VocaGroupService().batchAddWords(groupWords, groupName)
                        const showText = notFoundWords.length > 0 ? `未添加${notFoundWords.length}词 ：${notFoundWords.join(', ')}。` : '无添加失败。'
                        Alert.alert('结果', `成功添加${results.length}词, ${showText}`);
                        if (onSucceed) {
                            onSucceed()
                        }
                        hide()
                    }} />
            </View >
        }

    }

    /**
     * @function 
     * @param {*} commonModal 
     */
    static show({
        commonModal, title, modalHeight, groupName, onSucceed
    }) {
        const {
            setContentState,
            show
        } = commonModal
        setContentState({
            disablePress: false,
            addContent: ''
        })
        show({
            renderContent: this._renderErrroSelector({ commonModal, title, groupName, onSucceed }), //函数
            modalStyle: {
                width: 300,
                height: modalHeight,
                backgroundColor: "#FFF",
                borderRadius: 10,
            },
            heightForListenKeyBoard: modalHeight,
            //动画
            animationDuration: 1
        })
    }
}

const styles = StyleSheet.create({
    addInputStyle: {
        width: '90%',
        height: 250,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 6,
        fontSize: 16,
        textAlignVertical: 'top'
    }
});

