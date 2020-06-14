


import React, { Component } from 'react';
import { Platform, View, Text, Easing, TouchableNativeFeedback, TextInput, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { Header, Slider } from 'react-native-elements'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import ModalBox from 'react-native-modalbox';
import Swiper from 'react-native-swiper'
import { DURATION } from 'react-native-easy-toast'

import styles from './ArticleTabStyle'
import gstyles from '../../style'
import ColorRadio from './component/ColorRadio'
import AliIcon from '../../component/AliIcon'
import * as ArticleAction from './redux/action/articleAction'
import ArticlePage from './ArticlePage';
import QuestionPage from './QuestionPage';
import * as Constant from './common/constant'
import { TYPE_ERR_CODE_ARTICLE } from '../vocabulary/common/constant';
import ErrorTemplate from '../../component/ErrorTemplate';
import SharePanel from '../../component/SharePanel';
import AnalyticsUtil from '../../modules/AnalyticsUtil';

const questionSize = 10

/**
 *Created by Jacy on 19/08/09.
 */
class ArticleTabPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0,
            showKeyWords: true,
            showSettingModal: false,

        }
        this.analyticsTimer = null
        this.analyticsDuration = 0
        //隐藏黄色警告
        console.disableYellowBox = true;
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { isOpen, hide } = this.props.app.commonModal
            if (isOpen()) {
                hide()
            } else if (this.state.showSettingModal) {
                this._closeSettingModal()
            } else if (this.props.app.confirmModal.isOpen()) {
                this.props.app.confirmModal.hide()
            } else {
                this._goBack()
            }

            return true
        })
        const articleInfo = this.props.navigation.getParam('articleInfo')
        this.props.loadArticle(articleInfo);

        // 页面浏览时长计时
        this.analyticsTimer = setInterval(() => {
            this.analyticsDuration += 3
        }, 3000)
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
        if (this.analyticsTimer) {
            const { type } = this.props.navigation.getParam('articleInfo')
            clearInterval(this.analyticsTimer)
            //统计页面留存时长
            AnalyticsUtil.postEvent({
                type: 'browse',
                id: 'page_read_aritcle',
                name: '真题阅读页面',
                contentType: type,
                duration: this.analyticsDuration
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.article.isWebLoading && !prevProps.article.isWebLoading) {
            this.props.app.loader.show("加载中...", DURATION.FOREVER)
        } else if (!this.props.article.isWebLoading && prevProps.article.isWebLoading) {
            this.props.app.loader.close()
        }
    }

    _goBack = () => {
        this.props.changeUserAnswerMap(new Map())
        this.props.navigation.goBack()
    }

    _movePage = (clickIndex) => {
        const { isLoadPending, isLoadFail } = this.props.article
        if (isLoadPending || isLoadFail) {
            return
        }

        this.swiperRef.scrollBy(clickIndex - this.state.pageIndex, true)
    }



    //改变字体大小
    _onFontChange = (fontRem) => {
        const { changeFontSize } = this.props
        changeFontSize(fontRem)
    }
    //改变主题颜色
    _onBgChange = (index, value) => {
        const { changeBgtheme } = this.props
        changeBgtheme(index)
    }

    //显示隐藏关键词
    _toggleKeyWords = () => {
        this.props.toggleKeyWords()
    }
    _openSettingModal = () => {
        this.setState({ showSettingModal: true })
    }

    _closeSettingModal = () => {
        this.setState({ showSettingModal: false })
    }

    // 创建字号背景设置面板
    _createSettingModal = () => {
        const { bgThemes, themeIndex, fontRem } = this.props.article
        // 获取任务列表数据
        const { showSettingModal } = this.state
        return <ModalBox style={[styles.settingModal, { backgroundColor: bgThemes[themeIndex] }]}
            isOpen={showSettingModal}
            onClosed={this._closeSettingModal}
            onOpened={this._openSettingModal}
            backdrop={true}
            backdropPressToClose={true}
            swipeToClose={false}
            position={"bottom"}
            easing={Easing.elastic(0.2)}
            ref={ref => {
                this.settingModal = ref
            }}>
            <View style={[gstyles.r_start, styles.colorRadioView]}>
                <Text style={styles.settingLabel}>主题</Text>
                <ColorRadio
                    colors={['#FFFFFF', '#FFCCFF', '#F7F5D6', '#E4CFA4',
                        '#BADFC0', '#EFEFEF', '#222222']}
                    selectedIndex={themeIndex}
                    size={20}
                    containerStyle={{ width: 240, }}
                    onChange={this._onBgChange}
                />
            </View>
            <View style={[gstyles.r_start, styles.fontRemView]}>
                <Text style={styles.settingLabel}>字号</Text>
                <Text style={{ fontSize: 12, color: '#F29F3F' }}>A</Text>
                <Slider
                    value={fontRem}
                    onValueChange={this._onFontChange}
                    maximumValue={1.2}
                    minimumValue={0.8}
                    step={0.1}
                    style={{
                        width: 200, height: 40,
                        marginHorizontal: 10,
                    }}
                    thumbStyle={{ backgroundColor: '#F29F3F' }}
                />
                <Text style={{ fontSize: 20, color: '#F29F3F' }}>A</Text>
            </View>

        </ModalBox>
    }

    _renderHeaderCenter = () => {
        const { type } = this.props.navigation.getParam('articleInfo')
        switch (type) {
            case Constant.DETAIL_READ: //仔细阅读
                let s1 = {}, s2 = {}
                const selectStyle = {
                    color: '#303030',
                    borderBottomWidth: 1,
                    borderColor: '#303030'
                }
                if (this.state.pageIndex === 0) {
                    s1 = selectStyle
                } else {
                    s2 = selectStyle
                }
                return <View style={gstyles.r_center}>
                    <TouchableNativeFeedback onPress={() => this._movePage(0)}>
                        <Text style={[gstyles.md_gray, s1, { marginRight: 10 }]}>文章</Text>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this._movePage(1)}>
                        <Text style={[gstyles.md_gray, s2]}>答题</Text>
                    </TouchableNativeFeedback>

                </View>
            case Constant.MULTI_SELECT_READ: //选词填空
                return <View style={gstyles.r_center}>
                    <Text style={gstyles.lg_black_bold}>选词填空</Text>
                </View>
            case Constant.FOUR_SELECT_READ: //四选一
                return <View style={gstyles.r_center}>
                    <Text style={gstyles.lg_black_bold}>选词填空</Text>
                </View>
            case Constant.EXTENSIVE_READ: //泛读
                return <View style={gstyles.r_center}>
                    <Text style={gstyles.lg_black_bold}>泛读</Text>
                </View>

        }

    }

    _handinToAnalysis = () => {
        const articleInfo = this.props.navigation.getParam('articleInfo')
        //跳到解析页面
        this.props.navigation.navigate('Analysis', {
            handin: true,
            articleInfo,
            sendInitMessage: this.articleRef ? this.articleRef.sendInitMessage : null
        })
    }

    //交卷
    _handin = () => {
        const { userAnswerMap, options } = this.props.article
        const { type } = this.props.navigation.getParam('articleInfo')
        console.log('---------handin 跳转 到解析----------')
        const len = type === Constant.MULTI_SELECT_READ ? questionSize : options.length
        if (userAnswerMap.size < len) {
            this.props.app.confirmModal.show('还有试题未完成', () => {
                this._handinToAnalysis()
            }, null, '提交', '继续做题')
        } else {
            this._handinToAnalysis()
        }
    }

    // 分享 
    _renderSharePanel = ({ commonModal }) => {
        const articleInfo = this.props.navigation.getParam('articleInfo')
        return () => {
            return <SharePanel
                containerStyle={{ flex: 1 }}
                share={() => {
                    const shareInfo = {
                        type: 'news',
                        title: articleInfo.name,
                        description: articleInfo.note,
                        webpageUrl: 'http://www.aitingci.com',
                        imageUrl: this.props.plan.bookCoverUrl
                    }
                    //统计分享事件
                    AnalyticsUtil.postEvent({
                        type: 'count',
                        id: 'share_read_article'
                    })
                    return shareInfo
                }}
            />
        }
    }


    _renderContent = () => {
        const { isLoadPending, isLoadFail } = this.props.article
        //路由参数
        const articleInfo = this.props.navigation.getParam('articleInfo')

        if (isLoadFail) {
            return <View style={[gstyles.c_center, { flex: 1 }]}>
                <AliIcon name={'nodata_icon'} size={60} color={gstyles.black} />
                <Text style={gstyles.md_black}>出错了...</Text>
            </View>

        } else {
            if (!isLoadPending) {
                if (articleInfo.type === Constant.DETAIL_READ) {
                    return <Swiper
                        ref={ref => this.swiperRef = ref}
                        showsPagination={false}
                        loop={false}
                        index={this.state.pageIndex}
                        onIndexChanged={(index) => { this.setState({ pageIndex: index }) }}>
                        <ArticlePage {...this.props} articleInfo={articleInfo} />
                        <QuestionPage articleInfo={articleInfo} />
                    </Swiper>
                } else {
                    return <ArticlePage
                        ref={ref => this.articleRef = ref}
                        {...this.props}
                        articleInfo={articleInfo} />
                }
            }
        }
    }



    render() {
        const { bgThemes, themeIndex, showKeyWords, isLoadFail } = this.props.article
        const articleInfo = this.props.navigation.getParam('articleInfo')
        return (
            <View style={{ flex: 1, backgroundColor: bgThemes[themeIndex] }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color='#555' onPress={() => {
                            this._goBack();
                        }} />}
                    centerComponent={this._renderHeaderCenter()}
                    rightComponent={isLoadFail ? null :
                        <View style={[gstyles.r_start]}>
                            {articleInfo.type !== Constant.EXTENSIVE_READ &&
                                <TouchableNativeFeedback onPress={this._handin}>
                                    <Text style={styles.handinBtn}>交卷</Text>
                                </TouchableNativeFeedback>
                            }

                            <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom' }}>
                                <MenuTrigger >
                                    <AliIcon name='add' size={26} color='#555'></AliIcon>
                                </MenuTrigger>
                                <MenuOptions >
                                    <MenuOption onSelect={this._toggleKeyWords} style={gstyles.menuOptionView}>
                                        <AliIcon name="chazhaobiaodanliebiao" size={20} color="#303030" style={{ paddingTop: 5, marginRight: 10 }} />
                                        <Text style={gstyles.menuOptionText}>{showKeyWords ? '隐藏关键词' : '显示关键词'}</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={this._openSettingModal} style={gstyles.menuOptionView}>
                                        <AliIcon name="zt-zt-1" size={18} color="#303030" style={{ marginRight: 10 }} />
                                        <Text style={gstyles.menuOptionText}>主题字号</Text>
                                    </MenuOption>

                                    <MenuOption style={gstyles.menuOptionView} onSelect={() => {
                                        // 打开分享面板
                                        this.props.app.commonModal.show({
                                            renderContent: this._renderSharePanel({ commonModal: this.props.app.commonModal }),
                                            modalStyle: {
                                                height: 150,
                                                backgroundColor: "#FFF",
                                            },
                                            backdropPressToClose: true,
                                            position: 'bottom'
                                        })
                                    }}>
                                        <AliIcon name="fenxiang" size={20} color="#303030" style={{ marginRight: 10 }} />
                                        <Text style={gstyles.menuOptionText}>分享</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={() => {
                                        ErrorTemplate.show({
                                            commonModal: this.props.app.commonModal,
                                            title: "我要纠错",
                                            modalHeight: 400,
                                            errorTypes: ["文章存在错别词", "答案错误", "题目错误", "解析错误", "其他"],
                                            params: {
                                                userId: this.props.mine.user._id,
                                                type: TYPE_ERR_CODE_ARTICLE,
                                                object: this.props.article.articleId,
                                            },
                                            onSucceed: () => {
                                                this.props.app.toast.show("提交成功", 1000)
                                            }
                                        })

                                    }}
                                        style={[gstyles.menuOptionView, { borderBottomWidth: 0 }]}>
                                        <AliIcon name="baocuo" size={19} color="#303030" style={{ marginRight: 10 }} />
                                        <Text style={gstyles.menuOptionText}>纠错</Text>
                                    </MenuOption>


                                </MenuOptions>
                            </Menu>

                        </View>
                    }
                    containerStyle={{
                        backgroundColor: bgThemes[themeIndex],
                        justifyContent: 'space-around',
                    }}
                />
                {
                    this._renderContent()
                }
                {
                    this._createSettingModal()
                }
                {/* 答悬浮按钮 */}
                {!isLoadFail && !(articleInfo.type === Constant.EXTENSIVE_READ) &&
                    <TouchableNativeFeedback onPress={() => {
                        //跳转
                        this.props.navigation.navigate('Analysis', {
                            handin: false,
                            articleInfo,
                        })

                    }}>
                        <View style={[styles.floatBtn]}>
                            <AliIcon name='iconfontyoujiantou-copy-copy-copy' size={16} color='#303030'></AliIcon>
                            <View>
                                <Text style={styles.floatText}>解</Text>
                                <Text style={styles.floatText}>析</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                }

            </View>
        );
    }
}



const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine,
    article: state.article,
    plan: state.plan.plan
});

const mapDispatchToProps = {
    loadArticle: ArticleAction.loadArticle,
    changeWebLoading: ArticleAction.changeWebLoading,
    changeBgtheme: ArticleAction.changeBgtheme,
    changeFontSize: ArticleAction.changeFontSize,
    toggleKeyWords: ArticleAction.toggleKeyWords,
    changeUserAnswerMap: ArticleAction.changeUserAnswerMap,
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticleTabPage);