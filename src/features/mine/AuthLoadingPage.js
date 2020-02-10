import React, { Component } from 'react'
import { Platform, NetInfo, View } from 'react-native'
import { connect } from "react-redux";
import SplashScreen from 'react-native-splash-screen'
import { DURATION } from 'react-native-easy-toast'
import RNFetchBlob from 'rn-fetch-blob'
const uuidv4 = require('uuid/v4');
import createHttp from '../../common/http';

import VocaGroupDao from '../vocabulary/service/VocaGroupDao';
import FileService from '../../common/FileService';
import { USER_DIR, SHARE_DIR } from '../../common/constant';
import * as MineAction from '../mine/redux/action/mineAction';
import { store } from '../../redux/store';
import { logoutHandle } from './common/userHandler';
import httpBaseConfig from '../../common/httpBaseConfig';
import VocaTaskService from '../vocabulary/service/VocaTaskService';
import ArticleDao from '../reading/service/ArticleDao';
const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'
const ShareQRUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/share/share_qr.png'

class AuthLoadingPage extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true
    }

    componentDidMount() {
        // 全局路由函数
        Navigate = this.props.navigation.navigate
        //debug模式下，此时redux-persist的数据未加载，所以定时
        // this._bootstrap()
        setTimeout(this._bootstrap, 1000)
    }

    // token验证登录状态
    _bootstrap = async () => {
        //隐藏启动页
        SplashScreen.hide();

        //1. 登录进入首页
        if (IsLoginToHome) {
            this.props.app.loader.show("同步数据...", DURATION.FOREVER)
            const loginUserInfo = this.props.navigation.getParam("user")
            const bookWords = this.props.navigation.getParam("words")
            const articles = this.props.navigation.getParam("articles")

            if (loginUserInfo) {
                const { avatarUrl, vocaGroups, vocaTasks, groupOrders } = loginUserInfo
                //保存头像
                if (avatarUrl) {
                    let extname = ".jpg"
                    if (avatarUrl.endsWith(".png")) {
                        extname = ".png"
                    } else if (avatarUrl.endsWith(".jpeg")) {
                        extname = ".jpeg"
                    } else if (avatarUrl.endsWith(".gif")) {
                        extname = ".gif"
                    }
                    const res = await FileService.getInstance().fetch(avatarUrl, DocumentDir + USER_DIR + uuidv4() + extname)
                    const avatarSource = { uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }
                    console.log(avatarSource)
                    this.props.setAvatarSource({ avatarSource })
                }
                // 保存vocaGroups ,groupOrders,bookWords,vocaTasks, articles
                if (vocaGroups && vocaGroups.length > 0) {
                    const vgDao = VocaGroupDao.getInstance()
                    vgDao.deleteAllGroups()
                    vgDao.saveVocaGroups(vocaGroups)
                }
                await Storage.save({
                    key: 'groupOrdersString',
                    data: groupOrders ? groupOrders : '[]',  //groupOrders为字符串
                })
                if (vocaTasks && vocaTasks.length > 0) {
                    const vts = new VocaTaskService()
                    vts.deleteAll()
                    vts.saveUserVocaTasks(vocaTasks, bookWords)
                }
                if (articles && articles.length > 0) {
                    const artDao = ArticleDao.getInstance()
                    artDao.deleteAllArticles()
                    artDao.saveArticles(articles)
                }
            }
            //保存分享的二维码
            const shareDir = DocumentDir + SHARE_DIR
            const isExist = fs.exists(shareDir)
            if (!isExist) {
                await fs.mkdir(shareDir)      //创建目录
            }
            res = await FileService.getInstance().fetch(ShareQRUrl, shareDir + 'share_qr.png')
            console.log(res.path())
            this.props.app.loader.close()
        }


        // 定义全局请求对象
        global.Http = createHttp(null, { showLoader: true, shouldRefreshToken: true })
        //判断是否过期
        const { accessToken, expiresIn, refreshToken } = this.props.mine.credential
        console.log(Date.now())
        console.log(expiresIn)
        if (accessToken && expiresIn && Date.now() < expiresIn) {
            console.log('直接进入App')
            // 直接进入App
            this.props.navigation.navigate('HomeStack')
        } else {
            if (!refreshToken || refreshToken === "") { //安装后第一次打开App
                this.props.navigation.navigate('LoginStack')
                return
            }
            NetInfo.isConnected.fetch().done(async (isConnected) => {
                if (isConnected) { //网络正常
                    const tokenHttp = createHttp()
                    const tokenRes = await tokenHttp.post("/refreshToken", { refreshToken })
                    if (tokenRes.status === 200) {
                        console.log("--------------auth 刷新token-------------------")
                        const credential = tokenRes.data
                        //修改Http的Authorization
                        Http.defaults.headers.common['Authorization'] = credential.accessToken
                        //修改redux
                        store.dispatch({ type: MineAction.MODIFY_CREDENTIAL, payload: { credential } })
                        this.props.navigation.navigate('HomeStack')
                    }
                } else {   //无网络
                    logoutHandle()
                }
            })
        }


    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    app: state.app,
    mine: state.mine
})

const mapDispatchToProps = {
    setAvatarSource: MineAction.setAvatarSource,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingPage)