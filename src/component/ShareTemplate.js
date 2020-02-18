import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Image, Animated, } from 'react-native';
import Sound from 'react-native-sound'
import ViewShot from 'react-native-view-shot';
import SharePanel from './SharePanel'
import AliIcon from './AliIcon'
import gstyles from '../style';
import RNFetchBlob from 'rn-fetch-blob'
import _util from '../common/util';
import { SHARE_DIR } from '../common/constant';

const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const fs = RNFetchBlob.fs
const CacheDir = fs.dirs.CacheDir + '/'
const shareDir = fs.dirs.DocumentDir + '/' + SHARE_DIR






/**
 * 关于CommonModal的展示模板
 */
export default class ShareTemplate {

    static _renderShareView({ commonModal, title = '', bgSource, renderContentView, showSeal }) {


        // 返回一个函数
        return () => {
            const {
                getContentState,
                setContentState,
                hide,
            } = commonModal
            const qrPath = shareDir + 'share_qr.png'
            const { sealSize } = getContentState()
            return <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={gstyles.md_black}>{title}</Text>
                    <AliIcon name='guanbi' size={26} color='#555' style={styles.closeBtn}
                        onPress={() => {
                            hide()
                        }} />

                </View>
                {showSeal &&
                    <Animated.Image
                        source={require('../image/seal_icon.png')}
                        style={[
                            styles.sealIcon,
                            {
                                width: sealSize, height: sealSize,
                                transform: [
                                    {
                                        rotate: sealSize.interpolate({ // 旋转，使用插值函数做值映射
                                            inputRange: [120, 300],
                                            outputRange: ['360deg', '0deg',]
                                        })
                                    },

                                ],
                            }
                        ]}>
                    </Animated.Image>


                }
                <ViewShot ref={comp => this.viewShot = comp} style={styles.captureView}>
                    <Image source={bgSource} style={styles.shareBg} />

                    <View style={styles.shareLogo}>
                        <Image source={require('../image/logo_share.png')} style={{ width: 24, height: 24, borderRadius: 5 }} />
                        <View style={[gstyles.c_start_left, { marginLeft: 10 }]}>
                            <Text style={{ fontSize: 14, color: '#FFF', fontWeight: '500', lineHeight: 16 }}>爱 听 词</Text>
                            <Text style={{ fontSize: 8, color: '#FFF', lineHeight: 10 }}> aitingci.com</Text>
                        </View>
                    </View>

                    <View style={styles.shareContent}>
                        {renderContentView}
                    </View>
                    <View style={styles.shareQR}>
                        <Image source={{ uri: Platform.OS === 'android' ? 'file://' + qrPath : qrPath }}
                            style={{ width: 42, height: 42, borderRadius: 2, }} />
                        <Text style={{ fontSize: 13, color: '#FFF', marginLeft: 15 }}>长按识别二维码</Text>
                    </View>
                </ViewShot>

                <SharePanel
                    containerStyle={styles.sharePanel}
                    share={async () => {
                        let { imageUrl } = getContentState()
                        //要相册权限
                        await _util.checkPermission()
                        if (!imageUrl) {
                            const uri = await this.viewShot.capture() //保存截图
                            const filename = uri.replace(/.+cache\/(.+\.[a-z]+)/, '$1')
                            const originPath = CacheDir + filename
                            imageUrl = fs.dirs.PictureDir + '/' + filename
                            await RNFetchBlob.fs.cp(originPath, imageUrl)
                            setContentState({
                                imageUrl: imageUrl,
                            })
                        }
                        return {
                            type: 'imageUrl', //分享纯图片imageUrl
                            imageUrl: imageUrl
                        }
                    }}
                />
            </View >
        }

    }

    /**
     * 显示分享模板
     * @param {*} commonModal 
     */
    static show({
        commonModal, title, bgSource, renderContentView, showSeal = false
    }) {
        const {
            show,
            setContentState,
            getContentState
        } = commonModal
        setContentState({
            imageUrl: null,
            sealSize: new Animated.Value(300)
        })
        show({
            renderContent: this._renderShareView({ commonModal, title, bgSource, renderContentView, showSeal }), //函数
            modalStyle: {
                width: width,
                height: height,
                backgroundColor: "#AAA",
            },
            position: 'bottom',
            //动画
            animationDuration: 1
        })

        if (showSeal) {
            setTimeout(() => {
                setTimeout(() => {
                    const musciPath = require('../audio/complete_seal.mp3');
                    const music = new Sound(musciPath, (error) => {
                        if (error) {
                            console.log("播放失败。。。");
                        }
                        music.play()
                    })
                }, 1000)
                Animated.timing(
                    // timing方法使动画值随时间变化
                    getContentState().sealSize,
                    {
                        toValue: 120, duration: 1500
                    }).start();
            }, 100)
        }
    }
}

const styles = StyleSheet.create({

    container: {
        ...gstyles.c_start,
        flex: 1,
        width: "100%",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    },
    closeBtn: {
        position: "absolute",
        top: 10,
        right: 15
    },
    titleBar: {
        ...gstyles.r_center,
        width: '100%',
        height: 50,
    },
    captureView: {
        width: '70%',
        height: 340,
    },
    shareBg: {
        width: '100%',
        height: 340
    },
    shareLogo: {
        position: 'absolute',
        left: 15,
        top: 15,
        ...gstyles.r_start
    },
    shareQR: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        ...gstyles.r_start
    },
    shareContent: {
        ...gstyles.c_start,
        position: 'absolute',
        width: '100%',
        paddingTop: 60,
        top: 0,
        left: 0
    },
    sharePanel: {
        width: '100%',
        height: 160,
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    sealIcon: {
        position: 'absolute',
        bottom: 200,
        right: 40,
        zIndex: 100,
    }
});

