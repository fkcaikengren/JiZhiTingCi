


import React, { Component } from 'react';
import { Platform, StatusBar, View, Text, Easing, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Header, Slider } from 'react-native-elements'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import ModalBox from 'react-native-modalbox';
import Swiper from 'react-native-swiper'

import Loader from '../../component/Loader'
import styles from './ArticleTabStyle'
import gstyles from '../../style'
import ColorRadio from './component/ColorRadio'
import AliIcon from '../../component/AliIcon'
import * as ArticleAction from './redux/action/articleAction'
import ArticlePage from './ArticlePage';
import QuestionPage from './QuestionPage';
import * as Constant from './common/constant'
import ReadUtil from './common/readUtil'


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

        //隐藏黄色警告
        console.disableYellowBox = true;
    }

    componentDidMount() {
        const articleInfo = this.props.navigation.getParam('articleInfo')
        console.log('---页面初始化后，加载文章----')
        this.props.loadArticle(articleInfo);
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
                    <Text style={[gstyles.md_gray, s1, { marginRight: 10 }]}>文章</Text>
                    <Text style={[gstyles.md_gray, s2]}>答题</Text>
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
        //提交，先加载数据再跳转
        this.props.loadAnalysis(articleInfo);
        //跳到解析页面
        this.props.navigation.navigate('Analysis', {
            handin: true,
            articleInfo
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

    _renderContent = () => {
        const { isLoadPending, isLoadFail } = this.props.article
        //路由参数
        const articleInfo = this.props.navigation.getParam('articleInfo')

        if (isLoadFail) {
            return <View style={[gstyles.c_center, { flex: 1 }]}>
                <AliIcon name={'nodata_icon'} size={100} color={gstyles.black} />
                <Text style={gstyles.md_black}>出错了...</Text>
            </View>

        } else {
            if (!isLoadPending) {
                if (articleInfo.type === Constant.DETAIL_READ) {
                    return <Swiper
                        showsPagination={false}
                        loop={false}
                        index={this.state.pageIndex}
                        onIndexChanged={(index) => { this.setState({ pageIndex: index }) }}>
                        <ArticlePage {...this.props} articleInfo={articleInfo} />
                        <QuestionPage {...this.props} articleInfo={articleInfo} />
                    </Swiper>
                } else {
                    return <Swiper
                        showsPagination={false}
                        loop={false}
                        onIndexChanged={(index) => { this.setState({ pageIndex: index }) }}>
                        <ArticlePage {...this.props} articleInfo={articleInfo} />
                    </Swiper>
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
                            this.props.navigation.goBack();
                        }} />}
                    centerComponent={this._renderHeaderCenter()}
                    rightComponent={isLoadFail ? null :
                        <View style={[gstyles.r_start]}>
                            {articleInfo.type !== Constant.EXTENSIVE_READ &&
                                <TouchableWithoutFeedback onPress={this._handin}>
                                    <Text style={styles.handinBtn}>交卷</Text>
                                </TouchableWithoutFeedback>
                            }

                            <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom' }}>
                                <MenuTrigger >
                                    <AliIcon name='add' size={26} color='#555'></AliIcon>
                                </MenuTrigger>
                                <MenuOptions style={styles.menuOptions}>
                                    <MenuOption onSelect={this._toggleKeyWords} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>{showKeyWords ? '隐藏关键词' : '显示关键词'}</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={this._openSettingModal} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>主题字号</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={() => alert(`分享`)} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>分享</Text>
                                    </MenuOption>

                                    <MenuOption onSelect={() => alert(`纠错`)}
                                        style={[styles.menuOptionView, { borderBottomWidth: 0 }]}>
                                        <Text style={styles.menuOptionText}>纠错</Text>
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
                {/* 答悬浮按钮 */}
                {!isLoadFail && !(articleInfo.type === Constant.EXTENSIVE_READ) &&
                    <TouchableWithoutFeedback onPress={() => {
                        //先加载数据再跳转
                        this.props.loadAnalysis(articleInfo);
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
                    </TouchableWithoutFeedback>
                }
                {
                    this._createSettingModal()
                }
                {this.props.article.isWebLoading &&
                    <View style={[gstyles.loadingView, { backgroundColor: bgThemes[themeIndex] }]}>
                        <Loader />
                    </View>
                }
               
            </View>
        );
    }
}



const mapStateToProps = state => ({
    app: state.app,
    article: state.article,
});

const mapDispatchToProps = {
    loadArticle: ArticleAction.loadArticle,
    loadAnalysis: ArticleAction.loadAnalysis,
    changeWebLoading: ArticleAction.changeWebLoading,
    changeBgtheme: ArticleAction.changeBgtheme,
    changeFontSize: ArticleAction.changeFontSize,
    toggleKeyWords: ArticleAction.toggleKeyWords,
    changeUserAnswerMap: ArticleAction.changeUserAnswerMap,
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticleTabPage);