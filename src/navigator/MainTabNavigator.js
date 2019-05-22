import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet,Text, View} from 'react-native';
import { createStackNavigator, Button, createBottomTabNavigator } from 'react-navigation';

import AliIcon from '../component/AliIcon';
import HomePage from '../page/vocabulary/HomePage';
import ReadPage from '../page/reading/ReadPage';
import GrammaPage from '../page/gramma/GrammaPage';
import MinePage from '../page/mine/MinePage';
import VocaPlayPage from '../page/vocabulary/VocaPlayPage';
import VocaLibPage from '../page/vocabulary/VocaLibPage';
import VocaListPage from '../page/vocabulary/VocaListPage';
import StatisticsPage from '../page/vocabulary/StatisticsPage';
import LearnCardPage from '../page/vocabulary/LearnCardPage';
import VocaDetailPage from '../page/vocabulary/VocaDetailPage';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');




// 单词模块
const HomeStackNav = createStackNavigator(
  {
    // 首页
    Home: {
      screen: HomePage,
    },
    // 单词库
    VocaLib:{
      screen:VocaLibPage,
    },
    // 单词列表
    VocaList:{
      screen:VocaListPage,
    },
    // 我的单词

    // 学习统计
    Statistics:{
      screen:StatisticsPage,
    },
    // 单词轮播
    VocaPlay: {
      screen: VocaPlayPage,
    },
    // 卡片学习
    LearnCard: {
      screen: LearnCardPage,
    },
    //单词详情
    VocaDetail: {
      screen: VocaDetailPage,
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





// 语法模块
const GrammaStackNav = createStackNavigator(
  {
    // 语法
    Gramma: {
      screen:GrammaPage,
    }
  },
  {
    initialRouteName: 'Gramma',
    headerMode:'none',
  }
);


// 我的模块
const MineStackNav = createStackNavigator(
  {
    // 我的
    Mine: {
      screen:MinePage,
     
    }
  },
  {
    initialRouteName: 'Mine',
    headerMode:'none',
  }
);


export default createBottomTabNavigator(
  {
      '词汇':{
        screen:HomeStackNav,
        navigationOptions: {
          tabBarLabel: '词汇',
          tabBarIcon: ({tintColor, focused}) => (
              <AliIcon name='yingyong-beidanci-yingyongjianjie' size={24} color={tintColor}></AliIcon>
          ),
        }
      },
     
      '阅读':{
        screen: ReadPage,
        navigationOptions: {
          tabBarLabel: '阅读',
          tabBarIcon: ({tintColor, focused}) => (
              <AliIcon name='yuedureading19-copy' size={24} color={tintColor}></AliIcon>
          ),
        }
      },

      '语法':{
        screen: GrammaStackNav,
        navigationOptions: {
          tabBarLabel: '语法',
          tabBarIcon: ({tintColor, focused}) => (
              <AliIcon name='yingyu' size={24} color={tintColor}></AliIcon>
          ),
        }
      },
      '我的':{
        screen: MineStackNav,
        navigationOptions: {
          tabBarLabel: '我的',
          tabBarIcon: ({tintColor, focused}) => (
              <AliIcon name='wode' size={24} color={tintColor}></AliIcon>
          ),
        }
      },

  },
  {
    
    initialRouteName: '词汇',
    
    tabBarOptions: {
      activeTintColor: '#1890FF',
      inactiveTintColor: '#7F7F7F',
      style: {
        backgroundColor: '#FDFDFD',
      },
    },
    
  
   
  }
);



