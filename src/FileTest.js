import React from 'react';
import {View, Text, TouchableWithoutFeedback, Image, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import FileService from "./common/FileService";
import gstyles from './style'
import AudioService from "./common/AudioService";

import RNFetchBlob from 'rn-fetch-blob'
const fs = RNFetchBlob.fs
const dirs = fs.dirs
const CacheDir = dirs.CacheDir + '/'
const DocumentDir = dirs.DocumentDir + '/'

export default class FileTest extends React.Component {

    constructor(props){
        super(props)
        //初始化文件
        this.fileService = FileService.getInstance()
        this.audioService = AudioService.getInstance()
        this.state = {
            imgSource:null,
            vocabularySize:0
        }
    }

    componentDidMount(){
        SplashScreen.hide();
    }


    render() {

        return (
            <View style={[{flex:1, marginTop:50}]}>
                <TouchableWithoutFeedback onPress={()=>{
                    const url = 'articles/cet-6/1993-1-4-analysis.txt'
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.load(primaryDir,secondDir, url )
                        .then(data=>{
                            console.log(data)
                        })
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>文章：测试text</Text>
                </TouchableWithoutFeedback>


                <TouchableWithoutFeedback onPress={()=>{
                    const url = 'articles/cet-6/1995-6-3-option.json'
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.load(primaryDir,secondDir, url )
                        .then(data=>{
                            console.log(data)
                        })
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>文章: 测试json</Text>
                </TouchableWithoutFeedback>

                {/*测试图片*/}
                <TouchableWithoutFeedback onPress={()=>{
                    const url = 'example/pic/August-3.jpg'
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.load(primaryDir,secondDir, url )
                        .then(data=>{
                            console.log(data)
                            this.setState({
                                imgSource:data
                            })
                        })
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>测试图片</Text>
                </TouchableWithoutFeedback>
                {this.state.imgSource &&
                    <Image source={this.state.imgSource}
                           style={{width:200,height:100}} />
                }
                <TouchableWithoutFeedback onPress={()=>{
                    const url = 'Adele-Hello.mp3'
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-6/'
                    this.audioService.playSound({
                        primaryDir,secondDir, filePath:url
                    },null,null,()=>{
                        console.log('say: 播放失败回调。。。')
                        this.audioService.playSound({
                            primaryDir,secondDir, filePath:'example/audio/Brazil-1.mp3'
                        })
                    })


                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>测试音频</Text>
                </TouchableWithoutFeedback>

                {/* 缓存大小 */}
                <TouchableWithoutFeedback onPress={()=>{
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.getSize(DocumentDir + primaryDir+secondDir)
                        .then(size=>{
                            console.log(size)
                            this.setState({vocabularySize:size})
                        })
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>--获取cet-4/ 下载大小--</Text>
                </TouchableWithoutFeedback>
                <Text style={gstyles.md_gray}>{`${this.state.vocabularySize}M`}</Text>
                <TouchableWithoutFeedback onPress={()=>{
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.clearDownload(primaryDir+secondDir)
                        .then(size=>{
                            console.log(size)
                            this.setState({vocabularySize:size})
                        })
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10,color:'red'}]}>清理cet-4/ 下载包</Text>
                </TouchableWithoutFeedback>

                {/* 下载处理*/}
                <TouchableWithoutFeedback onPress={()=>{
                    const url = 'cet-4.zip'
                    const primaryDir =  'vocabulary/'
                    const secondDir = 'cet-4/'
                    this.fileService.download(
                        primaryDir,secondDir, url, null, true
                    )
                }}>
                    <Text style={[gstyles.lg_black_bold,{paddingVertical:10}]}>下载压缩包</Text>
                </TouchableWithoutFeedback>
                <Text style={gstyles.md_gray}>下载成功，压缩包大小：</Text>
            </View>
        );
    }
}

