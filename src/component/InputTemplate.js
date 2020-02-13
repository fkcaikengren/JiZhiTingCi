import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TextInput, } from 'react-native';
import { Button } from 'react-native-elements'
import gstyles from '../style';
import DashSecondLine from './DashSecondLine';

/**
 * 关于CommonModal的展示模板
 */
export default class InputTemplate {

    static _renderInputer({ commonModal, title, placeholder, onCancel = null, onConfirm = null }) {
        // 返回一个函数
        return () => {
            const {
                getContentState,
                setContentState,
                hide,
            } = commonModal
            return <View style={[{ width: "100%" }, gstyles.c_center]}>

                <View style={[gstyles.c_center, { height: '70%', width: "100%" }]}>
                    <Text style={[gstyles.lg_black_bold]}>
                        {title}
                    </Text>
                    <TextInput
                        style={styles.inputStyle}
                        value={getContentState().name}
                        placeholder={placeholder}
                        onChangeText={(name) => {
                            setContentState({ name })
                        }}
                        autoFocus
                    />
                </View>
                <DashSecondLine backgroundColor='#AAA' len={20} width={'100%'} />
                <View style={[{ width: '80%', height: '29%' }, gstyles.r_around]}>
                    <Button type='clear' onPress={() => {
                        hide()
                        if (onCancel) {
                            onCancel(getContentState().name)
                        }
                    }}
                        title='取消'
                        titleStyle={gstyles.lg_gray}>
                    </Button>
                    <View style={{ width: 1, height: 30, backgroundColor: '#AAA' }} />
                    <Button type='clear' onPress={() => {
                        hide()
                        if (onConfirm) {
                            onConfirm(getContentState().name)
                        }
                    }}
                        title='确定'
                        titleStyle={gstyles.lg_black}
                    >
                    </Button>
                </View>

            </View >
        }

    }

    /**
     * @function 
     * @param {*} commonModal 
     */
    static show({
        commonModal, modalHeight, title, placeholder, onCancel, onConfirm
    }) {
        const {
            getContentState,
            setContentState,
            show
        } = commonModal
        setContentState({
            name: "",

        })
        show({
            renderContent: this._renderInputer({ commonModal, title, placeholder, onCancel, onConfirm }), //函数
            modalStyle: {
                width: 260,
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
    inputStyle: {
        height: 40,
        width: '60%',
        fontSize: 16,
        color: '#555',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 16,
    },

});

