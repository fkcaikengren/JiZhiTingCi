import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header, Button } from 'react-native-elements'

import AliIcon from '../../component/AliIcon'
import gstyles from '../../style'
import FileService from '../../common/FileService'
import { VOCABULARY_DIR, FILE_ROOT_DIR } from '../../common/constant'

import DictDao from './service/DictDao';
import WebUtil from '../../common/webUtil';

export default class DictPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            html: null
        }
        this.dictDao = DictDao.getInstance()
    }

    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })
        //初始化
        this._init()
    }

    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = async ()=>{
        const word = this.props.navigation.getParam('word')
        let html = ''
        try {
            const realm = await this.dictDao.open()
            console.log(realm);
            html = this.dictDao.getHtmlByWord(word)
        } catch (error) {
            html = '<div>出错了，请返回重试！</div>'
        }
        this.setState({ html })
    }

    // 首次发送
    _sendInitMessage = () => {
        //发送文本给Web
        this.webref.postMessage(
            JSON.stringify({
                command: 'initPage', payload: {
                    contentHtml: this.state.html
                }
            })
        );
    }
    _onMessage = (e) => {
        let data = JSON.parse(e.nativeEvent.data);
        // console.log(data)
        switch (data.command) {
            case 'initStart':
                console.log('dict.html 开始初始化')
                this._sendInitMessage()
                break;
            case 'error':
                break;
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack()
                        }} />}

                    centerComponent={{ text: '单词词典', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={{ flex: 1 }}>
                    {this.state.html &&
                        <WebView
                            ref={r => (this.webref = r)}
                            // 访问本地html时，需设置源的白名单为所有
                            originWhiteList={['*']}
                            javaScriptEnabled={true}
                            onMessage={this._onMessage}
                            onError={(error) => {
                                console.log("error", error);
                            }}
                            // 发送给web的初始化脚本
                            injectedJavaScript={WebUtil.DICT_LISTEN_JAVASCRIPT}
                            source={{
                                uri: 'file:///android_asset/web/dict.html',
                                // <script src='./js/zepto.min.js'/>会以这个为根目录查找资源，否则引入的zepto.js等无效
                                baseUrl: 'file:///android_asset/web/',
                            }}
                        />
                    }
                </View>
            </View>

        );
    }
}

