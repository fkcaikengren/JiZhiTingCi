


import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet} from 'react-native';
import QuestionTabNav from './navigation/QuestionTabNav'
import QuestionPage from './QuestionPage'

const StatusBarHeight = StatusBar.currentHeight;
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

/**
 *Created by Jacy on 19/08/09.
 */
export default class QuestionTabPage extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render(){
        return(
            <View style={{ flex:1, }}>
                <StatusBar translucent={true} />
                <View style={{width:width, height:StatusBarHeight, backgroundColor:'#1890FF'}}></View>
                <QuestionPage />
            </View>
        );
    }
}