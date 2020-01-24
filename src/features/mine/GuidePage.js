import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { Header, Button } from 'react-native-elements'

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    itemThumb: {
        width: 120,
        height: 100,
        borderRadius: 3,
    },
    itemContent: {
        width: width - 120,
        marginHorizontal: 10
    }

});

export default class GuidePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guides: []
        }
    }

    componentDidMount() {
        this._init()
    }

    _init = async () => {
        const res = await Http.get("/guide/list")
        if (res.status === 200) {
            this.setState({
                guides: res.data
            })
        }

    }

    render() {
        return (
            <View style={[{ flex: 1, width: '100%' }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '攻略', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <ScrollView style={{ flex: 1 }}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={gstyles.scrollView}
                    contentContainerStyle={gstyles.scrollViewContent}
                >
                    {
                        this.state.guides.map((item, index) => {
                            return <TouchableWithoutFeedback onPress={() => {
                                this.props.navigation.navigate('GuideDetail', {
                                    title: item.title,
                                    url: item.contentUrl
                                })
                            }}>
                                <View style={[gstyles.r_start, { paddingHorizontal: 16, marginTop: 20 }]}>
                                    <Image style={styles.itemThumb} source={{ uri: item.thumbUrl }} />
                                    <View style={[gstyles.c_start_left, styles.itemContent]}>
                                        <Text style={[{ flex: 1 }, gstyles.xl_black_bold]}>
                                            {item.title}
                                        </Text>
                                        <Text style={[{ flex: 2, width: '85%' }, gstyles.md_lightBlack]}>
                                            {item.intro}
                                        </Text>
                                        <Text style={[{ flex: 1 }, gstyles.sm_lightGray]}>
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

