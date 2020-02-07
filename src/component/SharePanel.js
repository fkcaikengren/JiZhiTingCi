
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { PropTypes } from 'prop-types';
import { Grid, Row, Col } from 'react-native-easy-grid'
import AliIcon from './AliIcon';
import gstyles from '../style';
import { store } from '../redux/store';
import WXService from '../common/WXService';
import QQService from '../common/QQService';



export default class SharePanel extends Component {

    constructor(props) {
        super(props);
        this.wxService = WXService.getInstance()
        this.qqService = QQService.getInstance()
    }

    // shareInfo格式
    // {
    //     type: 'news',
    //     title: '标题',
    //     description: '描述',
    //     webpageUrl: 'https://www.aitingci.com', //网页链接
    //     imageUrl: 'https://..'                   //图片地址
    // }
    onShareToTimeline = async () => {
        const shareInfo = await this.props.share()
        if (shareInfo.type === 'imageUrl') {
            shareInfo.imageUrl = 'file://' + shareInfo.imageUrl
        }

        this.wxService.shareToTimeline(shareInfo, () => {
            store.getState().app.toast.show('分享失败！', 2000)
        }, () => {
            store.getState().app.toast.show('分享成功', 2000)
        })
    }

    onShareToSession = async () => {
        const shareInfo = await this.props.share()
        if (shareInfo.type === 'imageUrl') {
            shareInfo.imageUrl = 'file://' + shareInfo.imageUrl
        }
        this.wxService.shareToSession(shareInfo, () => {
            store.getState().app.toast.show('分享失败！', 2000)
        }, () => {
            store.getState().app.toast.show('分享成功', 2000)
        })
    }



    onShareToQzone = async () => {
        const shareInfo = await this.props.share()
        if (shareInfo.type === 'imageUrl') {
            shareInfo.type = 'image'
        }
        console.log(shareInfo)
        this.qqService.shareToQzone(shareInfo, () => {
            store.getState().app.toast.show('分享失败！', 2000)
        }, () => {
            store.getState().app.toast.show('分享成功', 2000)
        })
    }

    onShareToQQ = async () => {
        const shareInfo = await this.props.share()
        if (shareInfo.type === 'imageUrl') {
            shareInfo.type = 'image'
        }
        console.log(shareInfo)
        this.qqService.shareToQQ(shareInfo, () => {
            store.getState().app.toast.show('分享失败！', 2000)
        }, () => {
            store.getState().app.toast.show('分享成功', 2000)
        })
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <Text style={[gstyles.md_lightBlack, { marginTop: 30 }]}>分享至</Text>
                <Grid style={[{ marginHorizontal: 10 }]}>
                    <Col style={gstyles.c_center} onPress={this.onShareToTimeline}>
                        <Image
                            style={[styles.circleIcon]}
                            source={require('../image/pengyouquan_icon.png')} />
                    </Col>
                    <Col style={gstyles.c_center} onPress={this.onShareToSession}>
                        <View style={[gstyles.c_center, styles.circleIcon, { backgroundColor: '#30DE76' }]}>
                            <AliIcon name='weixin1' size={21} color='#EFEFEFCC'></AliIcon>
                        </View>
                    </Col>
                    <Col style={gstyles.c_center} onPress={this.onShareToQzone}>
                        <View style={[gstyles.c_center, styles.circleIcon, { backgroundColor: '#FEC449' }]}>
                            <AliIcon name='qqkongjian' size={24} color='#EFEFEF'></AliIcon>
                        </View>
                    </Col>
                    <Col style={gstyles.c_center} onPress={this.onShareToQQ}>
                        <View style={[gstyles.c_center, styles.circleIcon, { backgroundColor: '#3EC6FB' }]}>
                            <AliIcon name='qq1' size={22} color='#EFEFEFCC'></AliIcon>
                        </View>
                    </Col>
                </Grid>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    circleIcon: {
        borderRadius: 50,
        height: 40,
        width: 40,
    }

});




SharePanel.propTypes = {
    containerStyle: PropTypes.object,
    share: PropTypes.func.isRequired
};

SharePanel.defaultProps = {
    containerStyle: null,
};

