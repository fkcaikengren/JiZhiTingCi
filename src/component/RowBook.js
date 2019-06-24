import React, {Component} from 'react';
import {Platform, StyleSheet,View, Text, Image} from 'react-native';
import PropType from 'prop-types'


import {bkCover1} from '../image'
import { BoxShadow } from 'react-native-shadow';
import StarRating from './StarRating'
import AliIcon from './AliIcon'

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        paddingHorizontal:10
    },
    r_center:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    img:{
        width:90,
        height:120,
        borderRadius:2,
    },
    zhName:{
        fontWeight:'500', 
        color:'#303030', 
        fontSize:16
    },

    

})

export default class ColBook extends Component{
    constructor(props){
        super(props)
        this.state = {
            lines:1
        }
    }

    static propTypes = {
        book:PropType.object.isRequired,
        containerStyle: PropType.object,
        showAuthor: PropType.bool,
        showIntro: PropType.bool,
        feature: PropType.string,
        enNameSize: PropType.number,
        zhNameSize: PropType.number,
        zhAuthorSize: PropType.number,
        starSize: PropType.number,
        imgStyle: PropType.object,
    }
    
    static defaultProps = {
        showAuthor:true,
        showIntro:false,
        feature:null,
        enNameSize: 16,
        zhNameSize: 16,
        zhAuthorSize: 12,
        featureSize:12,
        starSize:12,
        imgStyle:{
            width:90,
            height:120,
            borderRadius:2,
        },
        containerStyle:{

        }
    }

    // cover, name, author, intro
    render(){
        const {book,showAuthor, enNameSize,zhNameSize, zhAuthorSize,starSize,
            imgStyle,containerStyle, feature, featureSize, showIntro} = this.props;
        lineHeight = enNameSize+4;
        const  shadowOpt= {
            width:imgStyle.width,
            height:imgStyle.height,
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
            
            <View style={[styles.container, containerStyle]}>
                <BoxShadow setting={shadowOpt}>
                    <Image source={bkCover1} style={imgStyle}/>
                </BoxShadow>

                <View style={{
                    flex:1,
                    height:imgStyle.height,
                    flexDirection:'column',
                    justifyContent:'flex-start',
                    alignItems:'flex-start',
                    paddingHorizontal:10,
                    paddingVertical:2,
                }}>
                    {/* 书的英文名 */}
                    <Text numberOfLines={2} 
                     onLayout={(e)=>{
                        if (e.nativeEvent.layout.height > lineHeight ) {  //多于一行时改为红色
                            this.setState({lines:2})
                        }
                      }}
                    style={[{fontSize:enNameSize,color:'#303030', lineHeight:lineHeight}]}
                    >{book.enName}</Text>
                    {/* 书的中文名 */}
                    <Text  numberOfLines={1}
                    style={[styles.zhName,{fontSize:zhNameSize}]}>{book.zhName}</Text>
                    {/* 作者中文名 */}
                    {showAuthor &&
                        <Text numberOfLines={1} style={[{fontSize:zhAuthorSize, color:'#AAA'}]}>{book.zhAuthor}</Text>
                    }
                    {feature && feature.length>0 &&
                        <Text numberOfLines={1} style={[{fontSize:featureSize, color:'#AAA'}]}>{feature}</Text>
                    }
                    <StarRating 
                        maxStars={5} // 最大星星数量
                        rating={4} // 当前星星数
                        selectStar={<AliIcon name='pingfen' size={starSize} color='#EFA625' />} // 选中图片
                        unSelectStar={<AliIcon name='malingshuxiangmuicon-' size={starSize} color='#AAA'/>} // 未选中图片
                    />

                    {showIntro &&
                        <Text numberOfLines={this.state.lines==1?2:1} style={{
                            fontSize:12, color:'#606060'}}>
                            {book.intro}
                        </Text>
                    }
                </View>
            </View>
            
        )
    }
}



