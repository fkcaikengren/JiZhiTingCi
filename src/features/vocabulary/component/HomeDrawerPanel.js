import React, { Component } from 'react';
import {
  StyleSheet, StatusBar, ImageBackground, ScrollView, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { Button } from 'react-native-elements'
import BackgroundTimer from 'react-native-background-timer'
import { connect } from 'react-redux';

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import FeedbackModule from '../../../modules/FeedbackUtil'
import * as TimingAction from '../../../redux/action/timingAction'
import _util from '../../../common/util';

const STATUSBAR_HEIGHT = StatusBar.currentHeight
const Dimensions = require('Dimensions');
let { width, height } = Dimensions.get('window');


class HomeDrawerPanel extends Component {
  constructor(props) {
    super(props)
    this.timeOptions = [0, 1, 2, 3, 6] // [0,10,20,30,60]

    this.timer = null
  }

  _renderTimeSelector = ({ commonModal }) => {
    return () => {
      const {
        getContentState,
        setContentState,
        hide
      } = commonModal
      const { selectedIndex, leftSeconds } = getContentState()
      const { wholeSeconds } = this.props.timing
      const minutes = parseInt(leftSeconds / 60)
      const seconds = leftSeconds % 60
      return <View style={[styles.timingContainer, gstyles.c_start]}>
        <View style={[styles.timingTitle, gstyles.c_start]}>
          <Text style={gstyles.md_black}>定时关闭</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>
            <Text style={{ color: gstyles.secColor }}>{_util.addZero(minutes)}</Text>:
            <Text style={{ color: gstyles.secColor }}>{_util.addZero(seconds)}</Text>
            后，将退出App</Text>
        </View>
        {
          this.timeOptions.map((item, i) => {
            const selectedStyle = (selectedIndex === i) ? { color: gstyles.secColor } : null
            const noBorder = (i === 4) ? { borderBottomWidth: 0 } : null
            return <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                //清除之前的定时
                if (this.timer) {
                  BackgroundTimer.clearInterval(this.timer)
                }
                setContentState({
                  selectedIndex: i,
                  leftSeconds: item * 60
                })
                // 设置时间
                this.props.changeWholeSeconds({ timeIndex: i, wholeSeconds: item * 60 })
                if (i === 0) {
                  return
                }
                // 倒计时
                this.timer = BackgroundTimer.setInterval(() => {
                  const { wholeSeconds } = this.props.timing
                  if (wholeSeconds > 0) {
                    setContentState({ leftSeconds: wholeSeconds - 1 })
                    this.props.decreaseSecond()
                  } else {
                    if (this.timer) {
                      BackgroundTimer.clearInterval(this.timer)
                    }
                    this.props.changeWholeSeconds({ timeIndex: 0, wholeSeconds: 0 })
                    alert('退出App')
                  }
                }, 1000);
              }}>
              <View style={[gstyles.r_between, styles.TimingItemWrap, noBorder]}>
                <Text style={[gstyles.md_lightBlack, selectedStyle]}>{item === 0 ? '关闭' : `${item}分钟`}</Text>
                {selectedStyle &&
                  <AliIcon name='complete' size={22} color={gstyles.secColor} style={{ marginRight: 30 }} />
                }
              </View>
            </TouchableOpacity>
          })
        }
      </View>
    }
  }


  render() {
    const { user, avatarSource } = this.props.mine
    const { nickname } = user
    const { timeIndex, wholeSeconds } = this.props.timing
    return (
      <ScrollView style={styles.panel}
        contentContainerStyle={gstyles.c_start}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={() => {
          this.props.navigation.navigate('Account')
        }}>
          <ImageBackground
            source={require('../../../image/panel.jpg')}
            style={[styles.header, gstyles.r_between]}
          >
            <View style={gstyles.r_start}>
              <Image style={styles.headerIcon} source={avatarSource} />
              <Text style={[gstyles.xl_black, { marginLeft: 10 }]}>{nickname}</Text>
            </View>
            <AliIcon name='youjiantou' size={30} color='#202020' style={{ marginRight: 10 }} />
          </ImageBackground>
        </TouchableWithoutFeedback>

        <Button type='clear'
          icon={<AliIcon name='xinxi' size={24} color={gstyles.gray} />}
          title={'消息中心'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            this.props.navigation.navigate('Message')
          }}
        />

        <Button type='clear'
          icon={<AliIcon name='-huancunguanli' size={24} color={gstyles.gray} />}
          title={'离线管理'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            this.props.navigation.navigate('DownloadManage', {
              ...this.props.plan
            })
          }}
        />
        <Button type='clear'
          icon={<AliIcon name='yijianfankui' size={24} color={gstyles.gray} />}
          title={'意见反馈'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            let phone = {
              platform: 'android'
            }
            FeedbackModule.openFeedbackActivity(phone)
          }}
        />
        <Button type='clear'
          icon={<AliIcon name='haopinghua0' size={24} color={gstyles.gray} />}
          title={'给个好评'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={this.props.closeDrawer}
        />
        <Button type='clear'
          icon={<AliIcon name='guanyuwomen' size={24} color={gstyles.gray} />}
          title={'联系我们'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            this.props.navigation.navigate('About')
          }}
        />
        <View style={{ width: '100%' }}>
          <Button type='clear'
            icon={<AliIcon name='dingshirenwu' size={24} color={gstyles.gray} />}
            title={'定时关闭'}
            titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
            containerStyle={{ width: '100%' }}
            buttonStyle={[styles.btn, gstyles.r_start]}
            onPress={() => {
              const { setContentState, show } = this.props.app.commonModal
              setContentState({
                selectedIndex: timeIndex,
                leftSeconds: wholeSeconds
              })
              show({
                renderContent: this._renderTimeSelector({
                  commonModal: this.props.app.commonModal,
                }),
                modalStyle: {
                  height: 280,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  backgroundColor: "#FFF",
                },
                position: 'bottom',
                backdropPressToClose: true
              })
            }}
          />
          {wholeSeconds > 0 &&
            <Text style={{ position: 'absolute', right: 30, bottom: 12 }}>
              <Text style={{ fontSize: 16, color: '#888' }}>{_util.addZero(parseInt(wholeSeconds / 60))}:</Text>
              <Text style={{ fontSize: 16, color: '#888' }}>{_util.addZero(wholeSeconds % 60)}</Text>
            </Text>
          }
        </View>
        <Button type='clear'
          icon={<AliIcon name='shezhi1' size={24} color={gstyles.gray} />}
          title={'设置'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            this.props.navigation.navigate('Setting')
          }}
        />

      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({

  panel: {
    flex: 1,
    backgroundColor: '#FFF',

  },
  header: {
    width: '100%',
    height: 160,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: gstyles.mainColor,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 16,
  },
  btn: {
    flex: 1,
    height: 50,
    paddingLeft: 16
  },
  timingContainer: {
    flex: 1,
    width: width,
  },
  timingTitle: {
    width: '100%',
    height: 50,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EDEDED',
  },

  TimingItemWrap: {
    width: width,
    height: 45,
    marginLeft: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EDEDED',
  }

})



const mapStateToProps = state => ({
  app: state.app,
  timing: state.timing,
  mine: state.mine
})

const mapDispatchToProps = {
  changeWholeSeconds: TimingAction.changeWholeSeconds,
  decreaseSecond: TimingAction.decreaseSecond
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeDrawerPanel)
