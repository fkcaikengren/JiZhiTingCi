import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, StyleSheet,Text, View} from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator, Button } from 'react-navigation';


import DetailDictPage from '../component/DetailDictPage';
import DetailRootPage from '../page/vocabulary/DetailRootPage';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');



export default createAppContainer(createMaterialTopTabNavigator(
  {
    '详情词典':{
        screen:DetailDictPage,
    },
    '词根词缀':{
        screen:DetailRootPage,
    },

  },
  {
    
    initialRouteName: '详情词典',
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



