import React, {Component} from 'react';
import {Platform, View, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';
import {Header,ButtonGroup} from 'react-native-elements'
import { connect } from 'react-redux';

import AliIcon from '../../component/AliIcon';
import gstyles from "../../style";
import styles from './SettingStyle'


class SettingPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          selectedIndex:1
        }
    }
    componentDidMount(){

    }

    _updateIndex = (selectedIndex) => {
      this.setState({selectedIndex})
    }


    render(){
        const { selectedIndex } = this.state
        return(
            <View style={[{flex:1},gstyles.c_start]}>
                {/* 头部 */}
                <Header
                    statusBarProps={{ barStyle: 'dark-content' }}
                    barStyle='dark-content' 
                    leftComponent={
                        <AliIcon name='fanhui' size={26} color={gstyles.black} onPress={()=>{
                            this.props.navigation.goBack();
                        }} /> }
                    centerComponent={{ text: '设置', style: gstyles.lg_black_bold}}
                    containerStyle={{
                        backgroundColor: gstyles.mainColor,
                        justifyContent: 'space-around',
                    }}
                />

                <View style={{flex:1,width:'100%'}}>
                  <View style={[gstyles.r_between, styles.itemView]}>
                      <Text numberOfLines={1} style={[gstyles.md_black_bold, {marginLeft:20}]}>
                          单词发音
                      </Text>
                      <View style={{marginRight:9}}>
                        <ButtonGroup
                          onPress={this._updateIndex}
                          selectedIndex={selectedIndex}
                          buttons={['美','英']}
                          containerStyle={{width: 100, height: 34}}
                          selectedButtonStyle={{backgroundColor:gstyles.emColor}}
                        />
                      </View>
                  </View>
                  <View style={[gstyles.r_between, styles.itemView]}>
                      <Text numberOfLines={1} style={[gstyles.md_black_bold, {marginLeft:20}]}>
                          复习播放遍数
                      </Text>
                      {/* 加减器 */}
                      <View style={[gstyles.r_center,{marginRight:20}]}>
                        <TouchableOpacity  activeOpacity={0.8}>
                          <View style={[gstyles.r_center ,styles.timesBtn, styles.subBtn,]}>
                            <Text style={{fontSize:26}}>-</Text>
                          </View>
                          
                        </TouchableOpacity>
                        <View style={[gstyles.r_center,styles.times]}>
                          <Text >10</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8}>
                          <View style={[gstyles.r_center, styles.timesBtn, styles.plusBtn]}>
                            <Text style={{fontSize:20}}>+</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                  </View>
                </View>
                <TouchableWithoutFeedback>
                  <View style={[gstyles.r_center,styles.version]}>
                    <Text style={{fontSize:20}}>爱听词 v1.0.0</Text>
                  </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    app: state.app,
})

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage)