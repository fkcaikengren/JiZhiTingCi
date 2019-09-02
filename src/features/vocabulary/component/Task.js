
import React, { Component } from 'react';
import {  StyleSheet, Text, View, Image} from 'react-native';
import {Button} from 'react-native-elements'
import {PropTypes} from 'prop-types';
import TaskItem from './TaskItem';
import gstyles from '../../../style'

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
    return (
      this.props.tasks.map((item, index) => {
        let separator
        if (index < this.props.tasks.length - 1) {
          separator = {
            borderColor: '#F4F4F4',
            borderBottomWidth: StyleSheet.hairlineWidth,
          };
        }
        return (
          <TaskItem {...this.props} index={index+1} item={item} separator={separator} />
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

