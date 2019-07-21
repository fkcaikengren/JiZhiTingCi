import React, { Component } from "react";
import {StyleSheet, StatusBar, View, Text, TouchableHighlight} from 'react-native';
import {PropTypes} from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {playSound} from '../service/AudioFetch'


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
        lineHeight:30,
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
    }


    

    render(){
        const {defInfo, order} = this.props
        console.log('defInfo:');
        console.log(defInfo);
        return(
            <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: '#FDFDFD',
            marginBottom:20
            }}>

                {/* 卡片上半部分 */}
                <View style={styles.topView}>
                    
                    <Text style={styles.fonts}><Text style={{color:'#FF9800'}}>{order}. </Text>{defInfo.def}</Text>
                </View>

                {/* 卡片下半部分 */}
                <View style={styles.bottomView}>
                    <View style={styles.row}>
                        <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>义</Text></View>
                        <Text style={styles.keyFonts}>{defInfo.defTran}</Text>
                    </View>
                    {defInfo.syn !== undefined && defInfo.syn !=='' && 
                        <View style={styles.row}>
                            <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>同</Text></View>
                            <Text style={styles.keyFonts}>{defInfo.syn}</Text>
                        </View>
                    }
                    {defInfo.phrase!==undefined && defInfo.phrase!=='' &&
                        <View style={styles.row}>
                            <View style={styles.iconText}><Text style={{color:'#FFF',fontSize:14}}>短</Text></View>
                            <Text style={styles.keyFonts}>{defInfo.phrase}</Text>
                        </View>
                    }
                    


                    {defInfo.sentences!==undefined &&
                        defInfo.sentences.map((senInfo, index)=>{
                            return (
                                <Text numberOfLines={3} key={index} style={[styles.fonts, styles.sen,]}>
                                    <MaterialIcons name='volume-up' size={24} color='#3F51B5'  onPress={()=>{
                                        console.log(senInfo.sentence_pron_url)
                                        playSound(senInfo.sentence_pron_url)
                                    }}/>
                                    {senInfo.sentence}
                                </Text>
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