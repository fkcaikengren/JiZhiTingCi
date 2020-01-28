

'use strict';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, InteractionManager } from 'react-native';
import { PropTypes } from 'prop-types';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Grid, Col, Row } from 'react-native-easy-grid'
import { Badge } from 'react-native-elements'

import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style'
import DownloadTemplate from '../../../component/DownloadTemplate';
import { VOCABULARY_DIR } from '../../../common/constant';


const Dimensions = require('Dimensions');
const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 290;  //头部背景高度
const TITLE_HEIGHT = 55;    //标题栏高度
export default class HomeHeader extends Component {


  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    };
  }

  render() {
    const translateY = this.state.shift.interpolate({
      inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      outputRange: [-30, 0, 25, 30],
      extrapolate: 'clamp',
    });

    const transform = [{ translateY }];

    return (
      <ParallaxScrollView
        backgroundColor='#FFE957'
        contentBackgroundColor='#F9F9F9'
        parallaxHeaderHeight={HEADER_HEIGHT}
        stickyHeaderHeight={TITLE_HEIGHT}
        showsVerticalScrollIndicator={false}
        renderStickyHeader={this.renderStickyHeader}
        renderForeground={this.renderHeader}
        renderFixedHeader={this.renderFixedHeader}
        scrollEvent={this.onScroll}
      >
        <Animated.View style={[{ transform }, styles.childrenView]}>
          {this.props.children}
        </Animated.View>
      </ParallaxScrollView>
    );
  }
  renderStickyHeader = () => {
    return <View style={{ width: width, height: TITLE_HEIGHT, backgroundColor: '#FFE957' }}></View>
  }
  renderFixedHeader = () => {
    const { bookName } = this.props.plan.plan
    const isFailed = this.props.home.isUploadFail
    return <View style={[styles.fixedSection, gstyles.r_start]}>
      <View style={[{ flex: 1 }, gstyles.r_start_bottom]}>
        <AliIcon name='wode' size={26} color='#202020' onPress={this.props.openDrawer} />
        {(this.props.home.isUploading || this.props.home.isUploadFail) &&
          <View style={{ marginLeft: 10, marginBottom: 2 }}>
            <AliIcon name='tongbu' size={22} color={gstyles.gray} onPress={() => {
              if (this.props.home.isUploadFail) {
                this.props.app.toast.show('貌似网络出了点问题...')
              }
            }} />
            <Badge
              value={isFailed ? '!' : '···'}
              status={isFailed ? 'error' : 'primary'}
              badgeStyle={{ minWidth: 12, height: 12, }}
              textStyle={{ fontSize: 10 }}
              containerStyle={{ position: 'absolute', bottom: 0, left: 10 }} />

          </View>
        }
      </View>

      <View style={[{ flex: 2 }, gstyles.r_center]}>
        <Text style={[gstyles.md_black, { fontWeight: '700' }]}>{bookName ? bookName : '爱听词'}</Text>
        <AliIcon name='xiazai1' size={18} color='#303030' style={{ marginLeft: 10 }} onPress={() => {
          // 离线下载词库资源
          this.props.app.confirmModal.show('下载离线包(40M)？', null, () => {
            //开始下载
            DownloadTemplate.show({
              commonModal: this.props.app.commonModal,
              title: '离线包下载中...(40M)',
              modalHeight: 240,
              primaryDir: VOCABULARY_DIR,
              filePath: '/resources/test.zip',
              onUnzipPress: () => {
                this.props.app.toast.show('解压中...请稍等几秒钟', 2000)
              },
              onFinishPress: () => {
              }
            })
          })
        }} />
      </View>
      <View style={[{ flex: 1 }, gstyles.r_end]}>
        <AliIcon name='chazhao' size={24} color='#202020' onPress={this._navVocaSearch} />
      </View>
    </View>
  }

  //头部
  renderHeader = () => {
    const { plan, learnedWordCount, leftDays } = this.props.plan
    const { totalDays, totalWordCount } = plan
    return (
      <View style={[styles.headerView]}>

        <Grid >
          {/* 内容展示 */}
          <Row style={styles.headerCenter}>
            <Col style={gstyles.c_center}>
              <Text style={gstyles.md_black}>已学单词</Text>
              <Text style={gstyles.md_black}>
                <Text style={{ fontSize: 42, color: '#202020', fontWeight: '700' }}>{learnedWordCount}</Text>
                /{totalWordCount}</Text>
            </Col>
            <Col style={gstyles.c_center}>
              <Text style={gstyles.md_black}>剩余天数</Text>
              <Text style={gstyles.md_black}>
                <Text style={{ fontSize: 42, color: '#202020', fontWeight: '700' }}>{leftDays}</Text>
                /{totalDays}</Text>
            </Col>
          </Row>
          {/* 底部功能按钮 */}
          <Row style={styles.headerBottom}>
            <Col style={gstyles.c_center} onPress={this._navVocaPlan}>
              <AliIcon name='ciyun' size={26} color='#202020' />
              <Text style={styles.smDarkFont}>学习计划</Text>
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
              <AliIcon name='yuedu1' size={26} color='#202020' onPress={this._navArticleManage} />
              <Text style={styles.smDarkFont}>阅读真题</Text>
            </Col>
          </Row>
        </Grid>

      </View>

    );
  }

  onScroll = (e) => {
    this.state.shift.setValue(e.nativeEvent.contentOffset.y);
  }


  /**导航到学习计划页面 */
  _navVocaPlan = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('VocaPlan', { transition: 'forFadeToBottomAndroid' });
    })

  }

  /**导航到单词列表页 */
  _navVocaList = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('VocaListTab', { transition: 'forFadeToBottomAndroid' });
    })

  }

  /**导航到生词本页面 */
  _navVocaGroup = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('VocaGroup', { transition: 'forFadeToBottomAndroid' });
    })
  }

  /**导航到搜索页面 */
  _navVocaSearch = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('VocaSearch');
    })

  }

  /**导航到文章管理页面 */
  _navArticleManage = () => {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('ArticleManage', { transition: 'forFadeToBottomAndroid' });
    })

  }





}

const styles = StyleSheet.create({
  imageStyle: {
    width: 100,
    height: 100
  },

  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 30
  },
  stickyHeaderView: {
    height: TITLE_HEIGHT,
    marginLeft: 10 + TITLE_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fixedSection: {
    width: width,
    height: TITLE_HEIGHT,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
  },

  headerView: {
    width: width,
    height: 290,
    backgroundColor: '#FFe957'
  },
  headerCenter: {
    position: 'absolute',
    bottom: '45%',
    paddingHorizontal: 40,
  },
  headerBottom: {
    position: 'absolute',
    bottom: '16%',
    paddingHorizontal: 20,
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
  smDarkFont: {
    fontSize: 12,
    color: '#202020',
  },
  smdDarkFont: {
    fontSize: 14,
    color: '#202020',
  },
  mdDarkFont: {
    fontSize: 16,
    color: '#202020'
  },
  lgDarkFont: {
    fontSize: 30,
    color: '#202020',
    fontWeight: '600'
  }
});



