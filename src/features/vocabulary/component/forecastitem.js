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


export default class ForecastItem extends Component {
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
      <View style={[styles.forecastItem, this.props.separator]}>
        <View stye={styles.forecastItemDayView}>
          <Text style={styles.dayText}>name</Text>
        </View>
        <View style={styles.forecastItemDataView}>
          
          <Text style={styles.forecastItemTempLow}>yy</Text>
          <Text style={styles.forecastItemTempHigh}>zz</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forecastItem: {
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: 'row'
  },
  forecastItemDayView: {
    flex: 1
  },
  forecastItemDataView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dayText: {
    fontSize: 16
  },
  forecastItemTempLow: {
    textAlign: 'right',
    marginLeft: 16,
    width: 20,
    color: '#B0B5BF',
    fontSize: 16
  },
  forecastItemTempHigh: {
    textAlign: 'right',
    marginLeft: 16,
    width: 20,
    fontSize: 16
  }
});

