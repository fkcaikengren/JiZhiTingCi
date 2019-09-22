import React, { Component } from 'react';
import {View} from "react-native";
import {Header} from 'react-native-elements'
import AliIcon from "../../component/AliIcon";
import gstyles from "../../style";

export default class DownloadPage extends Component {
  render() {
    return (
      <View>
        <Header
            statusBarProps={{ barStyle: 'dark-content' }}
            barStyle="dark-content" // or directly
            leftComponent={//返回
              <AliIcon name='fanhui' size={26} color='#555' onPress={()=>{
              }}/> }
            centerComponent={{ text: '个人中心', style: gstyles.lg_black_bold }}
            containerStyle={{
              backgroundColor: '#FCFCFC00',
              borderBottomColor: '#FCFCFC00',
            }}
        />
      </View>
    );
  }
}