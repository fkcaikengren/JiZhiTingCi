import React, { Component } from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements'

import DashSecondLine from './DashSecondLine'
import gstyles from '../style'


export default class ConfirmModal extends Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            isOpen: false,
            title: '',
            cancelText: '取消',
            confirmText: '确认',
            onCancel: null,
            onConfirm: null,
        }
        this.state = {
            ...this.defaultState
        }
    }


    show = (title, onCancel = null, onConfirm = null, cancelText = "取消", confirmText = "确定") => {
        this.setState({ isOpen: true, title, cancelText, confirmText, onCancel, onConfirm })
    }

    _onCancel = () => {
        this.setState(this.defaultState);
        if (this.state.onCancel) {
            this.state.onCancel()
        }
    }

    _onConfirm = () => {
        this.setState(this.defaultState);
        if (this.state.onConfirm) {
            this.state.onConfirm()
        }
    }

    _openModal = () => {
        this.setState({ isOpen: true });
    }

    _closeModal = () => {
        this.setState({ isOpen: false });
    }

    render() {
        return <Modal style={[styles.modal, gstyles.c_start]}
            isOpen={this.state.isOpen}
            onOpened={this._openModal}
            onClosed={this._closeModal}
            backdrop={true}
            backdropPressToClose={false}
            swipeToClose={false}
            position={'center'}
            animationDuration={1}
        >
            <View style={[gstyles.c_center, { height: '69%', paddingHorizontal: 10 }]}>
                <Text style={[gstyles.lg_black_bold]}>
                    {this.state.title}
                </Text>
            </View>
            <DashSecondLine backgroundColor='#AAA' len={20} width={'100%'} />
            <View style={[styles.modalBtnGroup, gstyles.r_around]}>
                <Button type='clear' onPress={this._onCancel}
                    title={this.state.cancelText}
                    titleStyle={gstyles.lg_gray}
                    containerStyle={{ flex: 1 }}>
                </Button>
                <View style={{ width: 1, height: 30, backgroundColor: '#AAA' }} />
                <Button type='clear' onPress={this._onConfirm}
                    title={this.state.confirmText}
                    titleStyle={[gstyles.lg_black, { color: gstyles.secColor }]}
                    containerStyle={{ flex: 1 }} >
                </Button>
            </View>
        </Modal>

    }

}

const styles = StyleSheet.create({
    modal: {
        width: '70%',
        height: 150,
        backgroundColor: "#FFF",
        borderRadius: 12,
    },
    modalBtnGroup: {
        flex: 1,
        height: '30%',
    },
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
    }
})

