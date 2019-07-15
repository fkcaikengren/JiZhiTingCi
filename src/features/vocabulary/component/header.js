

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  RefreshControl
} from 'react-native';
import {PropTypes} from 'prop-types';

import ParallaxScrollView from 'react-native-parallax-scroll-view';

// import { getAllWeather, setWeatherRefreshing } from '../actions';


const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;

const HEADER_HEIGHT = 290;
const TITLE_HEIGHT = 55;

export default class Header extends Component {
  static propsType = {
    
  };

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
      shift: new Animated.Value(0)
    };

  }

 

  render() {
    const translateY = this.state.shift.interpolate({
      inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      outputRange: [-30, 0, 25, 30],
      extrapolate: 'clamp',
    });

    const transform = [{translateY}];

    return (



      <ParallaxScrollView
        backgroundColor= '#589BC7'
        contentBackgroundColor= '#F9F9F9'
        parallaxHeaderHeight={HEADER_HEIGHT}
        stickyHeaderHeight={TITLE_HEIGHT}
        renderStickyHeader={this.renderTitle}
        showsVerticalScrollIndicator={false}
        renderForeground={this.renderHeader}
        renderBackground={this.renderBackground}
        scrollEvent={this.onScroll}
        renderForeground={() => (
        <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Hello World!</Text>
          </View>
        )}>
        <Animated.View style={[{transform}, styles.childrenView]}>
          { this.props.children }
        </Animated.View>
      </ParallaxScrollView>

      
    );
  }

  onScroll = (e)=>{
    this.state.shift.setValue(e.nativeEvent.contentOffset.y);
  }

  renderBackground = ()=> {
    return (
      <Image source={require('../../../image/header-background.png')}/>
    );
  }

  renderTitle = ()=> {
    var items = [1,2,3,4].map((item, index) => {
      return this.renderTitleItem(index);
    });

    return (
      <View style={{flexDirection: 'row'}}>
        { items }
      </View>
    );
  }

  renderTitleItem(index) {
    var middle = index * SCREEN_WIDTH;
    var distanceToMiddle = 100;
    var leftOffset = (middle - distanceToMiddle);
    var rightOffset = (middle + distanceToMiddle);

    const opacity = this.props.offset.interpolate({
      inputRange: [leftOffset, middle, rightOffset],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const translateX = this.props.offset.interpolate({
      inputRange: [leftOffset - 1, leftOffset, middle, rightOffset, rightOffset + 1],
      outputRange: [(SCREEN_WIDTH * 2), (distanceToMiddle / 3), 0, -(distanceToMiddle / 3), -(SCREEN_WIDTH * 2)],
      extrapolate: 'clamp',
    });

    const transforms = { opacity, transform: [{translateX}] };

    return (
      <Animated.View key={`title-1`} style={[transforms, styles.titleViewAnimated]}>
        <View style={styles.stickyHeaderView}>
          <Text style={styles.stickyHeaderLocation}>
            location
          </Text>
          <Text style={styles.stickyHeaderToday}> today </Text>
        </View>
      </Animated.View>
    );
  }

  renderHeader = ()=> {
    var items = [{name:'xx', name:'yy', name:'zz'}].map((item, index) => {
      return this.renderHeaderItem(index);
    });

    return (
      <View style={{flexDirection: 'row'}}>
        { items }
      </View>
    );
  }

  renderHeaderItem = ( index)=> {
    var distanceToMiddle = 100
    var middle = index * SCREEN_WIDTH;

    var leftOffset = (middle - distanceToMiddle);
    var rightOffset = (middle + distanceToMiddle);


    const opacity = this.props.offset.interpolate({
      inputRange: [leftOffset, middle, rightOffset],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const translateX = this.props.offset.interpolate({
      inputRange: [leftOffset - 1, leftOffset, middle, rightOffset, rightOffset + 1],
      outputRange: [(SCREEN_WIDTH * 2), (distanceToMiddle / 3), 0, -(distanceToMiddle / 3), -(SCREEN_WIDTH * 2)],
      extrapolate: 'clamp',
    });

    const transforms = { opacity, transform: [{translateX}] };

    return (
      <Animated.View key={`header-1`} style={[transforms, styles.headerViewAnimated]}>
        <View style={styles.headerView}>
          <View>
            <Text style={styles.location}>location</Text>
            <Text style={styles.forecast}>forecast</Text>
          </View>
          <View style={styles.centerView}>
            <View style={styles.centerImageView}>
              <Image style={imageStyle} source={require('../../../image/cloudy.png')} />  
            </View>
            <View>
              <Text style={styles.currentTemp}>current</Text>
              <Text style={styles.feelsLike}>Feels like </Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <View style={styles.bottomViewLeft}>
              <Text style={styles.bottomViewToday}>
                Today
              </Text>
              <Text style={styles.bottomViewTodayDate}>2019/1/2</Text>
            </View>
            <View style={styles.bottomViewRight}>
              <Text style={styles.low}>low</Text>
              <Text style={styles.high}>
                high
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  

}

const styles = StyleSheet.create({
  imageStyle : {
    width: width,
    height: 100
  },
  headerViewAnimated: {
    width: SCREEN_WIDTH,
    position: 'absolute'
  },
  titleViewAnimated: {
    width: SCREEN_WIDTH,
    position: 'absolute'
  },
  headerView: {
    marginRight: 5,
    marginLeft: 5
  },
  location: {
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 35,
    color: '#fff'
  },
  forecast: {
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 3,
    color: '#fff'
  },
  stickyHeaderView: {
    paddingTop: 24,
    paddingLeft: 12,
    flexDirection: 'row'
  },
  stickyHeaderLocation: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6
  },
  stickyHeaderToday: {
    color: '#fff',
    fontSize: 16
  },
  centerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  centerImageView: {
    paddingRight: 20
  },
  currentTemp: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '200'
  },
  feelsLike: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 40
  },
  bottomViewLeft: {
    flex: 1,
    flexDirection: 'row'
  },
  bottomViewToday: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
    fontSize: 16
  },
  bottomViewTodayDate: {
    color: '#fff',
    fontSize: 16
  },
  bottomViewRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  low: {
    color: '#fff',
    marginRight: 12,
    fontSize: 18,
    fontWeight: '300',
    width: 22,
    textAlign: 'right',
  },
  high: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    width: 24,
    textAlign: 'right',
  },
  childrenView: {
    top: -30
  }
});


