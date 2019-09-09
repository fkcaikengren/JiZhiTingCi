

import React, { Component } from 'react';
import { StyleSheet,Text, View,Image,TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../common/constant'
import VocaUtil from '../../vocabulary/common/vocaUtil'
import AliIcon from '../../../component/AliIcon'

export default class TaskItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
    separator: PropTypes.any,
    processNum: PropTypes.number,
    disable: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  
  //开始学习
  _startStudy = ()=>{
      if(this.props.disable){
        //提示先完成新学任务
        this.props.toastRef.show('需要您先完成新学任务哦')
      }else{
        //根据进度进行不同的跳转
        const {index, item } = this.props
        switch(item.process){
          case Constant.IN_LEARN_PLAY:
            this.props.navigation.navigate('VocaPlay',{task:item, mode:Constant.LEARN_PLAY, nextRouteName:'LearnCard'})
          break;
          case Constant.IN_LEARN_CARD:
            this.props.navigation.navigate('LearnCard',{task:item,
              showAll:false, 
              playWord:true,      //自动播放单词
              playSentence:true,  //自动播放例句
              nextRouteName:'TestVocaTran'})
          break;
          case Constant.IN_LEARN_TEST_1:
            this.props.navigation.navigate('TestVocaTran',{task:item, isRetest:false, nextRouteName:'TestSenVoca'})
          break;
          case Constant.IN_LEARN_RETEST_1:
            this.props.navigation.navigate('TestVocaTran',{task:item,  isRetest:true, nextRouteName:'TestSenVoca'})
          break;
          case Constant.IN_LEARN_TEST_2:
            this.props.navigation.navigate('TestSenVoca',{task:item,  isRetest:false, nextRouteName:'Home'})
          break;
          case Constant.IN_LEARN_RETEST_2:
            this.props.navigation.navigate('TestSenVoca',{task:item,  isRetest:true, nextRouteName:'Home'})
          break;
          //复习
          case Constant.IN_REVIEW_PLAY:
            this.props.navigation.navigate('VocaPlay',{task:item, mode:Constant.REVIEW_PLAY,  nextRouteName:'TestVocaTran'})
          break;
          case Constant.IN_REVIEW_TEST:
            this.props.navigation.navigate('TestVocaTran',{task:item, isRetest:false, nextRouteName:'Home'})
          break;
          case Constant.IN_REVIEW_RETEST:
            this.props.navigation.navigate('TestVocaTran',{task:item, isRetest:true, nextRouteName:'Home'})
          break;
          
        }
      }
      
  }

  _renderRight = (processNum)=>{
      
    if(processNum === 100){
      return <View style={styles.playView}>
              <AliIcon name='pass' size={20} color='#1890FF'></AliIcon>
              <Text style={[styles.statusText,{color:'#1890FF'}]}>已完成</Text>
          </View>
       
      
    }else{
      return <View style={styles.playView}>
              <FontAwesome name="play-circle" size={24} color="#999"/>
              <Text style={styles.statusText}>待完成</Text>
          </View>
      
    }
  }

  render() {
    const {index, item } = this.props
    //任务名
    const name = VocaUtil.genTaskName(item.taskOrder)
    //任务进度
    const processNum = this.props.processNum
    const disableView = this.props.disable?{
      backgroundColor:'#F4F4F4'
    }:null

    //点击透明度
    let activeOpacity = this.props.disable?0.8:0.5
    if(processNum === 100){
      activeOpacity = 1
    }
    return (
      <TouchableOpacity 
      activeOpacity={activeOpacity}
      onPress={this._startStudy}>
        <View style={[{paddingHorizontal:12}, disableView]}>
            <View style={[this.props.separator,styles.container]}>
              <View style={styles.leftView}>
                <View style={styles.serialView}>
                  <Text style={styles.serialText}>{index<10?'0'+index:index}</Text>
                </View>
                <View stye={styles.nameView}>
                  <Text style={styles.nameText}>{`List-${name}`}</Text>
                  <View style={styles.noteView}>
                    <Text style={styles.labelText}>{item.status===Constant.STATUS_0?'新学':'复习'}</Text>
                    <Text style={styles.noteText}>{`共${item.wordCount}词，已完成${processNum}%`}</Text>
                  </View>
                </View>
              </View>
              {
                this._renderRight(processNum)
              }
            </View>
        </View>
        
      </TouchableOpacity>
    );
  }
}




const styles = StyleSheet.create({

  container: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingTop: 14,
    paddingBottom: 12,
  },

  leftView: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },  
  serialView: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingRight:10
  },
  serialText: {
    fontSize: 16
  },  
  nameView: {
    flex: 1
  },
  nameText: {
    fontSize: 16,
    color:'#303030'
  },
  noteView:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  noteText: {
    fontSize:12,
    lineHeight: 24,
    marginLeft:3,
  },
  labelText: {
    textAlign:'center',
    paddingTop:3,
    lineHeight: 8,
    paddingHorizontal: 2,
    fontSize:8,
    color:'#1890FF',
    borderColor: '#1890FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
  },
  playView:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  statusText: {
    marginLeft:10,
  }
});

