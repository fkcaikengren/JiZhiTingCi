import React from 'react';
import { View,Text, Easing, TouchableWithoutFeedback} from 'react-native';
import ModalBox from 'react-native-modalbox';
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux';

import * as ArticleAction from './redux/action/articleAction'
import styles from './ArticlePageStyle'
import FileService from './service/FileService'
import gstyles from '../../style'
import ReadUtil from './util/readUtil'
import WebUtil from './util/webUtil'
import AliIcon from '../../component/AliIcon'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');



class ArticlePage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
        this.state = {

            //以下适用于 【题型2】
            //是否显示答案选项面板
            showAnswerModal:false,
            answerOptions:['survive','surrounding','serves','reviewed','reported','recession',
            'households','gather','formally','financially','domestic','competition','communities',
            'circling','accumulate'],
            //选中的问题 
            selectedQuestion:"48",
            //用户的答案
            userAnswers: new Map()
        }
        
    }

    componentDidMount(){
        setTimeout(()=>{
            this._loadArticle()
        }, 100)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {bgThemes, themeIndex, fontRem, showKeyWords} = this.props.article
        const nextThemeIndex = nextProps.article.themeIndex
        const nextFontRem = nextProps.article.fontRem
        const nextShowKeyWords = nextProps.article.showKeyWords
        //改变背景主题
        if(themeIndex !== nextThemeIndex){
            this.webref.postMessage(
                JSON.stringify({command:'changeBgtheme', payload:{color:bgThemes[nextThemeIndex]}})
            )
            return false
        }
        //改变字号
        if(fontRem !== nextFontRem){
            this.webref.postMessage(
                JSON.stringify({command:'changeFontSize', payload:{size:nextFontRem+'rem'}})
            )
            return false
        }
        //控制显示关键词
        if(showKeyWords != nextShowKeyWords){
            this.webref.postMessage(
                JSON.stringify({command:'toggleKeyWords', payload:null})
            );
            return false
        }
        return true
    }



    //关闭选项面板
    _closeAnswerModal = ()=>{
        this.setState({showAnswerModal:false})
    }

    //打开选项面板
    _openAnswerModal = ()=>{
        this.setState({showAnswerModal:true})
    }

    // 创建答案选项面板
    _createAnswerOptionModal = () =>{
        // 获取任务列表数据
        const {showAnswerModal} = this.state
        return <ModalBox style={[styles.answerModal]}
            isOpen={showAnswerModal} 
            onClosed={this._closeAnswerModal}
            onOpened={this._openAnswerModal}
            backdrop={false} 
            backdropPressToClose={false}
            swipeToClose={true}
            position={"bottom"} 
            easing={Easing.elastic(0.2)}
            ref={ref => {
                this.answerModal = ref
            }}>
                <View style={[gstyles.r_start,styles.answerPanel]}>
                {
                    this.state.answerOptions.map((item, index)=>{
                        let selected = null
                        if(this._isSelectedOption(item)){
                            selected = {color:'#1890FFAA'}
                        }
                        return <View 
                            onStartShouldSetResponder={(evt) => true}
                            onResponderGrant={(e)=>{this._clickAnswer(item)}}        //点击开始时
                            //onResponderRelease 不发生
                        >
                            <Text style={[styles.modalAnswerOption,selected]}>{item}</Text>
                        </View>
                    })
                }
                    
                </View>
        </ModalBox>
    }

    //【题型2】判断用户是否已选 选项
    _isSelectedOption = (word)=>{
        for(let v of this.state.userAnswers.values()){
            if(v === word){
                return true
            }
        }
        return false
    }

    //【题型2】点击问题
    _clickQuestion = (questionNum)=>{
        if(this.state.showAnswerModal){
            this.setState({selectedQuestion:questionNum})
        }else{
            this.setState({selectedQuestion:questionNum,showAnswerModal:true})
        }
        
    }
    //【题型2】点击答案
    _clickAnswer = (optionWord)=>{
        //填用户答案
        const userAnswers = new Map(this.state.userAnswers)
        userAnswers.set(this.state.selectedQuestion, optionWord)
        this.setState({userAnswers})
        //发送给Web
        this.webref.postMessage(
            JSON.stringify({command:'selectAnswer', payload:{word:optionWord}})
        );
    }


    // 加载文章
    _loadArticle = async ()=>{
        const {bgThemes, themeIndex, fontRem} = this.props.article
        try{
            const text = await this.fileService.loadText('3-article.txt')
            const keywordText = await this.fileService.loadText('3-keyword.json')
            const keywords = JSON.parse(keywordText)
            //发送文本给Web
            this.webref.postMessage(
                //文本，关键字
                JSON.stringify({command:'loadPage', payload:{
                    text:text, 
                    keywords:keywords,
                    color:bgThemes[themeIndex],
                    size:fontRem+'rem'
                }})
            );
        }catch(e){
            console.log(e)
        }
    }


    //查询单词
    _searchWord = (word)=>{
        alert(word)
    }

    //交卷
    _handin = ()=>{
        //Map转对象
        const userAnswersObj = ReadUtil.strMapToObj(this.state.userAnswers)
        //跳到解析页面
        this.props.navigation.navigate('Analysis',{
            userAnswers:userAnswersObj,
            handin:true
        })
    }

    _onMessage = (e) =>{
        let data = JSON.parse(e.nativeEvent.data);
        console.log(data)
        switch(data.command){
            case 'selectQuestion':
                this._clickQuestion(data.payload.questionNum)
            break;
            case 'error':

            break;
        }
    }


    render() {
        
        return (

            <View style={styles.container}>

                
                {/* 阅读文章 */}
                <View style={styles.webContainer}>
                    <WebView
                        nativeConfig={{props: {webContentsDebuggingEnabled: true}}} 
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
                            uri:'file:///android_asset/web/article.html',
                            // <script src='./js/zepto.min.js'/>会以这个为根目录查找资源，否则引入的zepto.js等无效
                            baseUrl:'file:///android_asset/web/',  
                        }}
                        
                    /> 
                </View>
                
                {
                    this._createAnswerOptionModal()
                }
            </View>
        );
    }
}

const mapStateToProps = state =>({
    article : state.article,
    nav: state.nav
});

const mapDispatchToProps = {
    changeBgtheme : ArticleAction.changeBgtheme,
    changeFontSize : ArticleAction.changeFontSize,
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);