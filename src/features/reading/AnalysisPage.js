import React from 'react';
import {StyleSheet,StatusBar, View, Text, Button, TouchableWithoutFeedback} from 'react-native';
import {Header} from 'react-native-elements'
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux';

import Loader from '../../component/Loader'
import * as ArticleAction from './redux/action/articleAction'
import AliIcon from '../../component/AliIcon'
import FileService from '../../common/FileService'
import * as Constant from './common/constant'
import gstyles from '../../style'
import styles from './AnalysisStyle'
import WebUtil from '../../common/webUtil'
import ReadUtil from './common/readUtil';
import _util from '../../common/util'

class AnalysisPage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
    }

    
    //发送给Web, 初始化
    _sendInitMessage = ()=>{
        const {bgThemes, themeIndex, fontRem,articleText, options,analysisText, rightAnswers, userAnswerMap} = this.props.article
        const handin = this.props.navigation.getParam('handin')
        const articleType = this.props.navigation.getParam('articleInfo').type
        const userAnswers = ReadUtil.strMapToObj(userAnswerMap)
        try{
            //答案的格式：文章 or 答案键值对
            let content = null
            let hasArticle = true
            if(articleType===Constant.MULTI_SELECT_READ || articleType===Constant.FOUR_SELECT_READ){
                content = articleText
            }else{
                hasArticle = false
                content = Object.create(null)
                for(let k in rightAnswers){
                    const Opt = ReadUtil.getOptionObj(options, k)
                    const word = Opt[rightAnswers[k]]
                    if(articleType===Constant.DETAIL_READ){
                        content[k] = rightAnswers[k]
                    }else{
                        content[k] = rightAnswers[k] + ' ' + word
                    }
                }
            }
            // console.log(content)
            //发送给Web
            this.webref.postMessage(
                JSON.stringify({command:'initPage', payload:{
                    analysis:analysisText,
                    showRightAnswers:handin,
                    rightAnswers:rightAnswers,
                    formatAnswer:{hasArticle, content},
                    showUserAnswers:handin,
                    userAnswers:userAnswers,
                    color:bgThemes[themeIndex],
                    size:fontRem+'rem'
                }})
            );
        }catch(e){
            console.log(e)
        }
    }
 
    _toggleRightAnswers = ()=>{
        //发送给Web
        this.webref.postMessage(
            //是否显示用户答案，是否显示答案, 显示解析
            JSON.stringify({command:'toggleRightAnswers', payload:{}})
        );
    }

    //接收Web信息
    _onMessage = (e) =>{
        let data = JSON.parse(e.nativeEvent.data);
        console.log(data)
        switch(data.command){
            case 'initStart':
                console.log('----initStart-----')
                this._sendInitMessage()
            break;
            case 'initFinish':
                    console.log('----initFinish-----')
                this.props.changeWebLoading(false)
            break;
            case 'exit':
                console.log('退出')
            case 'error':

            break;
        }
    }

    _renderContent = ()=>{
        const {bgThemes, themeIndex,isLoadPending , isLoadFail} = this.props.article
        const handin = this.props.navigation.getParam('handin')
        if(isLoadFail){
            return <View style={[gstyles.c_center,{flex:1}]}>
                    <AliIcon name={'nodata_icon'} size={100} color={gstyles.black} />
                    <Text style={gstyles.md_black}>出错了...</Text>
                </View>
        }else{
            return <View>
                {!isLoadPending &&
                    <View style={[styles.webContainer,{backgroundColor:bgThemes[themeIndex]}]}>
                        <WebView
                            ref={r => (this.webref = r)}
                            originWhiteList={['*']} 
                            javaScriptEnabled={true}
                            // 接受web的数据
                            onMessage={this._onMessage}
                            onError={(error) => {
                                console.log("error", error);
                            }}
                            
                            // 发送给web的脚本
                            injectedJavaScript={WebUtil.ANALYSIS_LISTEN_JAVASCRIPT}
                            source={{
                                uri:'file:///android_asset/web/analysis.html',
                                baseUrl:'file:///android_asset/web/',
                            }}
                            style={[styles.webViewStyle, {backgroundColor:bgThemes[themeIndex]}]}
                                
                        />
                    </View>
                }
                {handin &&
                    <View style={styles.bottomBar}>
                        <TouchableWithoutFeedback onPress={()=>{
                            _util.goPageWithoutStack(this.props.navigation,'Home',{})
                        }}>
                            <Text style={styles.barText}>退出</Text>
                        </TouchableWithoutFeedback>
                        <View style={styles.seperator}></View>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.changeUserAnswerMap(new Map())
                            this.props.navigation.goBack()
                        }}>
                            <Text style={styles.barText}>重做</Text>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        }
    }

    render() {
        const {bgThemes, themeIndex,isWebLoading, isLoadFail} = this.props.article
        const handin = this.props.navigation.getParam('handin')
        return (
            <View style={[styles.container, {backgroundColor:bgThemes[themeIndex]}]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle="dark-content" // or directly
                    centerComponent={{ text: handin?'练习结果':'答案解析', style: gstyles.lg_black_bold}}
                    rightComponent={isLoadFail || handin?null:
                    <TouchableWithoutFeedback onPress={this._toggleRightAnswers}>
                        <Text style={styles.showAnswerBtn}>答案</Text>
                    </TouchableWithoutFeedback>
                }
                containerStyle={{
                    backgroundColor: bgThemes[themeIndex],
                    justifyContent: 'space-around',
                }}
                />
                {/* WebView : 用户答案，标准答案，解析*/}
                {
                    this._renderContent()
                }
                {/* 答悬浮按钮 */}
                {!handin &&
                    <TouchableWithoutFeedback onPress={()=>{
                        if(isLoadFail){
                            this.props.changeLoadingFail(false)
                        }
                        this.props.navigation.goBack()
                        }}>
                        <View style={[styles.floatBtn]}>
                            <View>
                                <Text style={styles.floatText}>返</Text>
                                <Text style={styles.floatText}>回</Text>
                            </View>
                            <AliIcon name='youjiantou' size={16} color='#303030' />
                        </View>
                    </TouchableWithoutFeedback>
                }
                {isWebLoading &&
                    <View style={[styles.loadingView, {backgroundColor:bgThemes[themeIndex]}]}>
                       <Loader />
                    </View>
                }
            </View>
        )
    }
}


const mapStateToProps = state =>({
    article : state.article,
});

const mapDispatchToProps = {
    loadAnalysis: ArticleAction.loadAnalysis,
    changeWebLoading: ArticleAction.changeWebLoading,
    changeLoadingFail: ArticleAction.changeLoadingFail,
    changeUserAnswerMap: ArticleAction.changeUserAnswerMap,
};
export default connect(mapStateToProps, mapDispatchToProps)(AnalysisPage);