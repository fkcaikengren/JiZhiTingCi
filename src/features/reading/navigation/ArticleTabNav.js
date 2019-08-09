import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet,Text, View} from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';

import QuestionPage from '../QuestionPage'
import ArticlePage from '../ArticlePage'


export default createAppContainer(createMaterialTopTabNavigator(
  {
    '文章':{
        screen:ArticlePage,
    },
    '答题':{
        screen:QuestionPage,
    },

  },
  {
    
    initialRouteName: '文章',
    tabBarComponent:null
  }
));

