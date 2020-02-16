import React, { Component } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { Header, Button } from 'react-native-elements'
import CardView from 'react-native-cardview'
import { connect } from 'react-redux';
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import libStyles from './VocaLibStyle'
import styles from './VocaLibPayStyle'
import PayTemplate from "../../component/PayTemplate";


class VocaLibPayPage extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { isOpen, hide } = this.props.app.commonModal
            if (isOpen()) {
                hide()
            } else {
                this.props.navigation.goBack()
            }
            return true
        })
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')
    }

    render() {

        const book = this.props.navigation.getParam('book')
        const loadBooks = this.props.navigation.getParam('loadBooks')
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}

                    centerComponent={{ text: '爱听词', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        borderBottomColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <ScrollView
                    style={{ flex: 1, }}
                    pagingEnabled={false}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 词汇书 */}
                    <View style={[gstyles.r_start, libStyles.bookView]} >
                        <CardView
                            cardElevation={5}
                            cardMaxElevation={5}
                            style={libStyles.imgCard}
                        >
                            <Image source={{ uri: book.coverUrl }} style={libStyles.img} />
                        </CardView>

                        <View style={[libStyles.bookContent, gstyles.c_between_left]}>
                            <View style={[{ height: '70%' }, gstyles.c_start_left]}>
                                <Text style={libStyles.bookname}>{book.name}</Text>
                                <Text numberOfLine={2} style={libStyles.note}>{book.desc}</Text>
                                {book.price > 0 &&
                                    <Text style={libStyles.price}>{`￥${book.price.toFixed(2)}`}</Text>
                                }
                            </View>
                            <Text style={libStyles.wordCount}>共<Text style={[libStyles.wordCount, { color: '#F29F3F' }]}>{book.count}</Text>个单词</Text>
                        </View>

                    </View>
                    {/* 特点一 */}
                    <View style={[gstyles.c_start_left, styles.featureView]}>
                        <View style={[gstyles.r_start, styles.featureTab]}>
                            <AliIcon name='kaoshi' size={18} color={gstyles.emColor}></AliIcon>
                            <Text style={styles.tabFont}>高分必备</Text>
                        </View>
                        <View style={[gstyles.c_start_left, styles.featureBox]}>
                            <Text style={[styles.boxFont, { marginBottom: 10 }]}>
                                词组在历年高考真题中占比20~30分,该书收录了高中阶段出现的858个词组。
                            </Text>
                            <View style={[gstyles.r_start]}>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>account for </Text>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>对…负有责任/解释</Text>
                            </View>
                            <View style={[gstyles.r_start]}>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>turn into </Text>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>变成，进入</Text>
                            </View>

                            <View style={[gstyles.r_start]}>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>rise up </Text>
                                <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>上升，起义，叛变</Text>
                            </View>

                        </View>
                    </View>
                    <View style={[gstyles.c_start_left, styles.featureView]}>
                        <View style={[gstyles.r_start, styles.featureTab]}>
                            <AliIcon name='yingshi' size={18} color={gstyles.emColor}></AliIcon>
                            <Text style={styles.tabFont}>影视例句</Text>
                        </View>
                        <View style={[gstyles.c_start_left, styles.featureBox]}>
                            <Text style={styles.boxFont}>
                                精选影视中的例句，帮助你深入理解词组含义，学的更有趣、更轻松。
                             </Text>
                            <Image source={{ uri: "https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/vocabook/movie.png" }} style={styles.movieImg} />
                        </View>
                    </View>
                    <View style={[gstyles.c_start_left, styles.featureView]}>
                        <View style={[gstyles.r_start, styles.featureTab]}>
                            <AliIcon name='zhineng' size={18} color={gstyles.emColor}></AliIcon>
                            <Text style={styles.tabFont}>滚动复习</Text>
                        </View>
                        <View style={[gstyles.c_start_left, styles.featureBox]}>
                            <Text style={styles.boxFont}>
                                词组在历年高考中占比10%~20%,在近10年的真题中，xxxxxxxxxxxxxxxxxxxxxxxxx
                                </Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 40 }}></View>
                </ScrollView>
                <View style={[gstyles.r_start, styles.bottomBar]}>
                    <View style={[{ flex: 1, marginLeft: 15 }, gstyles.r_start]}>
                        <Text style={[styles.payNum, { fontSize: 20, paddingTop: 3 }]}>￥</Text>
                        <Text style={styles.payNum}>{book.price.toFixed(2)}</Text>
                    </View>
                    <Button
                        title="立即支付"
                        buttonStyle={styles.payBtn}
                        onPress={() => {
                            PayTemplate.show({
                                commonModal: this.props.app.commonModal,
                                payInfo: {
                                    productName: book.name,
                                    totalAmount: book.price,
                                    body: book.desc,
                                    productCode: book._id
                                },
                                onSucceed: () => {
                                    console.log('返回 单词书页面')
                                    //支付成功后重新加载词汇书
                                    this.props.navigation.goBack();
                                    loadBooks()
                                }
                            })
                        }}
                    />
                </View>
            </View >
        );
    }
}

const mapStateToProps = state => ({
    app: state.app
});

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(VocaLibPayPage);