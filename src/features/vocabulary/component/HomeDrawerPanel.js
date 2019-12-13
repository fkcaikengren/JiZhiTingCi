import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  View, Text, Image, TouchableWithoutFeedback
} from 'react-native';
import { Button } from 'react-native-elements'

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'
import FeedbackModule from '../../../modules/FeedbackUtil'
import { connect } from 'react-redux';


const STATUSBAR_HEIGHT = StatusBar.currentHeight


class HomeDrawerPanel extends Component {
  render() {
    const { user, avatarSource } = this.props.mine
    const { nickname } = user
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
          icon={<AliIcon name='gonglvexian' size={24} color={gstyles.gray} />}
          title={'攻略'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={() => {
            this.props.navigation.navigate('Guide')
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
          icon={<AliIcon name='shezhi1' size={24} color={gstyles.gray} />}
          title={'设置'}
          titleStyle={[gstyles.lg_black, { marginLeft: 20 }]}
          containerStyle={{ width: '100%' }}
          buttonStyle={[styles.btn, gstyles.r_start]}
          onPress={this.props.closeDrawer}
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
  }

})



const mapStateToProps = state => ({
  app: state.app,
  mine: state.mine
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeDrawerPanel)
