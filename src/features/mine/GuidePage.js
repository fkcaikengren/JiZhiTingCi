import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text,TouchableWithoutFeedback, ScrollView, Image} from 'react-native';
import {Header,Button} from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './GuideStyle'

export default class GuidePage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            guides : [
                {title:'单词学习秘方', intro:'学错英语这么多年，原来这些方法更适合你',
                    thumbUrl:'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/tip-1.jpg' ,
                    contentUrl:'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/tip_1.html',
                    note:'2019-5'
                },
                {title:'App攻略', intro:'结合这些方法使用App，效率提升100%',
                    thumbUrl:'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/tip-2.jpg' ,
                    contentUrl:'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/tip_1.html',
                    note:'2019-10'
                }
            ]
        }
    }

    componentDidMount(){
    }


    render(){
        return(
            <View style={[{flex:1, width:'100%'},gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }

                    centerComponent={{ text: '攻略', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <ScrollView style={{ flex: 1}}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={gstyles.scrollView}
                    contentContainerStyle={gstyles.scrollViewContent}
                >
                {
                    this.state.guides.map((item,index)=>{
                        return <TouchableWithoutFeedback onPress={()=>{
                            this.props.navigation.navigate('GuideDetail',{
                                title:item.title,
                                url:item.contentUrl
                            })
                        }}>
                            <View style={[gstyles.r_start, {paddingHorizontal:16, marginTop:20}]}>
                                <Image style={styles.itemThumb} source={{uri:item.thumbUrl}}/>
                                <View style={[gstyles.c_start_left,styles.itemContent]}>
                                    <Text style={[{flex:1},gstyles.xl_black_bold]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[{flex:2,width: '85%'},gstyles.md_lightBlack]}>
                                        {item.intro}
                                    </Text>
                                    <Text style={[{flex:1},gstyles.sm_lightGray]}>
                                        {item.note}
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    })
                }
                </ScrollView>

            </View>
        );
    }
}

