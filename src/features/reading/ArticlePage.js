import React from 'react';
import { View,Text, Button, Easing,
    TouchableHighlight, TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './ArticlePageStyle'
import FileService from './service/FileService'
import ModalBox from 'react-native-modalbox';
import * as RConstant from './common/constant'
import gstyles from '../../style'
import WebUtil from './util/webUtil'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');



export default class ArticlePage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
        this.widths = []
        this.positionY = 0
        this.state = {
            contents:[],
            renderIndex:RConstant.RENDER_COUNT,
            //关键字
            keyWords:['Americans', 'struggle','Episcoal', 'Drane'],
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
        // this._loadArticle()
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
                <View style={[gstyles.r_start,styles.answerPanel]}>
                    {
                        this.state.answerOptions.map((item, index)=>{
                            let selected = null
                            if(this._isSelectedOption(item)){
                                selected = {color:'#1890FFAA'}
                            }
                            return <TouchableOpacity onPress={()=>{
                                this._clickAnswer(item)
                            }}>
                                <Text style={[styles.modalAnswerOption,selected]}>{item}</Text>
                            </TouchableOpacity>
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
            //发送文本给Web
            this.webref.postMessage(
                JSON.stringify({command:'loadPage', payload:{text:text}})
            );
        }catch(e){
            console.log(e)
        }
    }



    _searchWord = (word)=>{
        alert(word)
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
            <View style={styles.contentWrapper}>
                <View style={[gstyles.r_start,{width:width, height:50,}]}>
                    <Button onPress={this._loadArticle} title='加载'/>
                    <TouchableWithoutFeedback onPress={showAnswerModal?this._closeAnswerModal:this._openAnswerModal}>
                        <Text style={{marginRight:10}}>{showAnswerModal?'隐藏选项':'显示选项'}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._toggleKeyWords}>
                        <Text style={{marginRight:10}}>{this.state.showKeyWords?'隐藏关键词':'显示关键词'}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                        console.log(this.state.userAnswers)
                    }}>
                        <Text>交卷</Text>
                    </TouchableWithoutFeedback>
                </View>
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
                    this.props.navigation.navigate('Analysis')
                    }}>
                    <View style={[styles.floatBtn]}>
                        <Text>K</Text>
                        <View>
                            <Text style={styles.floatText}>答</Text>
                            <Text style={styles.floatText}>题</Text>
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
