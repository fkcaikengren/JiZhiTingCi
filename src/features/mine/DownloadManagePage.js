import React, {Component} from 'react';
import {Platform, View, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';
import {Header,Button} from 'react-native-elements'
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from 'react-redux';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './DownloadManageStyle'
import FileService from "../../common/FileService";
import {VOCABULARY_DIR} from "../../common/constant";

const fs = RNFetchBlob.fs
const dirs = fs.dirs
const CacheDir = dirs.CacheDir + '/'
const DocumentDir = dirs.DocumentDir + '/'

class DownloadManagePage extends React.Component {
    constructor(props){
        super(props);
        this.fileService = FileService.getInstance()

        this.state={
            storeBlocks:[],
            cacheSize:null,
        }

    }

    componentDidMount(){
        this._init()
    }

    _init = async ()=>{
        //扫描单词包目录，
        //DocumentDir+VOCABULARY_DIR+getParam('bookCode')
        //获取缓存大小
        const cacheSize = await this.fileService.getSize(CacheDir)
        this.setState({
            cacheSize: cacheSize
        })
    }

    render(){
        const {getParam} = this.props.navigation

        return(
            <View style={[{flex:1},gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' // or directly
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }

                    centerComponent={{ text: '离线管理', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={{flex:1,width:'100%'}}>

                    <TouchableOpacity activeOpacity={0.9} onPress={()=>{
                        //弹框提示是否清理
                        this.props.app.confirmModal.show('清空缓存',null,()=>{
                            this.fileService.clearCache()
                            .then(size=>{
                                this.setState({cacheSize:size})
                            })
                        })
                    }}>
                        <View style={[gstyles.r_between, styles.itemView]}>
                            <Text numberOfLines={1} style={[gstyles.md_black_bold, {marginLeft:20}]}>
                                清除缓存
                            </Text>
                            <Text numberOfLines={1} style={[gstyles.md_gray,{marginRight:20}]}>
                                {this.state.cacheSize === null?'计算中..':this.state.cacheSize+"M"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
                <TouchableWithoutFeedback>
                    <Text style={[gstyles.lg_black,styles.clearBtn]}>全部清理</Text>
                </TouchableWithoutFeedback>
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