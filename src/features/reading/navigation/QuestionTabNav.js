import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet,Text, View} from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import QuestionPage from '../QuestionPage'
import AnalysisPage from '../AnalysisPage'


export default createAppContainer(createMaterialTopTabNavigator(
  {
    '答题':{
        screen:QuestionPage,
    },
    '答案解析':{
        screen:AnalysisPage,
    },

  },
  {
    
    initialRouteName: '答题',
    tabBarOptions: {
      activeTintColor:'#1890FF',
      inactiveTintColor:'#101010',
      pressColor:'#CBE4FD',
      style:{
        height:40,
        backgroundColor:'#FDFDFD',
        elevation: 0,
      },
      labelStyle: {fontSize:16,margin:0},
      indicatorStyle: { backgroundColor:'#1890FF'},

    },
   
  }
));