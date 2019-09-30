import React, { Component } from "react";
import {Platform, View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Header, Button} from 'react-native-elements'
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
const Dirs = RNFetchBlob.fs.dirs
const RootPath = Dirs.DocumentDir + '/bgs/'


import * as VocaPlayAction from './redux/action/vocaPlayAction'
import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './BgSelectorStyle'
import FileService from "../../common/FileService";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


class BgSelectorPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            bgPaths: []
        }

        console.disableYellowBox = true
    }

    componentDidMount(){
        this._init()
    }


    _init = async ()=>{
        const bgUrls = ['https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/1.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/2.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/3.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/4.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/5.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/6.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/7.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/8.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/9.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/10.jpg',
            'https://jzyy-1259360612.cos.ap-chengdu.myqcloud.com/voca/bgs/11.jpg']
        const bgPaths = []
        //判断是否已经缓存过
        console.log('----path-----')
        console.log(this.props.vocaPlay.bgPath)
        const exist = await RNFetchBlob.fs.exists(this.props.vocaPlay.bgPath)
        console.log('------exists----------')
        if(!exist){ //不存在，先下载
            for(let url of bgUrls){
                const res = await RNFetchBlob.config({
                    path: RootPath+ url.match(/\d+\.jpg$/)[0]
                })
                    .fetch('GET', url, {
                    })
                console.log(res.path())
                bgPaths.push((res.path()))
            }
        }else{ //如果已存在，遍历获取
            const stat = await RNFetchBlob.fs.lstat(RootPath)
            // console.log(stat)

            //遍历
            console.log('---遍历----')
            const fileNames = await RNFetchBlob.fs.ls(RootPath)
            for(let fname of fileNames){
                console.log(RootPath+fname)
                bgPaths.push(RootPath+fname)
            }
        }

        this.setState({bgPaths})

    }


    _renderBgs = ()=>{
        const imgWidth = (width/2)-30
        const imgHeight = 1.3*imgWidth
        const imgStyle={
            width:imgWidth,
            height:imgHeight,
            borderRadius:5
        }

        // 网格布局
        return this.state.bgPaths.map((item, i)=>{
            const isSelected = (this.props.vocaPlay.bgPath === item)
            const selectStyle = isSelected?{
                backgroundColor: gstyles.mainColor
            }:null
            return <View style={[{
                    width:'50%', height:1.3*(width/2), },gstyles.r_center]}>
                <TouchableOpacity activeColor={0.9} onPress={()=>{
                    this.props.changeBg(item)
                }}>
                    <View style={imgStyle}>
                        <Image source={{ uri : Platform.OS === 'android' ? 'file://' + item : '' + item }} style={imgStyle} />
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
            
            <View style={{flex: 1}}>
                <Header
                statusBarProps={{ barStyle: 'dark-content' }}
                barStyle='dark-content' // or directly
                leftComponent={ 
                    <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                        this.props.navigation.goBack();
                    }} /> }
             
                centerComponent={{ text:'选择背景', style: gstyles.lg_black_bold}}
                containerStyle={{
                    backgroundColor: gstyles.mainColor,
                    justifyContent: 'space-around',
                }}
                />
                <ScrollView style={{ flex: 1}}
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
const mapStateToProps = state =>({
    vocaPlay : state.vocaPlay
});

const mapDispatchToProps = {
    changeBg : VocaPlayAction.changeBg,
}


export default connect(mapStateToProps,mapDispatchToProps )(BgSelectorPage);