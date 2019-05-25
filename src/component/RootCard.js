import React, { Component } from "react";
import {StyleSheet, View, Text} from 'react-native';

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
        width:36,
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
    col:{
        width: '100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingLeft:20,
        borderBottomWidth:1,
        borderColor:'#F0F0F0',
        paddingVertical:10,

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
    wordFonts:{
        fontSize:16,
        color:'#1890FF',
        lineHeight:24,
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
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>单词</Text></View>
                        <Text style={styles.keyFonts}>abandon</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>记忆</Text></View>
                        <Text style={styles.keyFonts}>a 不+ban+don 给予=不禁止给出去=放弃</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>释义</Text></View>
                        <Text style={styles.keyFonts}>v 抛弃,放弃</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>词根</Text></View>
                        <Text style={styles.keyFonts}>ban=prohibit,表示“禁止”</Text>
                    </View>

                </View>

                {/* 卡片下半部分 */}
                <View style={styles.bottomView}>
                    <View style={styles.col}>
                        <Text style={styles.wordFonts}>banal</Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>ban+al=被禁止的=陈腐的 </Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>a 平庸的,陈腐的</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.wordFonts}>banal</Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>ban+al=被禁止的=陈腐的 </Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>a 平庸的,陈腐的</Text>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.wordFonts}>banish</Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>ban+ish 表动词=禁止入境=驱逐 </Text>
                        <AliIcon name='xiangxiajiantou' size={16} color='green'></AliIcon>
                        <Text style={styles.fonts}>v 流放,驱逐出境</Text>
                    </View>
                    
                </View>
            </View>
        );
    }
}