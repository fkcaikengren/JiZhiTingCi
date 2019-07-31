import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableHighlight} from 'react-native';
import {PropTypes} from 'prop-types';
import AliIcon from '../../../component/AliIcon'
import {playSound} from '../service/AudioFetch'
import gstyles from '../../../style'
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFDFD',
        marginBottom:10
    },
    topView:{
        width: '100%',
        paddingHorizontal:10,
        paddingVertical:5,
        
    },
    bottomView:{
        width: '100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingHorizontal:10,
        paddingVertical:5,

    },
    orderNum:{
        color:'#F29F3F',
        fontWeight:'500',
        fontSize:16,
    },
    iconView:{
        width:16,
        height:16,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F29F3F',
        borderRadius:2,
        marginRight: 10,
    },
    iconText:{
        color:'#FFF',
        fontSize:12,
        lineHeight:13,
    },
    row:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginTop:10,
    },
    def:{
        fontSize:14,
        color:'#101010',
        lineHeight:26,
    },
    fonts:{
        fontSize:14,
        color:'#888',
        lineHeight:30,
    },
    keyFonts:{
        fontSize:14,
        color:'#101010',
        lineHeight:24,
    },
    sentence: {
        fontSize:14,
        color:'#888',
        lineHeight:22,
        
    },
    sentenceRow:{
        marginTop:5, 
        width:width-40,
    }
});

/**
 *Created by Jacy on 19/05/22.
 */
export default class DictCard extends React.Component {
    constructor(props){
        super(props);
    }


    

    render(){
        const {defInfo, order} = this.props
        console.log('defInfo:');
        console.log(defInfo);
        return(
            <View style={styles.container}>

                {/* 卡片上半部分 */}
                <View style={styles.topView}>
                    
                    <Text style={styles.def}><Text style={styles.orderNum}>{order}. </Text>{defInfo.def}</Text>
                </View>

                {/* 卡片下半部分 */}
                <View style={styles.bottomView}>
                    {defInfo.defTran !== undefined && defInfo.defTran !=='' && 
                        <View style={styles.row}>
                            <View style={styles.iconView}><Text style={styles.iconText}>义</Text></View>
                            <Text style={styles.keyFonts}>{defInfo.defTran}</Text>
                        </View>
                    }
                    {defInfo.syn !== undefined && defInfo.syn !=='' && 
                        <View style={styles.row}>
                            <View style={styles.iconView}><Text style={styles.iconText}>同</Text></View>
                            <Text style={styles.keyFonts}>{defInfo.syn}</Text>
                        </View>
                    }
                    {defInfo.phrase!==undefined && defInfo.phrase!=='' &&
                        <View style={styles.row}>
                            <View style={styles.iconView}><Text style={styles.iconText}>短</Text></View>
                            <Text style={styles.keyFonts}>{defInfo.phrase}</Text>
                        </View>
                    }
                    


                    {defInfo.sentences!==undefined &&
                        defInfo.sentences.map((senInfo, index)=>{
                            return (
                                <View style={[gstyles.r_start_top,styles.sentenceRow]}>
                                    <AliIcon name='shengyin' size={22} color='#888'
                                        style={{marginRight:5}}
                                        onPress={()=>{
                                        playSound(senInfo.sentence_pron_url)
                                    }}/>
                                    <Text key={index} style={styles.sentence}>
                                        {senInfo.sentence}
                                    </Text>
                                </View>
                               
                            )
                        })
                    }
                
                </View>
            </View>
        );
    }



    static propTypes = {
        defInfo:PropTypes.object.isRequired,
        order:PropTypes.string.isRequired,
    }

    static defaultProps = {
        defInfo:{},
        order:1
    }
}