
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image
} from 'react-native';
import {PropTypes} from 'prop-types';
import TaskItem from './TaskItem';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');


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
            <View >
                <Image source={require('../../../image/plan.jpg')} style={{width:200, height:200}} />
            </View>
          } 
        </View>
      </View>
    );
  }

  renderTaskItems = ()=> {
    return (
      this.props.tasks.map((item, index) => {
        if (index === 0) {
            return null;
        };
        console.log(this.props.tasks)
        if (index < this.props.tasks.length - 1) {
          var separator = {
            borderColor: '#F4F4F4',
            borderBottomWidth: StyleSheet.hairlineWidth,
          };
        }

        return (
          <TaskItem  index={index} {...item} separator={separator} />
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
    paddingLeft: 12,
    paddingRight: 12
  },
});

