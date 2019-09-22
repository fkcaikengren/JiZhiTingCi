import React, {Component} from 'react';
import {Platform, StatusBar,StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback} from 'react-native';
import {PropTypes} from 'prop-types';
import {Grid, Row, Col} from 'react-native-easy-grid'
import VocaDao from 
export default class LookWordBoard extends Component{

    constructor(props){
        super(props);
        this.state={
            isOpen : false,
            wordInfo : null
        }
    }
    
    
    lookWord = (text)=>{
        alert(text)
        const reg = /[a-z]+[\-’]?[a-z]*/i
        const res = text.match(reg)
        if(res[0] && res[0]){
            VocaDao.getInstance()
            this.setState({isOpen:true})
            return true
        }
    }

    render(){
        return <Modal style={gstyles.modal}
            isOpen={this.state.isOpen} 
            onClosed={this._closeWordBoard}
            onOpened={this._openWordBoard}
            backdrop={true} 
            backdropPressToClose={true}
            swipeToClose={true}
            position={"bottom"} 
            ref={ref => {
                this.wordBoard = ref
            }}>
            <View>

            </View>
        
        </Modal>
    }
}
