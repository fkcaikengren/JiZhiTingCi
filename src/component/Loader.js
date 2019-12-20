import React, { Component } from 'react';
import { View, Text } from "react-native";
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


export class CountDownLoader extends Component{
    constructor(props){
        super(props)
        this.state = {
            timeCount: 7
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    
    countDown = (num) => {
        this.setState({ timeCount: num })
        this.timer = setInterval(()=>{
            if (this.state.timeCount === 0) { //暂停
                this.timer && clearTimeout(this.timer);
            }else{                            //减1                   
                this.setState({ timeCount: this.state.timeCount - 1 })
            }
        },1000)
    }

    render(){
        return <View style={[gstyles.loadingView]}>
        <View>
            <Spinner
                isVisible={true}
                size={100}
                type={'ThreeBounce'}
                color={gstyles.emColor}
            />
            <Text style={gstyles.md_black}>{`计划生成中 ${this.state.timeCount}..`}</Text>
        </View>
    </View>
    }
}