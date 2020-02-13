import React, { Component } from 'react'
import { Text, View, StyleSheet, Keyboard, Easing } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import gstyles from '../style';

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

const defaultState = {
    isOpen: false,
    renderContent: _ => null,
    modalStyle: {},
    contentState: {
        keyboardSpace: 0,
    },
    backdropPressToClose: false,
    position: "center",
    animationDuration: 400,
    easing: Easing.elastic(0.6),
    heightForListenKeyBoard: 0,

}

export default class CommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', (frames) => {
            if (!frames.endCoordinates) return;
            this.setContentState({ keyboardSpace: frames.endCoordinates.height });

        });
        Keyboard.addListener('keyboardDidHide', (frames) => {
            this.setContentState({ keyboardSpace: 0 });
        });
    }

    setContentState = (contentState) => {
        this.setState({
            contentState: {
                ...this.state.contentState, ...contentState
            }
        })
    }

    getContentState = () => {
        return this.state.contentState
    }
    show = ({ renderContent, modalStyle, animationDuration = 400, backdropPressToClose = false, position = "center", heightForListenKeyBoard = 0 }) => {
        this.setState({
            isOpen: true,
            renderContent,
            modalStyle,
            animationDuration,
            backdropPressToClose,
            position,
            heightForListenKeyBoard
        });
    }

    hide = () => {
        this.setState(defaultState);
    }


    render() {
        const { heightForListenKeyBoard } = this.state
        let preModalStyle = null
        const isListenKeyBoard = (heightForListenKeyBoard > 0)
        if (isListenKeyBoard) {
            preModalStyle = {
                position: "absolute",
                top: this.state.contentState.keyboardSpace ? -10 - this.state.contentState.keyboardSpace : -(height / 2) + (heightForListenKeyBoard / 2),
            }

        }

        return <Modal style={[gstyles.c_start, preModalStyle, this.state.modalStyle]}
            isOpen={this.state.isOpen}
            onOpened={() => { this.setState({ isOpen: true, }) }}
            onClosed={() => { this.setState({ isOpen: false, }) }}
            backdrop={true}
            backdropPressToClose={this.state.backdropPressToClose}
            swipeToClose={false}
            position={isListenKeyBoard ? "bottom" : this.state.position}
            animationDuration={this.state.animationDuration}
        >
            {this.state.renderContent(this.state.contentState)}
        </Modal>
    }
}



const styles = StyleSheet.create({
})
