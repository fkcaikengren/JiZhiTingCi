import React, { Component } from 'react';
import { View, Text } from "react-native";
import gstyles from "../style";
const Spinner = require('react-native-spinkit');
import Toast, { DURATION } from 'react-native-easy-toast'

export default class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    show = (showText = null, duration = 3000) => {
        const CircleLoader = <View style={[gstyles.c_center, { width: 80, height: 80 }]}>
            <Spinner
                isVisible={true}
                size={50}
                type={'Circle'}
                color={gstyles.mainColor}
            />
            {showText &&
                <Text style={{ marginTop: 4, fontSize: 14, color: gstyles.mainColor }}>{showText}</Text>
            }
        </View>
        this.refs.toast.show(CircleLoader, duration)
    }
    close = () => {
        this.refs.toast.close()
    }

    render() {
        return (
            <Toast
                ref="toast"
                style={{ backgroundColor: '#303030' }}
                position='top'
                positionValue={240}
                fadeInDuration={0}
                fadeOutDuration={0}
                opacity={0.8}
                textStyle={{ color: '#fff' }}
            />
        );
    }
}