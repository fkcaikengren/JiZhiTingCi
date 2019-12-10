import React, { Component } from 'react';
import { View } from "react-native";
import gstyles from "../style";
const Spinner = require('react-native-spinkit');


export const CircleLoader = <View style={{
    padding: 10
}}>
    <Spinner
        isVisible={true}
        size={50}
        type={'Circle'}
        color={gstyles.mainColor}
    />
</View>



export default class Loader extends Component {

    render() {
        return <View style={[
            { width: 100, height: 100, backgroundColor: '#30303099', borderRadius: 10 },
            gstyles.r_center
        ]}>
            <Spinner
                isVisible={true}
                size={60}
                type={'Circle'}
                color={gstyles.mainColor}
            />
        </View>


    }
}