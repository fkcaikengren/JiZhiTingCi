import React from 'react';
import { View,Text, Button, Easing, StatusBar,
    TouchableHighlight, TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import {Header} from 'react-native-elements'
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';
import { WebView } from 'react-native-webview';
import styles from './ArticlePageStyle'
import FileService from './service/FileService'
import ModalBox from 'react-native-modalbox';
import * as RConstant from './common/constant'
import gstyles from '../../style'
import ReadUtil from './util/readUtil'
import WebUtil from './util/webUtil'
import AliIcon from '../../component/AliIcon'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');



export default class ArticlePage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
        this.state = {
            contents:[],
            renderIndex:RConstant.RENDER_COUNT,
            showKeyWords:true,


            //以下适用于 【题型2】
            //是否显示答案板
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
        }, 500)
    }

    //显示隐藏关键词
    _toggleKeyWords = ()=>{
        this.setState({showKeyWords:!this.state.showKeyWords})
         //发送给Web
         this.webref.postMessage(
            JSON.stringify({command:'toggleKeyWords', payload:null})
        );

    }
   
    //关闭选项面板
    _closeAnswerModal = ()=>{
        this.setState({showAnswerModal:false})
    }

    //打开选项面板
    _openAnswerModal = ()=>{
        this.setState({showAnswerModal:true})
    }

    // 创建任务列表
    _createTaskListModal = () =>{
        // 获取任务列表数据
        const {showAnswerModal} = this.state
        return <ModalBox style={[styles.answerModal]}
            isOpen={showAnswerModal} 
            onClosed={this._closeAnswerModal}
            onOpened={this._openAnswerModal}
            backdrop={false} 
            backdropPressToClose={false}
            swipeToClose={false}
            position={"bottom"} 
            easing={Easing.elastic(0.2)}
            ref={ref => {
                this.answerModal = ref
            }}>
                <View style={[gstyles.r_start,styles.answerPanel]}
                    onMoveShouldSetResponder={(evt) => true}
                    onResponderGrant= {(e) => {
                        this.startY = e.nativeEvent.locationY
                    }}
                    onResponderRelease={(e)=>{
                        if(e.nativeEvent.locationY - this.startY > 20){
                            this._closeAnswerModal()
                        }
                    }}>
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
        try{
            const text = await this.fileService.loadText('2-article.txt')
            const keywordText = await this.fileService.loadText('2-keyword.json')
            const keywords = JSON.parse(keywordText)
            //发送文本给Web
            this.webref.postMessage(
                //文本，关键字
                JSON.stringify({command:'loadPage', payload:{text:text, keywords:keywords}})
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
                        {/* <AliIcon name='guanjianzibiaoqian' size={24} color={this.state.showKeyWords?'#FFE957':'#AAA'} 
                            onPress={this._toggleKeyWords}/> */}
                        <TouchableWithoutFeedback onPress={this._handin}>
                            <Text style={styles.handinBtn}>交卷</Text>
                        </TouchableWithoutFeedback>
                        
                        <Menu onSelect={()=>{}} renderer={renderers.Popover} rendererProps={{placement: 'bottom'}}>
                            <MenuTrigger >
                                <AliIcon name='add' size={24} color='#555'></AliIcon>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                <View style={styles.menuOptionView}>
                                    <Text style={styles.menuOptionText}>显示关键词</Text>
                                </View>
                                <View style={styles.menuOptionView}>
                                    <Text style={styles.menuOptionText}>颜色字号</Text>
                                </View>
                                <View style={styles.menuOptionView}>
                                    <Text style={styles.menuOptionText}>分享</Text>
                                </View>
                                <View style={[styles.menuOptionView,{borderBottomWidth:0}]}>
                                    <Text style={styles.menuOptionText}>纠错</Text>
                                </View>
                                
                            </MenuOptions>
                        </Menu>
                        
                        
                        
                    </View>
                }
                containerStyle={{
                    backgroundColor: '#F7F5D6',
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
                    this._createTaskListModal()
                }
            </View>
        );
    }
}
