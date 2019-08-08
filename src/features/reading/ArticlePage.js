import React from 'react';
import { View,Text, Button, Easing, StatusBar,
    TouchableHighlight, TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import {Header, Slider } from 'react-native-elements'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import ModalBox from 'react-native-modalbox';
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux';

import * as ArticleAction from './redux/action/articleAction'
import styles from './ArticlePageStyle'
import FileService from './service/FileService'
import * as RConstant from './common/constant'
import gstyles from '../../style'
import ReadUtil from './util/readUtil'
import WebUtil from './util/webUtil'
import AliIcon from '../../component/AliIcon'
import ColorRadio from './component/ColorRadio'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');



class ArticlePage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
        this.state = {
            showKeyWords:true,

            showSettingModal:true,

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

    //显示隐藏关键词
    _toggleKeyWords = ()=>{
        this.setState({showKeyWords:!this.state.showKeyWords})
         //发送给Web
         this.webref.postMessage(
            JSON.stringify({command:'toggleKeyWords', payload:null})
        );

    }


    //改变字体大小
    _onFontChange = (fontRem)=>{
        const {changeFontSize} = this.props
        changeFontSize(fontRem)
        //发送给Web
        this.webref.postMessage(
            JSON.stringify({command:'changeFontSize', payload:{size:fontRem+'rem'}})
         )
    }
    //改变主题颜色
    _onBgChange = (index, value)=>{
        const {changeBgtheme} = this.props
        changeBgtheme(index)
        //发送给Web
         this.webref.postMessage(
            JSON.stringify({command:'changeBgtheme', payload:{color:value}})
         )
    }
    _openSettingModal = ()=>{
        this.setState({showSettingModal:true})
    }

    _closeSettingModal = ()=>{
        this.setState({showSettingModal:false})
    }
    
    // 创建字号背景设置面板
    _createSettingModal = ()=>{
        const {bgThemes, themeIndex, fontRem} = this.props.article
         // 获取任务列表数据
         const {showSettingModal} = this.state
         return <ModalBox style={[styles.settingModal, {backgroundColor:bgThemes[themeIndex]}]}
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
                        containerStyle={{width:240,}}
                        onChange={this._onBgChange}
                    />
                </View>
                <View style={[gstyles.r_start, styles.fontRemView]}>
                    <Text style={styles.settingLabel}>字号</Text>
                    <Text style={{fontSize:12,color:'#F29F3F'}}>A</Text>
                    <Slider
                        value={fontRem}
                        onValueChange={this._onFontChange}
                        maximumValue={1.2}
                        minimumValue={0.8}
                        step={0.1}
                        style={{
                            width:200,height:40,
                            marginHorizontal:10,}}
                        thumbStyle={{backgroundColor:'#F29F3F'}}
                    />
                    <Text style={{fontSize:20,color:'#F29F3F'}}>A</Text>
                </View>

         </ModalBox>
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
        
        const {showAnswerModal} = this.state
        const {bgThemes, themeIndex} = this.props.article
        return (

            <View style={styles.container}>
                {/* 头部 */}
                <StatusBar translucent={true} />
                <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={24} color='#555' onPress={()=>{
                        this.props.navigation.goBack();
                    }}></AliIcon> }
                centerComponent={{ text: '选词填空', style: { color: '#303030', fontSize:18 } }}
                rightComponent={
                    <View style={[gstyles.r_start]}>
                        
                        <TouchableWithoutFeedback onPress={this._handin}>
                            <Text style={styles.handinBtn}>交卷</Text>
                        </TouchableWithoutFeedback>
                        
                        <Menu  renderer={renderers.Popover} rendererProps={{placement: 'bottom'}}>
                            <MenuTrigger >
                                <AliIcon name='add' size={24} color='#555'></AliIcon>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                            <MenuOption onSelect={this._toggleKeyWords} style={styles.menuOptionView}>
                                    <Text style={styles.menuOptionText}>{this.state.showKeyWords?'隐藏关键词':'显示关键词'}</Text>
                            </MenuOption>
                                
                                <MenuOption onSelect={this._openSettingModal} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>主题字号</Text>
                                </MenuOption>
                               
                                <MenuOption onSelect={() => alert(`Delete`)} style={styles.menuOptionView}>
                                        <Text style={styles.menuOptionText}>分享</Text>
                                </MenuOption>
                                
                                <MenuOption onSelect={() => alert(`Delete`)} 
                                    style={[styles.menuOptionView,{borderBottomWidth:0}]}>
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
                {/* 答悬浮按钮 */}
                <TouchableWithoutFeedback onPress={()=>{
                    //跳转
                    this.props.navigation.navigate('Analysis',{handin:false})
                    }}>
                    <View style={[styles.floatBtn]}>
                        <AliIcon name='iconfontyoujiantou-copy-copy-copy' size={16} color='#303030'></AliIcon>
                        <View>
                            <Text style={styles.floatText}>解</Text>
                            <Text style={styles.floatText}>析</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                
                {
                    this._createAnswerOptionModal()
                }
                {
                    this._createSettingModal()
                }
            </View>
        );
    }
}

const mapStateToProps = state =>({
    article : state.article,
});

const mapDispatchToProps = {
    changeBgtheme : ArticleAction.changeBgtheme,
    changeFontSize : ArticleAction.changeFontSize,
    
};
export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);