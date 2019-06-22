import React, {Component} from 'react';
import {Platform, StyleSheet,View, Text, Image} from 'react-native';
import PropType from 'prop-types'


import {bkCover1} from '../image'
import { BoxShadow } from 'react-native-shadow';

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingHorizontal:10
    },
    img:{
        width:90,
        height:120,
        borderRadius:2,
    },
    enName:{
        color:'#303030', 
        fontSize:16
    },
    zhName:{
        fontWeight:'500', 
        color:'#303030', 
        fontSize:16
    },
    zhAuthor:{
        fontSize:14
    },
    intro:{
        fontSize:14
    }

})

export default class ColBook extends Component{
    constructor(props){
        super(props)
        
    }

    static propTypes = {
        book:PropType.object.isRequired,
    }
    
    static defaultProps = {
        horizontal:false,
    }

    // cover, name, author, intro
    render(){
        const {book } = this.props;
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
                    flex:1,
                    flexDirection:'column',
                    justifyContent:'flex-start',
                    alignItems:'flex-start',
                    width:90,
                    paddingLeft:10
                }}>
                    {/* 书的英文名 */}
                    <Text numberOfLines={2} style={styles.enName}>{book.enName}</Text>
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



