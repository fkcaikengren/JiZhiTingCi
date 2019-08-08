import React from 'react';
import {StyleSheet,StatusBar, View, Text, Button, TouchableWithoutFeedback} from 'react-native';
import {Header} from 'react-native-elements'
import { WebView } from 'react-native-webview';
import {connect} from 'react-redux';

import AliIcon from '../../component/AliIcon'
import FileService from './service/FileService'
import * as RConstant from './common/constant'
import gstyles from '../../style'
import styles from './AnalysisStyle'
import WebUtil from './util/webUtil'

class AnalysisPage extends React.Component {
  
    constructor(props){
        super(props)
        this.fileService = new FileService()
        this.userAnswers = this.props.navigation.getParam('userAnswers')
        this.handin = this.props.navigation.getParam('handin')
    }

    componentDidMount(){
        setTimeout(()=>{
            this._loadAnalysis()
        }, 100)

    }

    
    // 加载答案、解析
    _loadAnalysis = async ()=>{
        const {bgThemes, themeIndex, fontRem} = this.props.article
        try{
            const analysis = await this.fileService.loadText('3-analysis.txt')
            const answerArticle = await this.fileService.loadText('2-article.txt')
            const rightAnswers={
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
            }
            //发送给Web
            this.webref.postMessage(
                //是否显示用户答案，是否显示答案, 显示解析
                JSON.stringify({command:'loadPage', payload:{
                    analysis:analysis,
                    showRightAnswers:false,
                    rightAnswers:rightAnswers,
                    answerArticle:answerArticle,
                    showUserAnswers:this.handin?true:false,
                    userAnswers:this.userAnswers,
                    color:bgThemes[themeIndex],
                    size:fontRem+'rem'
                }})
            );
        }catch(e){
            console.log(e)
        }
    }
   
 
    _toggleRightAnswers = ()=>{
        this._loadAnalysis()
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
            case 'error':

            break;
        }
    }

    render() {
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
                centerComponent={{ text: this.handin?'练习结果':'答案解析', style: { color: '#303030', fontSize:18 } }}
                rightComponent={this.handin?null:
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
                <View style={styles.webContainer}>
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
                        style={ styles.webViewStyle}
                            
                    />
                </View>
                {this.handin &&
                    <View style={styles.bottomBar}>
                        <TouchableWithoutFeedback>
                            <Text style={styles.barText}>退出</Text>
                        </TouchableWithoutFeedback>
                        <View style={styles.seperator}></View>
                        <TouchableWithoutFeedback onPress={()=>{
                            this.props.navigation.goBack()
                        }}>
                            <Text style={styles.barText}>重做</Text>
                        </TouchableWithoutFeedback>
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
    
};
export default connect(mapStateToProps, mapDispatchToProps)(AnalysisPage);