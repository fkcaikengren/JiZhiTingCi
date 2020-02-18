import React, { Component } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text, BackHandler } from 'react-native';
import { Header, Button } from 'react-native-elements'
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from 'react-redux';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import FileService from "../../common/FileService";
import { VOCABULARY_DIR } from "../../common/constant";

const fs = RNFetchBlob.fs
const dirs = fs.dirs
const CacheDir = dirs.CacheDir + '/'



const styles = StyleSheet.create({

    itemView: {
        height: 60,
        backgroundColor: '#FFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DFDFDF',
        paddingLeft: 10,
    },


    clearBtn: {
        color: 'red',
        position: 'absolute',
        bottom: 20,
    }

});

class DownloadManagePage extends React.Component {
    constructor(props) {
        super(props);
        this.fileService = FileService.getInstance()

        this.state = {
            resourcePackages: [],
            cacheSize: null,
        }

    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            const { confirmModal } = this.props.app
            if (confirmModal.isOpen()) {
                confirmModal.hide()
            } else {
                this.props.navigation.goBack()
            }
            return true
        })
        this._init()
    }
    componentWillUnmount() {
        this.backHandler && this.backHandler.remove('hardwareBackPress');
    }

    _init = async () => {
        //获取离线包信息
        const resourcePackages = await Storage.getAllDataForKey('resourcePackages')
        this.setState({ resourcePackages })

        //获取缓存大小
        const cacheSize = await this.fileService.getSize(CacheDir)
        this.setState({
            cacheSize: cacheSize
        })
    }


    _clearPackage = (packageName, packageId) => {
        this.props.app.confirmModal.show(`是否删除离线包:${packageName}？`, null, () => {
            this.fileService.clearDownload(VOCABULARY_DIR + packageId).then(size => {
                if (size <= 0) {
                    Storage.remove({
                        key: 'resourcePackages',
                        id: packageId
                    }).then(async () => {
                        this.props.app.toast.show('删除成功', 1000)
                        const resourcePackages = await Storage.getAllDataForKey('resourcePackages')
                        this.setState({ resourcePackages })
                    })
                }

            })
        })
    }

    _clearCache = () => {
        this.props.app.confirmModal.show('是否清空缓存？', null, () => {
            this.fileService.clearCache().then(size => {
                this.setState({ cacheSize: size })
            })
        })
    }

    render() {

        return (
            <View style={[{ flex: 1, backgroundColor: '#EFEFEF' }, gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content'
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={() => {
                            this.props.navigation.goBack();
                        }} />}
                    centerComponent={{ text: '离线管理', style: gstyles.lg_black_bold }}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />
                <View style={{ width: '100%', marginTop: 10 }}>
                    {this.state.resourcePackages &&
                        this.state.resourcePackages.map((item, i) => {
                            return <TouchableOpacity activeOpacity={0.7} onPress={() => { this._clearPackage(item.packageName, item.packageId) }}>
                                <View style={[gstyles.r_between, styles.itemView]} >
                                    <Text numberOfLines={1} style={[gstyles.md_black_bold, { marginLeft: 20 }]}>
                                        {item.packageName}
                                    </Text>
                                    <Text style={[gstyles.md_gray, { marginRight: 20 }]}>{item.packageSize}M</Text>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                    <TouchableOpacity activeOpacity={0.7} onPress={this._clearCache}>
                        <View style={[gstyles.r_between, styles.itemView]}>
                            <Text numberOfLines={1} style={[gstyles.md_black_bold, { marginLeft: 20 }]}>
                                清除缓存
                            </Text>
                            <Text numberOfLines={1} style={[gstyles.md_gray, { marginRight: 20 }]}>
                                {this.state.cacheSize === null ? '计算中..' : this.state.cacheSize + "M"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
})

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(DownloadManagePage)