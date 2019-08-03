import React from 'react';
import {StyleSheet, View,ScrollView, Text, Button, Easing,
    TouchableHighlight, TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import styles from './ArticlePageStyle'
import ArticleService from './service/ArticleService'
import ModalBox from 'react-native-modalbox';
import * as RConstant from './common/constant'
import gstyles from '../../style'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
let newLineCount = -1


export default class ArticlePage extends React.Component {
  
    constructor(props){
        super(props)
        this.articleService = new ArticleService()
        this.widths = []
        this.positionY = 0
        this.state = {
            contents:[],
            renderIndex:RConstant.RENDER_COUNT,
            keyWords:['Americans', 'struggle','Episcoal', 'Drane'],
            endMarginRights:[0,0,0,0,0,0,0,0,0,0,0,0],

            //以下适用于 【题型2】
            //是否显示答案板
            showAnswerModal:false,
            answerOptions:['survive','surrounding','serves','reviewed','reported','recession',
            'households','gather','formally','financially','domestic','competition','communities',
            'circling','accumulate'],
            //标准答案
            rightAnswers:{
                "47": "domestic",
                "48": "communities",
                "49": "survive",
                "50":"gather",
                "51": "serves",
                "52": "surroundings",
                "53": "recession",
                "54": "reported",
                "55": "households",
                "56": "financially"
            },
            //选中的问题 
            selectedQuestion:"48",
            //用户的答案
            userAnswers: new Map()
        }
        
    }

    componentDidMount(){
    }


    componentDidUpdate(){
        if(this.state.renderIndex < this.state.contents.length){
            //做加法
            setTimeout(()=>{
                if(this.state.renderIndex + RConstant.RENDER_COUNT > this.state.contents.length){
                    console.log('end')
                    this.setState({renderIndex: this.state.contents.length})
                }else{
                    console.log('+RENDER_COUNT')
                    this.setState({renderIndex: this.state.renderIndex+RConstant.RENDER_COUNT})
                }
            }, RConstant.RENDER_COUNT)
        }
    }

    _closeAnswerModal = ()=>{
        this.setState({showAnswerModal:false})
    }

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
    }


    // 加载文章
    _loadArticle = async ()=>{
        try{
            const text = await this.articleService._loadArticle('2.txt')
            const contents = text.match(RConstant.SEPERATOR_REG)
            this.setState({contents:contents})
        }catch(e){
            console.log(e)
        }
    }



    //布局回调函数，在页面整体渲染完后回调
    _onLayout = (event)=>{
        let {x, y, width, height} = event.nativeEvent.layout;
        if(y > this.positionY){ //说明换行了
            this.positionY = y
            this.widths = [width]
        }else{
            this.widths.push(width)
        }

    }

    // 渲染文章内容
    _renderContents = ()=>{
        
        let marginIndex = -1
        const renderContents = this.state.contents.filter((item, i)=>{
            return i<this.state.renderIndex
        })
        return renderContents.map((item, i, rs)=>{
            let isEnd = false
            const obj = item.match(RConstant.WORD_REG)
            let spaceStyle = {marginRight:0}
            if(rs[i+1] ){           
                if(rs[i+1].match(/\s/i)){ //下一个是空格
                    spaceStyle = {marginRight:5}
                }
                if(rs[i+1].includes('\n')){//下一个是换行
                    // console.log('换行')
                    isEnd = true
                }
            }
            if(obj){    //如果是单词
                let keyWord = {}
                if(this.state.keyWords.includes(obj[0])){
                    keyWord = {color:'#F2753F'}
                }
                
                return  <TouchableHighlight key={item+i}
                        onPress={()=>{this._searchWord(obj[0])}}
                        onLayout={this._onLayout}>
                            <Text style={[styles.word,spaceStyle, keyWord]}>{obj[0]}</Text>
                   </TouchableHighlight>
            }else{                          //如果是非单词
                if(item === '##'){
                    return <Text key={item+i} style={{width:16}}></Text>
                }else if(item.match(/\d+点击答题/)){        //【题型2】点击答题
                    const questionNum = item.match(/\d+/)[0]

                    //如果已做，显示单词
                    let word = this.state.userAnswers.get(questionNum)
                    const finished = word?{color:'#F29F2F'}:null
                    if(!word){
                        word = item.substring(questionNum.length)
                    }
                    //选择
                    let selected = null
                    if(this.state.selectedQuestion === questionNum){
                        selected={color:'#1890FFAA'}
                    }
                    
                    return <TouchableHighlight  key={item+i}
                        onPress={()=>{
                            this._clickQuestion(questionNum)
                        }}
                        onLayout={this._onLayout}>
                            <Text style={ styles.clickQuestionBtnWrapper}> {`(${questionNum})`}
                                <Text style={[styles.clickQuestionBtn, finished, selected]} >{` ${word}`}
                                </Text>
                            </Text>
                            
                    </TouchableHighlight>
                }else if(item.includes('\n')){ //换行
                    return <View key={item+i} 
                        style={{width:width,height:20}} 
                        onLayout={e=>{
                            this.widths = []
                        }}>
                        
                    </View>
                }else if(item.match(/\s/i)){ //空格以及空字符
                    //do nothing
                    
                    if(isEnd){
                        marginIndex++
                       
                        return <Text key={item+i}
                            style={{color:'red',width:this.state.endMarginRights[marginIndex]}} 
                            onLayout={e=>{
                                newLineCount++
                                // console.log(this.widths)
                                let widthSum = 0
                                for(let w of this.widths){
                                    widthSum += (w+5)
                                }
                                // console.log(newLineCount)
                                //改变右边距
                                let marginRights = [...this.state.endMarginRights]
                                const marginR = width - 10 - widthSum 
                                if( marginR > 0){
                                    marginRights[newLineCount] = marginR
                                }else{
                                    marginRights[newLineCount] = 0
                                }
                                
                                this.setState({endMarginRights: marginRights})
                            }}></Text>
                    }
                }else{
                    return <Text key={item+i} 
                        style={[styles.word, spaceStyle]}
                        onLayout={this._onLayout}>{item}</Text>
                    
                }
            }
            
        })
    }

    _searchWord = (word)=>{
        alert(word)
    }




    render() {
        const {showAnswerModal} = this.state
        return (
            <View style={styles.contentWrapper}>
                <View style={[gstyles.r_start,{width:width, height:50,}]}>
                    <Button onPress={this._loadArticle} title='加载'/>
                    <TouchableWithoutFeedback onPress={showAnswerModal?this._closeAnswerModal:this._openAnswerModal}>
                        <Text>{showAnswerModal?'隐藏选项':'显示选项'}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{
                        console.log(this.state.userAnswers)
                    }}>
                        <Text>交卷</Text>
                    </TouchableWithoutFeedback>
                </View>
                {/* 阅读文章 */}
                <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}>
                {
                    this._renderContents()
                }
                {this.state.renderIndex>=this.state.contents.length &&
                    <View style={{width:width,height:5,marginBottom:190}}>
                    </View>
                }
                </ScrollView>
                {/* 答悬浮按钮 */}
                <TouchableWithoutFeedback onPress={()=>{
                    console.log(this.positionX)
                    console.log(this.widths)
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
