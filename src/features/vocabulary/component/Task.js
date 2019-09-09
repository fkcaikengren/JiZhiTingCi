
import React, { Component } from 'react';
import {  StyleSheet, Text, View, Image} from 'react-native';
import {Button} from 'react-native-elements'
import {PropTypes} from 'prop-types';


import VocaUtil from '../../vocabulary/common/vocaUtil'
import * as Constant from '../common/constant'
import TaskItem from './TaskItem';
import gstyles from '../../../style'


export default class Task extends Component {

  static propTypes = {
    tasks: PropTypes.array,
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.taskView}>
        <View style={styles.taskList}>
          {this.props.tasks.length>0 &&
            this.renderTaskItems() 
          }
          {this.props.tasks<=0 &&
            <View style={[gstyles.r_center,{height:200}]}>
                <Button 
                  title='制定计划'
                  titleStyle={{
                    fontSize:18,
                    color:'#303030',
                    fontWeight:'500'
                  }}
                  containerStyle={{
                    width:'80%'
                  }}
                  buttonStyle={{
                    backgroundColor:'#FFE957',
                    borderRadius:50,
                  }}
                />
            </View>
          } 
        </View>
      </View>
    );
  }

  renderTaskItems = ()=> {
    //是否新学全部
    let isAllLearned = true
    return (
      this.props.tasks.map((item, index) => {
        let disable = false
        let separator = null
        if (index < this.props.tasks.length - 1) {
          separator = {
            borderColor: '#F4F4F4',
            borderBottomWidth: StyleSheet.hairlineWidth,
          };
        }
        //计算进度
        const processNum = VocaUtil.calculateProcess(item)
        // if(item.status === Constant.STATUS_0 && processNum !== 100){
        //   isAllLearned = false
        // }else if(item.status === Constant.STATUS_1 && isAllLearned === false){
        //   disable = true
        // }

        return (
          <TaskItem {...this.props} 
          index={index+1} 
          item={item} 
          processNum={processNum}
          separator={separator} 
          disable={disable}
          />
        );
      })
    );
  }
}

const styles = StyleSheet.create({
  taskView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12
  },
  taskList: {
    flex: 1,
    borderColor: '#E2E2E2',
  },
 
});

