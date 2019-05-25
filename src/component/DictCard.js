import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text} from 'react-native';

import AliIcon from './AliIcon';

const styles = StyleSheet.create({
    topView:{
        width: '100%',
        borderTopLeftRadius:5, 
        borderTopRightRadius:5, 
        backgroundColor:'#C0E5FF',
        padding:5,
    },
    bottomView:{
        width: '100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        borderBottomLeftRadius:5, 
        borderBottomRightRadius:5,
        padding:5,

    },
    iconText:{
        width:20,
        height:20,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'green',
        borderRadius:2,
        marginRight: 10,
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginTop:10,
    },
    fonts:{
        fontSize:16,
        color:'#404040',
        lineHeight:24,
    },
    keyFonts:{
        fontSize:16,
        color:'#101010',
        lineHeight:24,
    },
    sen: {
        marginTop: 16,
    }
});

/**
 *Created by Jacy on 19/05/22.
 */
export default class DictCard extends React.Component {
    constructor(props){
        super(props);
        this.state={}
    }


    render(){
        return(
            <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: '#FDFDFD',
            }}>

                {/* 卡片上半部分 */}
                <View style={styles.topView}>
                    
                    <Text style={styles.fonts}><Text style={{color:'#FF9800'}}>1. </Text>to leave someone, especially someone you are responsible for </Text>
                </View>

                {/* 卡片下半部分 */}
                <View style={styles.bottomView}>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>义</Text></View>
                        <Text style={styles.keyFonts}>抛弃，遗弃〔某人〕</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>同</Text></View>
                        <Text style={styles.keyFonts}>leave</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>短</Text></View>
                        <Text style={styles.keyFonts}></Text>
                    </View>

                        
                    <Text style={[styles.fonts, styles.sen]}>
                        <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                        We had to abandon the car and walk the rest of the way.
                    </Text>
                    
                    <Text style={[styles.fonts, styles.sen]}>
                        <AliIcon name='shengyin' size={26} color='#3F51B5' ></AliIcon>
                        Fearing further attacks, most of the population had abandoned the city.
                    </Text>
                </View>
            </View>
        );
    }
}