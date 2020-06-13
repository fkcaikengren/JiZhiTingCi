

import React, { Component } from 'react';
import { StyleSheet, Text, View, InteractionManager, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackgroundTimer from 'react-native-background-timer'
import * as Constant from '../common/constant'
import VocaUtil from '../../vocabulary/common/vocaUtil'
import AliIcon from '../../../component/AliIcon'
import gstyles from '../../../style'
import { DETAIL_READ, MULTI_SELECT_READ, FOUR_SELECT_READ, EXTENSIVE_READ } from "../../reading/common/constant";
import { store } from '../../../redux/store';
import NotificationManage from '../../../modules/NotificationManage';


export default class TaskItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
    separator: PropTypes.any,
    progressNum: PropTypes.number,
    disable: PropTypes.bool,
    bookType: PropTypes.number
  };

  constructor(props) {
    super(props);
  }


  _pause = () => {
    if (this.props.autoPlayTimer) {
      BackgroundTimer.clearTimeout(this.props.autoPlayTimer);
      this.props.changePlayTimer(0);
      NotificationManage.pause((e) => {
        console.log(e)
      }, () => null);
    }
  }

  _startStudyInteraction = () => {
    this._pause()
    InteractionManager.runAfterInteractions(() => {
      this._startStudy()
    })
  }

  //开始学习
  _startStudy = () => {
    if (this.props.disable) { //
      //提示先完成新学任务
      store.getState().app.toast.show('完成新学任务才可以解锁哦', 1500)
    } else {
      //根据进度进行不同的跳转
      let { index, item } = this.props
      //如果是1复任务 且未点击
      if (item.status === Constant.STATUS_1) {
        let task = null
        for (let t of this.props.home.tasks) {
          if (t.taskOrder === item.taskOrder && t.status === Constant.STATUS_0) {
            task = t
            break
          }
        }
        if (task && item.listenTimes < task.listenTimes) {
          item = VocaUtil.updateNewTaskToReviewTask(task)
          console.log('---1复更新到最新--')
          this.props.updateTask({ task: item })
        }
      }

      switch (item.progress) {
        case Constant.IN_LEARN_PLAY:
          this.props.navigation.navigate('VocaPlay', { task: item, mode: Constant.LEARN_PLAY, nextRouteName: 'LearnCard' })
          break;
        case Constant.IN_LEARN_CARD:
          this.props.navigation.navigate('LearnCard', {
            task: item,
            showAll: false,
            playWord: true,      //自动播放单词
            nextRouteName: 'TestVocaTran'
          })
          break;
        case Constant.IN_LEARN_TEST_1: {
          let nextRouteName = 'TestSenVoca'
          if (this.props.bookType === Constant.TYPE_VOCA_BOOK_PHRASE) {
            nextRouteName = 'TestTranVoca'
          }
          this.props.navigation.navigate('TestVocaTran', { task: item, isRetest: false, nextRouteName })
          break;
        }
        case Constant.IN_LEARN_RETEST_1: {
          let nextRouteName = 'TestSenVoca'
          if (this.props.bookType === Constant.TYPE_VOCA_BOOK_PHRASE) {
            nextRouteName = 'TestTranVoca'
          }
          this.props.navigation.navigate('TestVocaTran', { task: item, isRetest: true, nextRouteName })
          break;
        }
        case Constant.IN_LEARN_TEST_2: {
          let goalPage = 'TestSenVoca'
          if (this.props.bookType === Constant.TYPE_VOCA_BOOK_PHRASE) {
            goalPage = 'TestTranVoca'
          }
          this.props.navigation.navigate(goalPage, { task: item, isRetest: false, nextRouteName: 'Home' })
          break;
        }
        case Constant.IN_LEARN_RETEST_2: {
          let goalPage = 'TestSenVoca'
          if (this.props.bookType === Constant.TYPE_VOCA_BOOK_PHRASE) {
            goalPage = 'TestTranVoca'
          }
          this.props.navigation.navigate(goalPage, { task: item, isRetest: true, nextRouteName: 'Home' })
          break;
        }


        //复习
        case Constant.IN_REVIEW_PLAY:
          const nextRouteName = this._nextRoute(item.status)
          this.props.navigation.navigate('VocaPlay', { task: item, mode: Constant.REVIEW_PLAY, nextRouteName: nextRouteName })
          break;
        case Constant.IN_REVIEW_TEST:
          const routeName1 = this._nextRoute(item.status)
          this.props.navigation.navigate(routeName1, { task: item, isRetest: false, nextRouteName: 'Home' })
          break;
        case Constant.IN_REVIEW_RETEST:
          const routeName2 = this._nextRoute(item.status)
          this.props.navigation.navigate(routeName2, { task: item, isRetest: true, nextRouteName: 'Home' })
          break;

      }
    }

  }

  _nextRoute = (status) => {
    let nextRouteName = 'TestVocaTran'
    switch (status) {
      case Constant.STATUS_1:
      case Constant.STATUS_7:
        nextRouteName = 'TestTranVoca'
        break
      case Constant.STATUS_2:
        break
      case Constant.STATUS_4:
      case Constant.STATUS_15:
        nextRouteName = 'TestPronTran'
        break
    }
    return nextRouteName
  }
  _renderRight = () => {
    const { item, progressNum, disable } = this.props
    const hasScore = (item.score !== -1)
    const textStyle = hasScore ? { fontSize: 22, color: gstyles.emColor, marginRight: 5, } : gstyles.md_gray
    if (this.isVocaTask) {
      if (progressNum === 100) {
        return <View style={styles.playView}>
          <View style={[gstyles.r_center, styles.finishIcon]}>
            <AliIcon name='wancheng' size={16} color={gstyles.black} />
          </View>
          <Text style={[{ marginLeft: 12, }, gstyles.md_black]}>已完成</Text>
        </View>
      } else {
        return <View style={styles.playView}>
          <FontAwesome name="play-circle" size={24} color="#999" />
          <Text style={[{ marginLeft: 12, }, gstyles.md_gray]}>{disable ? '待解锁' : '待完成'}</Text>
        </View>
      }
    } else {
      let type = ''
      switch (item.type) {
        case DETAIL_READ:
          type = '仔细阅读'
          break
        case MULTI_SELECT_READ:
          type = '选词填空'
          break
        case FOUR_SELECT_READ:
          type = '选词填空'
          break
        case EXTENSIVE_READ:
          type = '泛读'
          break
      }
      return <View style={[{ height: '100%' }, gstyles.r_start]}>
        <Text style={textStyle}>{hasScore ? item.score + '%' : type}</Text>
      </View>
    }

  }

  _startRead = () => {
    this._pause()
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('ArticleTab', { articleInfo: this.props.item })
    })
  }

  render() {

    this.isVocaTask = (this.props.item.taskType === Constant.TASK_VOCA_TYPE)
    const { index, item, progressNum, disable } = this.props
    //任务名
    let name = '', label = '', note = ''
    if (this.isVocaTask) {
      name = item.taskWords[0] ? item.taskWords[0].word : '任务'
      label = (item.status === Constant.STATUS_0 ? '新学' : '复习')
      note = `共${item.wordCount}词，已完成${progressNum}%`
    } else {
      name = item.name
      label = '推荐'
      note = item.note
    }


    //点击透明度
    let activeOpacity = this.props.disable ? 0.8 : 0.5
    if (progressNum === 100) {
      activeOpacity = 1
    }
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={this.isVocaTask ? this._startStudyInteraction : this._startRead}>
        <View style={[{ paddingHorizontal: 12 }]}>
          <View style={[this.props.separator, styles.container]}>
            <View style={[gstyles.r_start, { flex: 1 }]}>
              <View style={[gstyles.c_center, { marginRight: 10 }]}>
                <Text style={gstyles.serialText}>{index < 10 ? '0' + index : index}</Text>
              </View>
              <View stye={{ flex: 1 }}>
                <Text numberOfLines={1} style={[gstyles.md_black, { fontWeight: '500' }]}>{name}</Text>
                <View style={gstyles.r_start}>
                  <Text style={gstyles.labelText}>{label}</Text>
                  <Text style={gstyles.noteText}>{note}</Text>
                </View>
              </View>
            </View>
            {
              this._renderRight()
            }
          </View>
        </View>

      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 12,
  },


  playView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 110
  },

  finishIcon: {
    width: 22,
    height: 22,
    backgroundColor: gstyles.mainColor,
    borderRadius: 50,
  }
});

