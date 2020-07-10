
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-elements'
import { PropTypes } from 'prop-types';


import VocaUtil from '../../vocabulary/common/vocaUtil'
import * as Constant from '../common/constant'
import TaskItem from './TaskItem';
import gstyles from '../../../style'
import AliIcon from '../../../component/AliIcon';


export default class Task extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    updateTask: PropTypes.func,
    home: PropTypes.object,
    bookType: PropTypes.number
  };
  constructor(props) {
    super(props);
  }


  _navVocaLib = () => {
    this.props.navigation.navigate('VocaPlan')
  }


  render() {
    const { errorInLoadTask, tasks } = this.props.home
    return (
      <View style={styles.taskView}>
        <View style={styles.taskList}>
          {errorInLoadTask &&
            this._renderErrorTip(errorInLoadTask)
          }
          {errorInLoadTask === null && tasks.length > 0 &&
            this.renderTaskItems()
          }
          {errorInLoadTask === null && tasks <= 0 &&
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


  _renderErrorTip = (error) => {
    let tip = "加载数据发生错误，请稍后重启App"
    if (error.name === "TimeError") {
      tip = '手机日期(时间)设置不正确，请检查后重启App'

    }
    return <View style={[styles.taskView, gstyles.r_center, { marginTop: 40 }]}>
      <AliIcon name='baocuo1' size={24} color={gstyles.emColor} style={{ marginRight: 10 }} />
      <Text style={{ width: '70%', color: gstyles.emColor, fontSize: 16 }} >{tip}</Text>
    </View>

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
            bookType={this.props.bookType}
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

