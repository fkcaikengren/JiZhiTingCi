import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';

import AliIcon from '../component/AliIcon';

const styles = StyleSheet.create({
    topView:{
        borderTopLeftRadius:5, borderTopRightRadius:5, backgroundColor:'#C0E5FF',
        padding:5,
    },
    bottomView:{
        borderBottomLeftRadius:5, borderBottomRightRadius:5,
        padding:5,

    },
    iconText:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'green',
        borderRadius:5,
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
});

/**
 *Created by Jacy on 19/05/22.
 */
export default class DetailCard extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }


    render(){
        return(
            <View style={{
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:5}}>

                <View style={styles.topView}>
                    <Text style={{color:'#FF9800'}}>1. </Text>
                    <Text >to leave someone, especially someone you are responsible for </Text>
                </View>

                <View style={styles.bottomView}>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>义</Text></View>
                        <Text>抛弃，遗弃〔某人〕</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>同</Text></View>
                        <Text>leave</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>短</Text></View>
                        <Text></Text>
                    </View>

                    <View style={styles.row}>
                        <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                        <Text>We had to abandon the car and walk the rest of the way.</Text>
                    </View>
                    <View style={styles.row}>
                        <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                        <Text>Fearing further attacks, most of the population had abandoned the city.</Text>
                    </View>
                </View>
            </View>
        );
    }
}