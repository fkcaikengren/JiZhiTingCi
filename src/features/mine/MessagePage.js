import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, TouchableWithoutFeedback, ScrollView, Image, BackHandler } from 'react-native';
import { Header } from 'react-native-elements'
import { connect } from 'react-redux';
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import _util from '../../common/util';
import * as MineAction from './redux/action/mineAction'


const styles = StyleSheet.create({

    itemThumb: {
        width: '100%',
        height: 130,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    itemContent: {
        width: '100%',
        backgroundColor: '#FFF',
        height: 110,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    title: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontWeight: '500',
        fontSize: 18,
        color: '#888'
    },
    intro: {
        width: '100%',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#999'
    }

});

class MessagePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        this._init()
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = async () => {
        //没有数据，请求数据 #todo: 修改接口，每次请求带上第一个的时间戳
        const res = await Http.get("/message/list")
        if (res.status === 200) {
            this.props.addMessages({
                messages: res.data
            })
        }
    }



    render() {
        return (
            <View style={[{ flex: 1, width: '100%', }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '消息中心', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <ScrollView
                    containerStyle={{ flex: 1 }}
                    style={[{ width: '100%' }, { backgroundColor: '#F2F2F2' }]}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        this.props.messages.map((item, index) => {
                            return <View style={[{ paddingHorizontal: 20, marginTop: 20 }]}>
                                <Text style={[gstyles.md_gray, { width: '100%', textAlign: 'center', marginBottom: 10 }]}>
                                    {_util.formateTimestamp(item.createTime)[0]}
                                </Text>
                                <TouchableWithoutFeedback onPress={() => {
                                    this.props.navigation.navigate('MessageDetail', {
                                        title: item.title,
                                        url: item.contentUrl
                                    })
                                }}>
                                    <View style={[gstyles.c_start]}>
                                        <Image style={styles.itemThumb} source={{ uri: item.thumbUrl }} />
                                        <View style={[styles.itemContent, gstyles.c_start_left]}>
                                            <Text numberOfLines={1} style={styles.title}>
                                                {item.title}
                                            </Text>
                                            <Text numberOfLines={2} style={styles.intro}>
                                                {item.intro}
                                            </Text>
                                            <Text style={[{ fontSize: 14, color: '#999', position: 'absolute', right: 5, bottom: 10 }]}>
                                                {item.note}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        })
                    }
                </ScrollView>

            </View>
        );
    }
}


const mapStateToProps = state => ({
    messages: state.mine.messages
})

const mapDispatchToProps = {
    addMessages: MineAction.addMessages
}
export default connect(mapStateToProps, mapDispatchToProps)(MessagePage)