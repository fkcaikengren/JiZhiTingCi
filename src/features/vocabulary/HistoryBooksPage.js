import React, { Component } from "react";
import { BackHandler, StyleSheet, ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { Header } from "react-native-elements";
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";

import CardView from 'react-native-cardview'

const styles = StyleSheet.create({
    bookView: {
        width: '100%',
        paddingVertical: 15,
    },
    imgCard: {
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 20,
    },
    img: {
        width: 70,
        height: 100,
    },
    bookContent: {
        flex: 1,
        height: 100,
        paddingRight: 10,
        marginBottom: 10,
    },
    bookname: {
        flex: 4,
        fontSize: 16,
        color: '#303030',
        fontWeight: '500',
    },
    note: {
        flex: 6,
        fontSize: 13,
        textAlignVertical: "center"
    },

    wordCount: {
        fontSize: 14,
        color: '#444'
    },
});

export default class HistoryBooksPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vocaBooks: []
        }
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        //初始化
        this._init()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = async () => {
        const finishedBooks = await Storage.load({
            key: 'finishedBooks',
        });
        if (finishedBooks && finishedBooks.length > 0) {
            const res = await Http.post('/vocaBook/getByIds', {
                ids: finishedBooks
            })
            if (res.status === 200) {
                this.setState({ vocaBooks: res.data })
            }
        }
    }

    render() {
        const hasData = this.state.vocaBooks && this.state.vocaBooks.length > 0
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}
                    centerComponent={{ text: '已学的单词书', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                {/* 学习统计 */}
                {hasData &&
                    <ScrollView
                        containerStyle={{ flex: 1 }}
                        contentContainerStyle={[gstyles.c_start, { backgroundColor: '#FFF' }]}
                        pagingEnabled={false}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this.state.vocaBooks.map((item, _) => {
                                return <View style={[gstyles.r_start_top, styles.bookView]} >
                                    <CardView
                                        cardElevation={5}
                                        cardMaxElevation={5}
                                        style={styles.imgCard}
                                    >
                                        <Image source={{ uri: item.coverUrl }} style={styles.img} />
                                    </CardView>
                                    <View style={[styles.bookContent, gstyles.c_between_left]}>
                                        <View style={[{ height: '70%' }, gstyles.c_start_left]}>
                                            <Text style={styles.bookname}>{item.name}</Text>
                                            <Text numberOfLine={2} style={styles.note}>{item.desc}</Text>

                                        </View>
                                        <Text style={styles.wordCount}>共<Text style={[styles.wordCount, { color: '#F29F3F' }]}>{item.count}</Text>个单词</Text>
                                    </View>
                                </View>

                            })
                        }
                    </ScrollView>
                }
                {!hasData &&
                    <View style={[gstyles.c_center, { flex: 1 }]}>
                        <AliIcon name={'no-data'} size={100} color={gstyles.gray} />
                        <Text style={gstyles.md_gray}>暂无学过的单词书</Text>
                    </View>
                }
            </View >
        );
    }
}
