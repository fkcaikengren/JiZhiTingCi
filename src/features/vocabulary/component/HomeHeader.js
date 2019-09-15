

'use strict';
import React, { Component } from 'react';
import {StatusBar,StyleSheet,Text,View,Image,Animated,RefreshControl, Button, TouchableOpacity
} from 'react-native';
import {PropTypes} from 'prop-types';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { WebView } from 'react-native-webview';

import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style'
import WebUtil from '../../../common/webUtil';


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width; //屏幕宽度
const HEADER_HEIGHT = 290;  //头部背景高度
const TITLE_HEIGHT = 55;    //标题栏高度
export default class HomeHeader extends Component {


  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0)
    };
  }
 

  render() {
    const translateY = this.state.shift.interpolate({
      inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      outputRange: [-30, 0, 25, 30],
      extrapolate: 'clamp',
    });

    const transform = [{translateY}];

    return (

      <ParallaxScrollView
        backgroundColor= '#FFE957'
        contentBackgroundColor= '#F9F9F9'
        parallaxHeaderHeight={HEADER_HEIGHT}
        stickyHeaderHeight={TITLE_HEIGHT}
        showsVerticalScrollIndicator={false}
        renderStickyHeader={this.renderStickyHeader}
        renderForeground={this.renderHeader}
        renderFixedHeader={this.renderFixedHeader}
        scrollEvent={this.onScroll}
        >
        <Animated.View style={[{transform}, styles.childrenView]}>
          { this.props.children }
        </Animated.View>
      </ParallaxScrollView>

    );
  }

  renderFixedHeader = ()=>{
    return   <View style={styles.fixedSection}>
      <Image source={require('../../../image/h_icon.png')} style={styles.headerIcon}/>
      <AliIcon name='chazhao' size={22} color='#FFF'  onPress={this._navVocaSearch} />
    </View>
  }

  onScroll = (e)=>{
    this.state.shift.setValue(e.nativeEvent.contentOffset.y);
  }

  /**吸顶标题栏 */
  renderStickyHeader = ()=> {
    return (
      <View style={styles.stickyHeaderView}>
        <Text style={{color:'#FFF', fontSize:20, paddingLeft:5}}>四级词汇书</Text>
    </View>
    )
  }

  /**导航到词库页面 */
  _navVocaLib = ()=>{
    this.props.navigation.navigate('VocaLib');
  }

  /**导航到单词列表页 */
  _navVocaList = ()=>{
    this.props.navigation.navigate('VocaList');
  }

  /**导航到生词本页面 */
  _navVocaGroup = ()=>{
    this.props.navigation.navigate('VocaGroup');
  }

  /**导航到生词本页面 */
  _navVocaSearch = ()=>{
    this.props.navigation.navigate('VocaSearch');
  }

  //头部
  renderHeader = ()=> {
    return (
      <View style={[styles.webContainer]}>
          <WebView
              nativeConfig={{props: {webContentsDebuggingEnabled: true}}} 
              ref={r => (this.webref = r)}
              originWhiteList={['*']} // 访问本地html时，需设置源的白名单为所有
              javaScriptEnabled={true}
              // 接受web的数据
              onMessage={this._onMessage}
              onError={(error) => {
                  console.log("error", error);
              }}
              // 发送给web的初始化脚本
              injectedJavaScript={WebUtil.PROGRESS_LISTEN_JAVASCRIPT}
              source={{
                  uri:'file:///android_asset/web/progress.html',
                  // <script src='./js/zepto.min.js'/>会以这个为根目录查找资源，否则引入的zepto.js等无效
                  baseUrl:'file:///android_asset/web/',  
              }}
              style={{
                borderWidth:1,
                backgroundColor:'#FFe957',

              }}
          /> 
          {/* 功能按钮 */}
          <View style={styles.headerBottom}>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaList}>
                <AliIcon name='icon-test' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaList}>
                <AliIcon name='ai-list' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaGroup}>
                <AliIcon name='yuedu' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaGroup}>
                <AliIcon name='yingyong-beidanci-yingyongjianjie' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
          </View>
      </View>
      
    );
  }

  _onMessage = (e) =>{
      let data = JSON.parse(e.nativeEvent.data);
      console.log(data)
      switch(data.command){
          case 'initStart':
              console.log('-------------------initStart------------------------------');
              this._sendInitMessage()
          break;
          case "themeChanged":
              console.log(data.payload.themeIndex);
          break;
          
          
      }
  }
  _sendInitMessage = ()=>{
    // const themes
    //创建option
    const data = [0.6, 0.4, 0.2, ];
    const formatter = '30%';
    const themeIndex = 4
    //发送option给Web
    this.webref.postMessage(
        JSON.stringify({command:'update', payload:{
          data:data,
          formatter:formatter,
          themeIndex:themeIndex
        }})
    );
  }


}

const styles = StyleSheet.create({
  imageStyle : {
    width: 100,
    height: 100
  },
  
  headerIcon:{
    width:36,
    height:36,
    borderRadius:30
  },
  stickyHeaderView: {
    height:TITLE_HEIGHT,
    marginLeft: 10+TITLE_HEIGHT,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  fixedSection:{
    width:width,
    height:TITLE_HEIGHT,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:10,
    position: 'absolute',
    top:0,
  },

  webContainer:{
    width:width,
    height: 290,
    backgroundColor:'#FFe957'
  },

  headerBottom: {
    width:SCREEN_WIDTH,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    position:'absolute',
    bottom:40,
    paddingHorizontal:40,
  },
 
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 40
  },

  childrenView: {
    top: -30
  },
  changeBtn: {
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 10,
    paddingHorizontal: 4,
    color: '#FFF',
    fontSize: 12,
  },
  bottom_font: {
    color: '#FFF',
    fontSize: 16,
  }
});



