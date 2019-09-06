

import React, { Component } from 'react';
import { StyleSheet,Text, View,Image,TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../common/constant'
import VocaUtil from '../../vocabulary/common/vocaUtil'


export default class TaskItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
    separator: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  
  //开始学习
  _startStudy = ()=>{
      //根据进度进行不同的跳转
      const {index, item } = this.props
      switch(item.process){
        case Constant.IN_LEARN_PLAY:
          this.props.navigation.navigate('VocaPlay',{task:item, mode:Constant.LEARN_PLAY})
        break;
        case Constant.IN_LEARN_CARD:
          this.props.navigation.navigate('LearnCard',{task:item})
        break;
        case Constant.IN_LEARN_TEST_1:
          this.props.navigation.navigate('TestPronTran',{task:item})
        break;
        //复习
        case Constant.IN_REVIEW_PLAY:
          this.props.navigation.navigate('VocaPlay',{task:item, mode:Constant.REVIEW_PLAY})
        break;
        case Constant.IN_REVIEW_TEST:
          this.props.navigation.navigate('TestVocaTran',{task:item})
        break;
        
      }
  }

  render() {
    const {index, item } = this.props
    //任务名
    let name = VocaUtil.genTaskName(item.taskOrder)
    
    //计算进度
    let processNum = VocaUtil.calculateProcess(item)
    

    return (
      <TouchableOpacity onPress={this._startStudy}>
        <View style={[styles.taskItem, this.props.separator, styles.container]}>
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
          <View style={styles.playView}>
            <FontAwesome name="play-circle" size={24} color="#999"/>
            <Text style={styles.statusText}>待完成</Text>
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
  },
  taskItem: {
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row'
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

