import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  View,Text, Image,TouchableWithoutFeedback
} from 'react-native';
import {Button} from 'react-native-elements'

import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon'

const Dimensions = require('Dimensions')
const {width, height} = Dimensions.get('window')
const STATUSBAR_HEIGHT = StatusBar.currentHeight


export default class HomeDrawerPanel extends Component {
  render() {
    return (
      <ScrollView style={styles.panel}
        contentContainerStyle={gstyles.c_start}
       automaticallyAdjustContentInsets={false}
       showsHorizontalScrollIndicator={false}
       showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={()=>{
          this.props.navigation.navigate('Account')
        }}>
          <ImageBackground
          source={require('../../../image/panel.png')}
          style={[styles.header, gstyles.r_between]}
          >
            <View style={gstyles.r_start}>
              <Image style={styles.headerIcon}   source={require('../../../image/h_icon.png')} />
              <Text style={[gstyles.xl_black,{marginLeft:10}]}>Jacy</Text>
            </View>
            <AliIcon name='youjiantou' size={30} color='#202020' style={{marginRight:10}} />
          </ImageBackground>
        </TouchableWithoutFeedback>
        <Button type='clear'
          icon={<AliIcon name='gonglvexian' size={24} color={gstyles.gray} />}
          title={'攻略'}
          titleStyle={[gstyles.lg_black, {marginLeft:20}]}
          containerStyle={{ width:'100%'}}
          buttonStyle={[styles.btn,gstyles.r_start]}
          // onPress={}
        />
        
        <Button type='clear'
          icon={<AliIcon name='-huancunguanli' size={24} color={gstyles.gray} />}
          title={'离线管理'}
          titleStyle={[gstyles.lg_black, {marginLeft:20}]}
          containerStyle={{ width:'100%'}}
          buttonStyle={[styles.btn,gstyles.r_start]}
          onPress={this.props.closeDrawer}
        />
        <Button type='clear'
          icon={<AliIcon name='yijianfankui' size={24} color={gstyles.gray} />}
          title={'意见反馈'}
          titleStyle={[gstyles.lg_black, {marginLeft:20}]}
          containerStyle={{ width:'100%'}}
          buttonStyle={[styles.btn,gstyles.r_start]}
          onPress={this.props.closeDrawer}
        />
        <Button type='clear'
          icon={<AliIcon name='haopinghua0' size={24} color={gstyles.gray} />}
          title={'给个好评'}
          titleStyle={[gstyles.lg_black, {marginLeft:20}]}
          containerStyle={{ width:'100%'}}
          buttonStyle={[styles.btn,gstyles.r_start]}
          onPress={this.props.closeDrawer}
        />
        <Button type='clear'
          icon={<AliIcon name='shezhi1' size={24} color={gstyles.gray} />}
          title={'设置'}
          titleStyle={[gstyles.lg_black, {marginLeft:20}]}
          containerStyle={{ width:'100%'}}
          buttonStyle={[styles.btn,gstyles.r_start]}
          onPress={this.props.closeDrawer}
        />
        
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
   
  panel: {
    flex: 1,
    backgroundColor:'#FFF',
    
  },
  header:{
    width:'100%',
    height:160,
    paddingTop:STATUSBAR_HEIGHT,
    backgroundColor:gstyles.mainColor,
  },
  headerIcon: {
    width:50, 
    height:50,
    borderRadius:100, 
    marginLeft: 16,
  },
  btn:{
    flex:1,
    height:50, 
    paddingLeft:16
  }
     
})