import React, { Component } from "react";
import { Platform, View, Text, Image, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { Header, Button } from 'react-native-elements'
import { DURATION } from 'react-native-easy-toast'
import { connect } from 'react-redux';

import RNFetchBlob from 'rn-fetch-blob';
const Dirs = RNFetchBlob.fs.dirs
const RootPath = Dirs.DocumentDir + '/bgs/'

import createHttp from '../../common/http'
import * as VocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './BgSelectorStyle'
import { BASE_URL } from "../../common/constant";


const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');


class BgSelectorPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bgPaths: [],
        }

        console.disableYellowBox = true
    }
    componentDidMount() {
        //监听物理返回键
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        })

        this._init()
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }


    _init = async () => {

        this.props.app.loader.show("加载中...", DURATION.FOREVER)
        let bgPaths = await Storage.getAllDataForKey('playBgs')
        if (bgPaths.length <= 0) { //不存在，先下载
            const myHttp = createHttp(null, { shouldRefreshToken: true });
            const res = await myHttp.get('/appinfo/getPlayBgs')
            const bgUrls = res.data
            for (let url of bgUrls) {
                url = BASE_URL + url
                const fname = url.match(/[^\/]+(\.(jpg)|(png))$/)[0]
                const path = RootPath + fname
                const res = await RNFetchBlob.config({
                    path: path
                })
                    .fetch('GET', url, {
                    })
                await Storage.save({
                    key: 'playBgs',
                    id: fname,
                    data: path
                })
                bgPaths.push(path)
                console.log('保存：' + res.path())
            }
        }
        this.props.app.loader.close()
        this.setState({ bgPaths })
    }


    _renderBgs = () => {
        const imgWidth = (width / 2) - 30
        const imgHeight = 1.3 * imgWidth
        const imgStyle = {
            width: imgWidth,
            height: imgHeight,
            borderRadius: 5
        }

        // 网格布局
        return this.state.bgPaths.map((item, i) => {
            const isSelected = (this.props.vocaPlay.bgPath === item)
            const selectStyle = isSelected ? {
                backgroundColor: gstyles.mainColor
            } : null
            return <View style={[{
                width: '50%', height: 1.3 * (width / 2),
            }, gstyles.r_center]}>
                <TouchableOpacity activeColor={0.9} onPress={() => {
                    this.props.changeBg(item)
                }}>
                    <View style={imgStyle}>
                        <Image source={{ uri: Platform.OS === 'android' ? 'file://' + item : '' + item }} style={imgStyle} />
                        <View style={[styles.selectedBottom, gstyles.r_center, selectStyle]}>
                            {isSelected &&
                                <AliIcon name='complete' size={26} color={'green'} />
                            }
                            {!isSelected &&
                                <Text style={gstyles.md_gray}>选择</Text>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        })
    }

    render() {

        //数据
        return (

            <View style={{ flex: 1 }}>
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack()
                        }} />}

                    centerComponent={{ text: '选择背景', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={styles.content}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        this._renderBgs()
                    }
                </ScrollView>

            </View>


        );
    }
}
const mapStateToProps = state => ({
    app: state.app,
    vocaPlay: state.vocaPlay
});

const mapDispatchToProps = {
    changeBg: VocaPlayAction.changeBg,
}


export default connect(mapStateToProps, mapDispatchToProps)(BgSelectorPage);