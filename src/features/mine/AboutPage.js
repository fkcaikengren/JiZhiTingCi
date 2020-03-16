import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, ScrollView, BackHandler } from 'react-native';
import { Header, Button } from 'react-native-elements'

import DashSecondLine from '../../component/DashSecondLine'
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import _util from '../../common/util';

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            public: "爱听词", //微信公众号
            qqs: ['970652747'],    //QQ群
            about: ""   //关于我们介绍
        }
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        // 加载数据
        this._init()
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = () => {
        _util.checkNet(async () => {
            const res = await Http.get("/appinfo/getContack")
            if (res.status === 200) {
                this.setState(res.data)
            }
        })
    }

    render() {
        return (
            <View style={[{ flex: 1 }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '联系我们', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <ScrollView
                    style={{ flex: 1 }}
                    containerStyle={{ flex: 1 }}
                    contentContainerStyle={[gstyles.c_start, { flex: 1 }]}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[gstyles.c_center, { marginTop: 50, marginBottom: 50 }]}>
                        <Text style={gstyles.md_lightBlack}>请关注微信公众号</Text>
                        <Text style={{ fontSize: 16, color: '#30DE76', fontWeight: "bold" }}>
                            "{this.state.public}"
                        </Text>
                        <Text style={[gstyles.md_lightBlack, { marginTop: 15 }]}>加入官方QQ群</Text>
                        {
                            this.state.qqs.map((qq, i) => {
                                return <Text style={{ fontSize: 16, color: '#3EC6FB' }}>{qq}</Text>
                            })
                        }
                    </View>
                    <View style={[gstyles.r_center]}>
                        <DashSecondLine backgroundColor='#888' len={50} width={'90%'} />
                    </View>
                    <View style={[gstyles.c_center, { padding: 12, marginTop: 5 }]}>
                        <Text style={gstyles.md_black_bold}>关于我们</Text>
                        <Text style={{ fontSize: 15, color: '#333', marginTop: 20, lineHeight: 20 }}>
                            {this.state.about}
                        </Text>
                    </View>

                </ScrollView>
                <View style={[gstyles.c_center, { width: "100%", position: 'absolute', left: 0, bottom: 10 }]}>
                    <Text>Copyright©2020</Text>
                    <Text>奇思妙听科技 版权所有</Text>
                </View>
            </View >
        );
    }
}

