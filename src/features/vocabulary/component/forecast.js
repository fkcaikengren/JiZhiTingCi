/**
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PropTypes} from 'prop-types';
import ForecastItem from './forecastitem';
// import type { WeatherForecast } from '../models/view';



export default class Forecast extends Component {

  static propTypes = {
    forecast: PropTypes.array,
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.forecastView}>
        <View style={styles.forecastList}>
          { this.renderForecastItems() }
        </View>
      </View>
    );
  }

  renderForecastItems = ()=> {
    return (
      this.props.forecast.map((item, index) => {
        if (index === 0) {
            return null;
        };
        console.log(this.props.forecast)
        if (index < this.props.forecast.length - 1) {
          var separator = {
            borderColor: '#F4F4F4',
            borderBottomWidth: StyleSheet.hairlineWidth,
          };
        }

        return (
          <ForecastItem  index={index} {...item} separator={separator} />
        );
      })
    );
  }
}

const styles = StyleSheet.create({
  forecastView: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    borderColor: '#e2e2e2',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 3
  },
  forecastList: {
    flex: 1,
    borderColor: '#E2E2E2',
    paddingLeft: 12,
    paddingRight: 12
  },
});

