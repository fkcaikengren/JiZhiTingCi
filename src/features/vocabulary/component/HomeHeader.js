

'use strict';
import React, { Component } from 'react';
import {StatusBar,StyleSheet,Text,View,Image,Animated,RefreshControl, Button, TouchableOpacity
} from 'react-native';
import {PropTypes} from 'prop-types';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {Grid, Col, Row} from 'react-native-easy-grid'

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

  renderStickyHeader = ()=>{
    return   <View style={{width:width,height:TITLE_HEIGHT, backgroundColor:'#FFE957'}}></View>
  }
  renderFixedHeader = ()=>{
    return   <View style={styles.fixedSection}>
      <AliIcon name='wode' size={26} color='#202020'  onPress={this._navVocaSearch} />
      <Text style={{color:'#202020',fontSize:14}}>四级核心必考词汇</Text>
      <AliIcon name='chazhao' size={24} color='#202020'  onPress={this._navVocaSearch} />
    </View>
  }

  onScroll = (e)=>{
    this.state.shift.setValue(e.nativeEvent.contentOffset.y);
  }


  /**导航到词库页面 */
  _navVocaLib = ()=>{
    this.props.navigation.navigate('VocaLib');
  }

  /**导航到单词列表页 */
  _navVocaList = ()=>{
    this.props.navigation.navigate('VocaListTab');
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
      <View style={[styles.headerView]}>
          
          <Grid >
            {/* 内容展示 */}
            <Row style={styles.headerCenter}>
              <Col style={gstyles.c_center}>
                <Text style={styles.smdDarkFont}>掌握单词</Text>
                <Text style={styles.smDarkFont}>
                  <Text style={styles.lgDarkFont}>29</Text>
                  /2300</Text>
              </Col>
              <Col style={gstyles.c_center}>
                <Text style={styles.smdDarkFont}>已学天数</Text>
                <Text style={styles.smDarkFont}>
                  <Text style={styles.lgDarkFont}>59</Text>
                  /140</Text>
              </Col>
            </Row>
            {/* 底部功能按钮 */}
            <Row style={styles.headerBottom}>
              <Col style={gstyles.c_center} onPress={this._navVocaLib}>
                <AliIcon name='ciyun' size={26} color='#202020'  />
                  <Text style={styles.smDarkFont}>词库</Text>
              </Col>
              <Col style={gstyles.c_center} onPress={this._navVocaList}>
                  <AliIcon name='liebiao1' size={26} color='#202020' />
                  <Text style={styles.smDarkFont}>单词列表</Text>
              </Col>
              <Col style={gstyles.c_center} onPress={this._navVocaGroup} >
                  <AliIcon name='wenzhang' size={26} color='#202020' />
                  <Text style={styles.smDarkFont}>生词本</Text>
              </Col>
              <Col style={gstyles.c_center}>
                  <AliIcon name='yuedu1' size={26} color='#202020' />
                  <Text style={styles.smDarkFont}>阅读</Text>
              </Col>
            </Row>
          </Grid>
            
      </View>
      
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

  headerView:{
    width:width,
    height: 290,
    backgroundColor:'#FFe957'
  },
  headerCenter:{
    position:'absolute',
    bottom:'50%',
    paddingHorizontal:20,
  },  
  headerBottom: {
    position:'absolute',
    bottom:'16%',
    paddingHorizontal:20,
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
  },
  smDarkFont:{
    fontSize:12,
    color:'#202020',
  },
  smdDarkFont:{
    fontSize:14,
    color:'#202020',
  },
  mdDarkFont:{
    fontSize:16,
    color:'#202020'
  },
  lgDarkFont:{
    fontSize:30,
    color:'#202020',
    fontWeight:'600'
  }
});



