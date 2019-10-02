import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text,TouchableWithoutFeedback, ScrollView, Image} from 'react-native';
import {Header,Button} from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './TipsStyle'

export default class TipsPage extends React.Component {
    constructor(props){
        super(props);
        this.state={

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
                        [1,2].map((item,index)=>{
                            return <TouchableWithoutFeedback onPress={()=>{
                                this.props.navigation.navigate('TipsDetail')
                            }}>
                                <View style={[gstyles.r_start, {paddingHorizontal:16, marginTop:20}]}>
                                    <Image style={styles.itemThumb} source={{uri:'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/resources/logo.png'}}/>
                                    <View style={[gstyles.c_start_left,styles.itemContent]}>
                                        <Text style={[{flex:1},gstyles.xl_black_bold]}>
                                            学习方法
                                        </Text>
                                        <Text style={[{flex:2,width: '85%'},gstyles.md_lightBlack]}>
                                            学错英语这么多年，原来这些方法更适合你
                                        </Text>
                                        <Text style={[{flex:1},gstyles.sm_lightGray]}>
                                            爱听词出品
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

