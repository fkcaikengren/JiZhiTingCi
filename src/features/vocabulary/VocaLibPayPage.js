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
import AnalyticsUtil from "../../modules/AnalyticsUtil";
import { BASE_URL } from "../../common/constant";


class VocaLibPayPage extends Component {
    constructor(props) {
        super(props)
        this.analyticsTimer = null
        this.analyticsDuration = 0

        this.state = {
            bookPayInfo: null
        }
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
        this._init()
        // 页面浏览时长计时
        this.analyticsTimer = setInterval(() => {
            this.analyticsDuration += 1
        }, 1000)
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress')
        if (this.analyticsTimer) {
            const book = this.props.navigation.getParam('book')
            clearInterval(this.analyticsTimer)
            //统计页面留存时长
            AnalyticsUtil.postEvent({
                type: 'browse',
                id: 'page_voca_lib_pay',
                name: '词库付费页面',
                contentType: book.name,
                duration: this.analyticsDuration
            })
        }
    }

    _init = async () => {
        const book = this.props.navigation.getParam('book')
        const res = await Http.get('/vocaBook/getPayInfo?id=' + book._id)
        if (res.status === 200) {
            const bookPayInfo = {
                ...res.data,
                displayWords: res.data.displayWords ? JSON.parse(res.data.displayWords) : {}
            }
            this.setState({
                bookPayInfo
            })
        }
    }

    _renderDisplayWords = () => {
        const { displayWords } = this.state.bookPayInfo
        if (displayWords) {
            const comps = []
            for (let key in displayWords) {
                comps.push(
                    <View style={[gstyles.r_start]} key={key}>
                        <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>{key}</Text>
                        <Text numberOfLines={1} style={{ flex: 1, lineHeight: 20 }}>{displayWords[key]}</Text>
                    </View>
                )
            }
            return comps
        }

    }

    render() {

        const book = this.props.navigation.getParam('book')
        const loadBooks = this.props.navigation.getParam('loadBooks')
        const { bookPayInfo } = this.state
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
                {bookPayInfo &&
                    <ScrollView
                        style={{ flex: 1 }}
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
                                <Image source={{ uri: BASE_URL + book.coverUrl }} style={libStyles.img} />
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
                                    {bookPayInfo.intro}
                                </Text>
                                {
                                    this._renderDisplayWords()
                                }
                            </View>
                        </View>
                        <View style={[gstyles.c_start_left, styles.featureView]}>
                            <View style={[gstyles.r_start, styles.featureTab]}>
                                <AliIcon name='yingshi' size={18} color={gstyles.emColor}></AliIcon>
                                <Text style={styles.tabFont}>影视例句</Text>
                            </View>
                            <View style={[gstyles.c_start_left, styles.featureBox]}>
                                <Text style={styles.boxFont}>
                                    精选影视中的例句，帮助你深入理解单词含义，学的更有趣、更轻松。
                             </Text>
                                <Image source={{ uri: BASE_URL + bookPayInfo.moviePicUrl }} style={styles.movieImg} />
                            </View>
                        </View>
                        <View style={[gstyles.c_start_left, styles.featureView]}>
                            <View style={[gstyles.r_start, styles.featureTab]}>
                                <AliIcon name='zhineng' size={18} color={gstyles.emColor}></AliIcon>
                                <Text style={styles.tabFont}>滚动复习</Text>
                            </View>
                            <View style={[gstyles.c_start_left, styles.featureBox]}>
                                <Text style={styles.boxFont}>
                                    人们对反复出现的东西给予重视，潜意识的记住它。利用这个原理，通过类似音乐的播放学习，极大提高对单词的接触频率，让记忆深刻牢固！
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 50 }}></View>
                    </ScrollView>
                }
                {!bookPayInfo &&
                    <View style={[{ flex: 1 }, gstyles.c_center]}>
                        <Text style={gstyles.md_gray}>请检查网络重试...</Text>
                    </View>
                }
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