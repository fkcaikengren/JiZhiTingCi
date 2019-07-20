

'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,Text,View,Image,Animated,RefreshControl, Button, TouchableOpacity
} from 'react-native';
import {PropTypes} from 'prop-types';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import * as Progress from '../../../component/react-native-progress';
import AliIcon from '../../../component/AliIcon'


const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width; //屏幕宽度
const HEADER_HEIGHT = 290;  //头部背景高度
const TITLE_HEIGHT = 55;    //标题栏高度
export default class Header extends Component {
  static propsType = {
    
  };

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
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
        renderStickyHeader={this.renderTitle}
        renderForeground={this.renderHeader}
        renderBackground={this.renderBackground}
        scrollEvent={this.onScroll}
        >
        <Animated.View style={[{transform}, styles.childrenView]}>
          { this.props.children }
        </Animated.View>
      </ParallaxScrollView>

    );
  }

  onScroll = (e)=>{
    this.state.shift.setValue(e.nativeEvent.contentOffset.y);
  }
  
  //头部背景
  renderBackground = ()=> {
    return (
      <Image source={require('../../../image/h2.jpg')}/>
    );
  }

  //吸顶标题栏
  renderTitle = ()=> {
    return (
      <View style={styles.stickyHeaderView}>
        <View style={{flexDirection:'row',paddingLeft:5}}>
          <Image source={require('../../../image/h_icon.png')} style={{width:30,height:30,borderRadius:30}}/>
          <Text style={{color:'#FFF', fontSize:20, paddingLeft:5}}>四级词汇书</Text>
        </View>
        <AliIcon name='chazhao' size={22} color='#FFF' onPress={this._navVocaSearch}></AliIcon>
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
        <View style={styles.headerView}>
          {/* 头部的顶部栏 */}
          <View style={{
            width:SCREEN_WIDTH-20,
            height:TITLE_HEIGHT,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
          }}>
            <Image source={require('../../../image/h_icon.png')} style={{width:36,height:36,borderRadius:30}}/>
            <AliIcon name='chazhao' size={22} color='#FFF' onPress={this._navVocaSearch}></AliIcon>
          </View>
          {/* 环形进度条 */}
          <Progress.Circle 
            size={140} 
            progress={0.20}
            animated={false}
            color='#1890FF'         //环形填充色
            unfilledColor="#F29F3F"    //环形未填充色
            fill="#EFEFEF"             //内部填充色
            thickness={5}
        
          showsText={true}
          formatText = {progress => <View style={styles.c_center}>
            <Text style={{color:'#1890FF', fontSize:40}}>{`${Math.round(progress * 100)}%`}</Text>
            <Text style={{color:'#1890FF', fontSize:10}}>已持续5天</Text>
          </View>}
          />
          {/* 头部的底部栏 */}
          <View style={styles.headerBottom}>
            <View style={styles.r_start}>
              <Text style={styles.bottom_font}>四级词汇书</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaLib}>
                <Text style={styles.changeBtn}>更换</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaList}>
                <AliIcon name='ai-list' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={this._navVocaGroup}>
                <AliIcon name='yuedu' size={24} color='#FFF' style={{marginLeft:10}}></AliIcon>
              </TouchableOpacity>
              
            </View>
            <Text style={styles.bottom_font}>任务 1/6</Text>
          </View>
        </View>
    );
  }


}

const styles = StyleSheet.create({
  c_center : {
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  r_start : {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  imageStyle : {
    width: 100,
    height: 100
  },
  headerView: {
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    height:HEADER_HEIGHT,
  },
  headerBottom: {
    width:SCREEN_WIDTH,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    position:'absolute',
    bottom:40,
    paddingHorizontal:10,
  },
  forecast: {
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 3,
    color: '#fff'
  },
  stickyHeaderView: {
    height:TITLE_HEIGHT,
    width:SCREEN_WIDTH-10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
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



