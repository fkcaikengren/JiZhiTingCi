import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TextInput, } from 'react-native';
import { CheckBox, Button } from 'react-native-elements'
import AliIcon from './AliIcon'
import gstyles from '../style';



/**
 * 关于CommonModal的展示模板
 */
export default class ErrorTemplate {

    static _renderErrroSelector({ commonModal, title, errorTypes, params, onSucceed }) {
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
                    <Text style={[gstyles.xl_black_bold, { marginTop: 30, marginBottom: 10 }]}>{title}</Text>
                </View >
                {
                    errorTypes.map((errType, i) => {
                        return <View style={[{ width: "100%" }, gstyles.c_center]}>
                            <View style={[{ width: "100%", height: 35, paddingHorizontal: 20 }, gstyles.r_between]}>
                                <Text style={gstyles.md_black}>{errType}</Text>
                                <CheckBox
                                    containerStyle={styles.checkDot}
                                    onPress={() => {
                                        let checkedIndex = getContentState().checkedIndex
                                        if (checkedIndex.includes(i)) {
                                            checkedIndex = checkedIndex.filter((item, _) => {
                                                if (item === i) {
                                                    return false
                                                } else {
                                                    return true
                                                }
                                            })
                                        } else {
                                            checkedIndex.push(i)
                                        }
                                        setContentState({
                                            checkedIndex: checkedIndex,
                                        })
                                    }}
                                    checked={
                                        getContentState().checkedIndex ? getContentState().checkedIndex.includes(i) : false
                                    }
                                    iconType='ionicon'
                                    checkedIcon='ios-checkmark-circle'
                                    uncheckedIcon='ios-radio-button-off'
                                    checkedColor={gstyles.secColor}
                                />
                            </View>
                        </View>
                    })
                }
                <TextInput
                    style={styles.errInputStyle}
                    multiline={true}
                    numberOfLines={3}
                    underlineColorAndroid="transparent"
                    value={getContentState().errDesc}
                    placeholder="错误信息描述"
                    onChangeText={(errDesc) => {
                        setContentState({ errDesc })
                    }}
                />
                < Button
                    title="提交"
                    buttonStyle={{
                        marginTop: 15,
                        width: 120,
                        backgroundColor: gstyles.emColor,
                    }}
                    onPress={async () => {
                        const errCodes = getContentState().checkedIndex
                        const errDesc = getContentState().errDesc
                        const requestParams = {
                            ...params,
                            errCodes,
                            errDesc,
                        }
                        if (errCodes && errCodes.length > 0) {

                            const res = await Http.post("/vocaError/create", requestParams)
                            if (res.status === 200) {
                                if (onSucceed) {
                                    onSucceed()
                                }
                                hide()
                            }
                        }
                    }} />
            </View >
        }

    }

    /**
     * @function 
     * @param {*} commonModal 
     */
    static show({
        commonModal, title, modalHeight, errorTypes, params, onSucceed
    }) {
        const {
            getContentState,
            setContentState,
            show
        } = commonModal
        setContentState({
            checkedIndex: [],
            errDesc: "",


        })
        show({
            renderContent: this._renderErrroSelector({ commonModal, title, errorTypes, params, onSucceed }), //函数
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
    checkDot: {
        margin: 0,
        padding: 0,
    },
    errInputStyle: {
        width: '90%',
        height: 80,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 6,
        fontSize: 16,
    }
});

