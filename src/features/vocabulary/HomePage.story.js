import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import {Container,Root,} from "native-base";
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from '../../redux/store'
import _util from '../../common/util'

import HomePage from './HomePage';
import HomeHeader from './component/HomeHeader'
import Task from './component/Task'
import HomeFooter from './component/HomeFooter';

//数据库
import VocaDao from '../vocabulary/service/VocaDao'
import VocaTaskDao from '../vocabulary/service/VocaTaskDao'

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#FDFDFD',
  }
});

//模拟数据
let tasks = [{
  taskOrder: 1,
  status: 0,
  vocaTaskDate: _util.getDayTime(0),
  process: 'IN_LEARN_PLAY',
  curIndex: 0,
  leftTimes: 0,
  delayDays: 12,
  dataCompleted: true,
  createTime: '',
  isSync: true,
  wordCount:15,
  words:[{word: 'abandon',
      passed: false,
      wrongNum: 0,
      testWrongNum: ''},]
},{
  taskOrder: 2,
  status: 2,
  vocaTaskDate: _util.getDayTime(0),
  process: 'IN_REVIEW_FINISH',
  curIndex: 0,
  leftTimes: 12,
  delayDays: 0,
  dataCompleted: true,
  createTime: '',
  isSync: true,
  wordCount:15,
  words:[{word: 'abandon',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      },]
},{
  taskOrder: 1,
  status: 1,
  vocaTaskDate: _util.getDayTime(0),
  process: 'IN_REVIEW_PLAY',
  curIndex: 0,
  leftTimes: 2,
  delayDays: 12,
  dataCompleted: true,
  createTime: '',
  isSync: true,
  wordCount:15,
  words:[{word: 'abandon',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      },]
}]

const vocaDao = VocaDao.getInstance()
const vocaTaskDao = VocaTaskDao.getInstance()
vocaDao.open()
.then(realm=>{
  vocaTaskDao.open()
  .then(realm2=>{
    //页面
    storiesOf('HomePage', module)
    .add('Home', () =>
      <Provider store={store}>
          <MenuProvider>
              <Root>
                  <Container style={styles.container}>
                    <HomePage />
                  </Container>
              </Root>
          </MenuProvider>
      </Provider>
    )
    .add('Header', ()=> 
      <HomeHeader  offset={new Animated.Value(0)} current={0}>
          
      </HomeHeader>
    )
    .add('Task', ()=>
      <Task tasks={tasks}  />
    )
    .add('Footer', ()=>{
      <View style={{
          flex: 1,
          backgroundColor: '#F9F9F9'
      }}>
        <HomeFooter task={tasks[1]}/>
      </View>
    })
  })
})



