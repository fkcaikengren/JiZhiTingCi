import React, { Component } from "react";
import {StyleSheet, View, Text} from 'react-native';
import {PropTypes} from 'prop-types';

import AliIcon from '../../../component/AliIcon';
import gstyles from '../../../style'

const styles = StyleSheet.create({
    topView:{
        width: '100%',
        borderTopLeftRadius:5, 
        borderTopRightRadius:5, 
        padding:5,
        borderBottomColor:'#E0E0E0',
        borderBottomWidth:1,

    },
    bottomView:{
        width: '100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        borderBottomLeftRadius:5, 
        borderBottomRightRadius:5,
        padding:5,
        backgroundColor:'#FFF'
        
    },
    iconView:{
        width:30,
        height:16,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F29F3F',
        borderRadius:2,
        marginRight: 10,
        marginTop:4,
        flex:1,
    },
    iconFont:{
        color:'#FFF',
        fontSize:12,
        lineHeight:16,
    },
    iconInfo:{
        fontSize:16,
        color:'#303030',
        flex:9,
    },
    col:{
        width: '100%',
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingLeft:20,
        borderBottomWidth:1,
        borderColor:'#F0F0F0',
        paddingVertical:5,

    },
    keyFonts:{
        fontSize:16,
        color:'#303030',
    },
    grayFont:{
        color:'#505050',
        fontSize:16,
    },
    wordFonts:{
        fontSize:16,
        color:'#F29F3F',
        lineHeight:24,
    }
});

/**
 *Created by Jacy on 19/05/22.
 */
export default class RootCard extends React.Component {
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
                    <View style={gstyles.r_start_top}>
                        <View style={styles.iconView}><Text style={styles.iconFont}>词根</Text></View>
                        <Text style={styles.iconInfo}>{this.props.wordRoot.root}</Text>
                    </View>
                    <View style={gstyles.r_start_top}>
                        <View style={styles.iconView}><Text style={styles.iconFont}>记忆</Text></View>
                        <Text style={[styles.iconInfo,styles.grayFont]}>{this.props.wordRoot.memory}</Text>
                    </View>
                    <View style={gstyles.r_start_top}>
                        <View style={styles.iconView}><Text style={styles.iconFont}>释义</Text></View>
                        <Text style={styles.iconInfo}>{this.props.wordRoot.tran}</Text>
                    </View>
                   

                </View>

                {/* 卡片下半部分 */}
                <View style={styles.bottomView}>
                   {
                       this.props.relativeRoots.map((item, i)=>{
                            return <View style={styles.col}>
                            <Text style={styles.wordFonts}>{item.word}</Text>
                            <AliIcon name='xiangxiajiantou' size={8} color='#FFE957'></AliIcon>
                            <Text style={styles.grayFont}>{item.memory}</Text>
                            <AliIcon name='xiangxiajiantou' size={8} color='#FFE957'></AliIcon>
                            <Text style={styles.keyFonts}>{item.tran}</Text>
                        </View>
                    })
                   }
                </View>
            </View>
        );
    }
}

RootCard.propTypes = {
    wordRoot:PropTypes.object.isRequired,
    relativeRoots:PropTypes.array.isRequired,
}
  
RootCard.defaultProps = {

}