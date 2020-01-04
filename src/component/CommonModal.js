import React, { Component } from 'react'
import { Text, View, StyleSheet, } from 'react-native';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import gstyles from '../style';

const defaultState = {
    isOpen: false,
    renderContent: _ => null,
    modalStyle: {},
    contentState: {},
}

export default class CommonModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = defaultState
    }

    setContentState = (contentState) => {
        this.setState({
            contentState: {
                ...this.state.contentState, ...contentState
            }
        })
    }
    show = ({ renderContent, modalStyle }) => {
        this.setState({ isOpen: true, renderContent, modalStyle });
    }

    hide = () => {
        this.setState(defaultState);
    }

    render() {
        return <Modal style={[gstyles.c_start, this.state.modalStyle]}
            isOpen={this.state.isOpen}
            onOpened={() => { this.setState({ isOpen: true, }) }}
            onClosed={() => { this.setState({ isOpen: false, }) }}
            backdrop={true}
            backdropPressToClose={true}
            swipeToClose={false}
            position={'center'}
            animationDuration={1}
        >
            {this.state.renderContent(this.state.contentState)}
        </Modal>
    }
}


const styles = StyleSheet.create({
})
