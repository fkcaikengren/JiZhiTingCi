import React from 'react';
import { View, Text, Easing, Button, TouchableWithoutFeedback } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types'
import OptionRadio from './component/OptionRadio'
import LookWordBoard from '../vocabulary/component/LookWordBoard'
import styles from './ArticleStyle'
import gstyles from '../../style'
import ReadUtil from './common/readUtil'
import WebUtil from '../../common/webUtil'
import AliIcon from '../../component/AliIcon'
import * as Constant from './common/constant'
import VocaDao from '../vocabulary/service/VocaDao';



export default class ArticlePage extends React.Component {

    constructor(props) {
        super(props)
        this.vocaDao = VocaDao.getInstance()
        this.state = {
            //是否显示答案选项面板
            showAnswerModal: false,
            //选中的问题 
            selectedBlank: "0",
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        const { bgThemes, themeIndex, fontRem, showKeyWords } = this.props.article
        const nextThemeIndex = nextProps.article.themeIndex
        const nextFontRem = nextProps.article.fontRem
        const nextShowKeyWords = nextProps.article.showKeyWords
        //改变背景主题
        if (themeIndex !== nextThemeIndex) {
            this.webref.postMessage(
                JSON.stringify({ command: 'changeBgtheme', payload: { color: bgThemes[nextThemeIndex] } })
            )
            return false
        }
        //改变字号
        if (fontRem !== nextFontRem) {
            this.webref.postMessage(
                JSON.stringify({ command: 'changeFontSize', payload: { size: nextFontRem + 'rem' } })
            )
            return false
        }
        //控制显示关键词
        if (showKeyWords != nextShowKeyWords) {
            this.webref.postMessage(
                JSON.stringify({ command: 'toggleKeyWords', payload: null })
            );
            return false
        }
        return true
    }


    //关闭选项面板
    _closeAnswerModal = () => {
        this.setState({ showAnswerModal: false })
    }

    //打开选项面板
    _openAnswerModal = () => {
        this.setState({ showAnswerModal: true })
    }

    // 创建答案选项面板
    _createAnswerOptionModal = () => {
        const { options } = this.props.article
        const { type } = this.props.articleInfo
        const radioOptions = []
        if (type === Constant.FOUR_SELECT_READ) {
            const obj = ReadUtil.getOptionObj(options, this.state.selectedBlank)
            for (let k in obj) {
                if (k.length === 1) {
                    radioOptions.push({
                        identifier: k,
                        content: obj[k]
                    })
                    console.log(`))))))----${k}--${obj[k]}`)
                }
            }
        }


        // 获取任务列表数据
        const { showAnswerModal } = this.state
        return <ModalBox style={[styles.answerModal]}
            isOpen={showAnswerModal}
            onClosed={this._closeAnswerModal}
            onOpened={this._openAnswerModal}
            backdrop={false}
            backdropPressToClose={false}
            swipeToClose={true}
            position={"bottom"}
            easing={Easing.elastic(0.5)}
            ref={ref => {
                this.answerModal = ref
            }}>
            {type === Constant.MULTI_SELECT_READ &&
                <View style={[gstyles.r_start, styles.answerPanel]}>
                    {
                        options.map((item, index) => {

                            let selected = null
                            if (this._isSelectedOption(item)) {
                                selected = { color: '#1890FF' }
                            }
                            return <View
                                onStartShouldSetResponder={(evt) => true}
                                onResponderGrant={(e) => { this._clickAnswer(item) }}        //点击开始时
                            //onResponderRelease 不发生
                            >
                                <Text style={[styles.modalAnswerOption, selected]}>{item}</Text>
                            </View>
                        })
                    }
                </View>
            }
            {type === Constant.FOUR_SELECT_READ &&
                <View style={[gstyles.c_start, { marginTop: 10 }]}>
                    <OptionRadio
                        options={radioOptions}
                        onChange={this._onChangeOption}
                        bgColor={'#CCC'} />
                </View>
            }
        </ModalBox>
    }

    //【题型2】判断用户是否已选 选项
    _isSelectedOption = (word) => {
        const { userAnswerMap } = this.props.article
        for (let v of userAnswerMap.values()) {
            if (v === word) {
                return true
            }
        }
        return false
    }

    //【题型2】点击填空
    _clickBlank = (blankNum) => {
        if (this.state.showAnswerModal) {
            this.setState({ selectedBlank: blankNum })
        } else {
            this.setState({ selectedBlank: blankNum, showAnswerModal: true })
        }

    }
    //【题型2】点击答案
    _clickAnswer = (optionWord) => {
        //填用户答案
        const userAnswerMap = new Map(this.props.article.userAnswerMap)
        userAnswerMap.set(this.state.selectedBlank, optionWord)
        this.props.changeUserAnswerMap(userAnswerMap)
        //发送给Web
        this.webref.postMessage(
            JSON.stringify({ command: 'selectAnswer', payload: { word: optionWord } })
        );
    }
    //【题型3】4选一
    _onChangeOption = (index, value) => {
        //填用户答案
        const userAnswerMap = new Map(this.props.article.userAnswerMap)
        userAnswerMap.set(this.state.selectedBlank, value.identifier)
        this.props.changeUserAnswerMap(userAnswerMap)
        //发送给Web
        this.webref.postMessage(
            JSON.stringify({ command: 'selectAnswer', payload: { word: value.content } })
        );
        //关闭
        this._closeAnswerModal()
    }


    // 首次发送
    sendInitMessage = () => {
        const { articleText, keyWords, bgThemes, themeIndex, fontRem, userAnswerMap, options } = this.props.article
        //处理keyWords
        let keywords = []
        for (let kw of keyWords) {
            keywords.push(kw)
            const transforms = this.vocaDao.getTransforms(kw)
            keywords = keywords.concat(transforms)
        }
        //发送文本给Web
        this.webref.postMessage(
            //文本，关键字
            JSON.stringify({
                command: 'initPage', payload: {
                    text: articleText,
                    keywords,
                    color: bgThemes[themeIndex],
                    size: fontRem + 'rem'
                }
            })
        );
    }

    _onMessage = (e) => {
        let data = JSON.parse(e.nativeEvent.data);
        // console.log(data)
        switch (data.command) {
            case 'initStart':
                console.log('--------initStart > sendFirst ---------')
                this.sendInitMessage()
                break;
            case 'initFinish':
                console.log('--------initFinish > changeWebLoading ---------')
                this.props.changeWebLoading(false)
                break;
            case 'searchWord':
                this.wordBoard.lookWord(data.payload.word)
                break;
            case 'exit':
                console.log('退出')
                break;
            case 'selectBlank':
                this._clickBlank(data.payload.blankNum)
                break;
            case 'error':

                break;
        }
    }

    render() {
        const { bgThemes, themeIndex } = this.props.article
        const { type } = this.props.articleInfo
        return (
            <View style={[styles.container, bgThemes[themeIndex]]}>
                {/* 阅读文章 */}
                <View style={[styles.webContainer, { backgroundColor: bgThemes[themeIndex] }]}>
                    <WebView
                        nativeConfig={{ props: { webContentsDebuggingEnabled: true } }}
                        ref={r => (this.webref = r)}
                        originWhiteList={['*']} // 访问本地html时，需设置源的白名单为所有
                        javaScriptEnabled={true}
                        // 接受web的数据
                        onMessage={this._onMessage}
                        onError={(error) => {
                            console.log("error", error);
                        }}
                        // 发送给web的初始化脚本
                        injectedJavaScript={WebUtil.ARTICLE_LISTEN_JAVASCRIPT}
                        source={{
                            uri: 'file:///android_asset/web/article.html',
                            // <script src='./js/zepto.min.js'/>会以这个为根目录查找资源，否则引入的zepto.js等无效
                            baseUrl: 'file:///android_asset/web/',
                        }}
                        style={[{ backgroundColor: bgThemes[themeIndex] }]}
                    />
                </View>
                {(type === Constant.FOUR_SELECT_READ || type === Constant.MULTI_SELECT_READ) &&
                    this._createAnswerOptionModal()
                }
                <LookWordBoard
                    ref={ref => this.wordBoard = ref}
                    navigation={this.props.navigation}
                    onStateChange={(isOpen) => {
                        if (!isOpen) {
                            //发送文本给Web
                            this.webref.postMessage(
                                JSON.stringify({ command: 'cancelSearchWord', payload: null })
                            );
                        }
                    }}
                />
            </View>
        );
    }
}


ArticlePage.propTypes = {
    articleInfo: PropTypes.object.isRequired,
}


ArticlePage.defaultProps = {

}