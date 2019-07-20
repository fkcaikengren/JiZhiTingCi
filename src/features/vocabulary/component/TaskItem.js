/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {PropTypes} from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class TaskItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    name: PropTypes.string,
    separator: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
   
    return (
      <View style={[styles.taskItem, this.props.separator, styles.container]}>
        <View style={styles.leftView}>
          <View style={styles.serialView}>
            <Text style={styles.serialText}>01</Text>
          </View>
          <View stye={styles.nameView}>
            <Text style={styles.nameText}>四级List-001</Text>
            <View style={styles.noteView}>
              <Text style={styles.labelText}>新学</Text>
              <Text style={styles.noteText}>需要花费20min</Text>
            </View>
          </View>
        </View>
        <View style={styles.playView}>
          <FontAwesome name="play-circle" size={24} color="#999"/>
          <Text style={styles.statusText}>待完成</Text>
        </View>
      </View>
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

