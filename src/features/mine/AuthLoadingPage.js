import React, { Component } from 'react'
import { Platform, View } from 'react-native'
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

import VocaTaskService from '../vocabulary/service/VocaTaskService';
import ArticleDao from '../reading/service/ArticleDao';
const fs = RNFetchBlob.fs
const DocumentDir = fs.dirs.DocumentDir + '/'
const ShareQRUrl = 'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/resources/share/share_qr.jpg'

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
                const { avatarUrl, statistic, vocaGroups, vocaTasks, groupOrders } = loginUserInfo
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
                    if (res) {
                        const avatarSource = { uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }
                        console.log(avatarSource)
                        this.props.setAvatarSource({ avatarSource })
                    }
                }
                // 保存vocaGroups ,groupOrders,bookWords,vocaTasks, articles
                for (let fDay of statistic.finishDays) {
                    Storage.save({
                        key: 'finishDays',
                        id: fDay,
                        data: fDay
                    });
                }
                Storage.save({
                    key: 'finishedBooks',
                    data: statistic.finishedBooks
                });

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
            res = await FileService.getInstance().fetch(ShareQRUrl, shareDir + 'share_qr.jpg')
            console.log(res.path())
            this.props.app.loader.close()
        }
        // 定义全局请求对象
        global.Http = createHttp(null, { showLoader: true })

        //判断是否登录
        const { accessToken, expiresIn, refreshToken } = this.props.mine.credential
        if (accessToken && expiresIn && refreshToken) {
            // 已登录
            this.props.navigation.navigate('HomeStack')
        } else {
            //   未登录
            this.props.navigation.navigate('LoginStack')
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