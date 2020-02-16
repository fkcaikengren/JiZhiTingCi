
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements'
import { PropTypes } from 'prop-types';


import VocaUtil from '../../vocabulary/common/vocaUtil'
import * as Constant from '../common/constant'
import TaskItem from './TaskItem';
import gstyles from '../../../style'


export default class Task extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    updateTask: PropTypes.func,
    home: PropTypes.object,
    toastRef: PropTypes.object,
  };
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.home === this.props.home && nextProps.toastRef == this.props.toastRef) {
      return false
    }
    return true
  }

  _navVocaLib = () => {
    this.props.navigation.navigate('plan')
  }

  render() {
    return (
      <View style={styles.taskView}>
        <View style={styles.taskList}>
          {this.props.home.tasks.length > 0 &&
            this.renderTaskItems()
          }
          {this.props.home.tasks <= 0 &&
            <View style={[gstyles.r_center, { height: 200 }]}>
              <Button
                title='制定计划'
                titleStyle={{
                  fontSize: 18,
                  color: '#303030',
                  fontWeight: '500'
                }}
                containerStyle={{ width: '70%', height: 60 }}
                buttonStyle={{
                  backgroundColor: gstyles.mainColor,
                  borderRadius: 50,
                }}
                onPress={this._navVocaLib}
              />
            </View>
          }
        </View>
      </View>
    );
  }

  renderTaskItems = () => {
    //是否新学全部
    let isAllLearned = true
    return (
      this.props.home.tasks.map((item, index) => {
        //判断是否是单词任务
        const isVocaTask = (item.taskType === Constant.TASK_VOCA_TYPE)

        let disable = false
        let separator = null
        let progressNum = null
        if (index < this.props.home.tasks.length - 1) {
          separator = gstyles.separator
        }
        //计算进度
        if (isVocaTask) {
          progressNum = VocaUtil.calculateProcess(item)
          if (item.status === Constant.STATUS_0 && progressNum !== 100) {
            isAllLearned = false
          } else if (item.status === Constant.STATUS_1 && isAllLearned === false) {
            disable = true
          }
        }

        return (
          <TaskItem key={index.toString()} {...this.props}
            index={index + 1}
            item={item}
            progressNum={progressNum}
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
    borderRadius: 12,
    marginBottom: 50
  },
  taskList: {
    flex: 1,
    borderColor: '#E2E2E2',
  },

});

