import React, {Component} from 'react';
import {Platform, StyleSheet,View, Text, Image} from 'react-native';
import PropType from 'prop-types'
import {BoxShadow} from 'react-native-shadow'

import {bkCover1} from '../image'

const styles = StyleSheet.create({
    container:{
        position:'relative',
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    img:{
        width:90,
        height:120,
        borderRadius:2,
        backgroundColor:'#999',
        elevation:10,
    },
    enName:{
        color:'#303030', 
        fontSize:16
    },
    zhName:{
        fontWeight:'500', 
        color:'#303030', 
        fontSize:14
    },
    zhAuthor:{
        fontSize:12
    },
})

export default class ColBook extends Component{
    constructor(props){
        super(props)
        
    }

    static propTypes = {
        book:PropType.object.isRequired,
        showEnName:PropType.bool,
    }
    
    static defaultProps = {
        horizontal:false,
        showEnName:false,
    }

    // cover, name, author, intro
    render(){
        const {book,showEnName, } = this.props;
        const  shadowOpt= {
            width:90,
            height:120,
            color:'#A0A0A0',
            border:0,
            radius:30,
            opacity:0.2,
			x:0,
			y:3,
            style:{marginVertical:5},
            inset:true
        }
    
 
        return (
            <View style={[styles.container]}>
                <BoxShadow setting={shadowOpt}>
                    <Image source={bkCover1} style={styles.img}/>
                </BoxShadow>
                
                <View style={{
                    flexDirection:'column',
                    justifyContent:'flex-start',
                    alignItems:'center',
                    width:90,
                }}>
                    {/* 书的英文名 */}
                    {showEnName &&
                        <Text numberOfLines={1} style={styles.enName}>{book.enName}</Text>
                    }
                    {/* 书的中文名 */}
                    <Text  numberOfLines={1}
                    style={[styles.zhName,]}>{book.zhName}</Text>
                    {/* 作者中文名 */}
                    <Text numberOfLines={1} style={styles.zhAuthor}>{book.zhAuthor}</Text>
                    
                </View>
            </View>
            
        )
    }
}



