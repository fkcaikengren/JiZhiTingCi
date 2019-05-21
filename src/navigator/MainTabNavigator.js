import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet,Text, View} from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator, Button } from 'react-navigation';

import HomePage from '../page/HomePage';
import ReadPage from '../page/ReadPage';
import VocaPlayPage from '../page/VocaPlayPage';
import VocaLibPage from '../page/VocaLibPage';
import VocaListPage from '../page/VocaListPage';
import StatisticsPage from '../page/StatisticsPage';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');




// 单词模块
const HomeStackNav = createStackNavigator(
  {
    // 首页
    Home: {
      screen: HomePage,
    },
    // 单词轮播
    VocaPlay: {
      screen: VocaPlayPage,
    },
    // 单词库
    VocaLib:{
      screen:VocaLibPage,
    },
    //单词列表
    VocaList:{
      screen:VocaListPage,
    },
    //学习统计
    Statistics:{
      screen:StatisticsPage,
    }
  
  },
  {
    initialRouteName: 'Home',
    headerMode:'none'
  }
);

HomeStackNav.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let swipeEnabled = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
    swipeEnabled = false;
  }

  return {
    tabBarVisible,
    swipeEnabled,
  };
};





// 阅读模块
const ReadStackNav = createStackNavigator(
  {
    // 阅读
    Read: {
      screen:ReadPage,
     
    }
  },
  {
    initialRouteName: 'Read',
    headerMode:'none',
  }
);



export default createMaterialTopTabNavigator(
  {
      '单词':{
        screen:HomeStackNav
      },
     
      '阅读':{
        screen:ReadStackNav
      },

  },
  {
    
    initialRouteName: '单词',
    drawable:false,
    tabBarOptions: {
      activeTintColor:'#FFFFFF',
      inactiveTintColor:'#CBE4FD',
      pressColor:'#CBE4FD',
      style:{
        backgroundColor:'#1890FF',
        marginLeft:60,
        width:width-120,
        borderWidth:0,
        elevation: 0,
      },
      labelStyle: {fontSize:20},
      indicatorStyle: {height:0},

    },
   
  }
);



