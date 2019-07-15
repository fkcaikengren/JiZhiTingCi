
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';


import WrongListPage from '../WrongListPage';
import PassListPage from '../PassListPage';
import LearnedListPage from '../LearnedListPage';
import NewListPage from '../NewListPage';

const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');



export default createAppContainer(createMaterialTopTabNavigator(
  {
    '错词':{
        screen:WrongListPage
    },
    'Pass':{
        screen:PassListPage
    },
    '已学':{
        screen:LearnedListPage
    },
    '未学':{
        screen:NewListPage
    },

  },
  {
    
    initialRouteName: '错词',
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
      indicatorStyle: {width:width/4-40, marginLeft:20, backgroundColor:'#1890FF'},

    },
   
  }
));



