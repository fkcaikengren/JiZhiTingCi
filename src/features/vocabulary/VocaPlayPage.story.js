import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {Container,Root,} from "native-base";
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from '../../redux/store'
import _util from '../../common/util'

import VocaPlayPage from './VocaPlayPage';
import * as Constant from './common/constant'
import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao'

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#FDFDFD',
    }
  });

//打开数据库
const vocaDao = new VocaDao()
vocaDao.open()
const taskDao = new VocaTaskDao()
taskDao.open()
//模拟数据
const mode = Constant.REVIEW_PLAY
const task = {
  taskOrder: 1,
  status: 0,
  vocaTaskDate: _util.getDayTime(0),
  process: 'IN_REVIEW_FINISH',
  curIndex: 0,
  leftTimes: 3,
  delayDays: 0,
  dataCompleted: false,
  createTime: '',
  isSync: true,
  wordCount:15,
  words:[{word: 'apple',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'alike',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'bee', //3
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'share',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'model',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'abandon',  //6
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'pig',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'pretty',
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'link', //9
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },  //----------
    {
      word: 'magnet',  //10
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'market',  //11
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'paper',  //12
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'phone', //13
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },
    {
      word: 'computer',  //14
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    },{
      word: 'sir', //15
      passed: false,
      wrongNum: 0,
      testWrongNum: '',
      enPhonetic: '',
      enPronUrl: '',
      amPhonetic: '',
      amPronUrl: '',
      def: '',
      sentence: '',
      tran: ''
    }
  ]
}


storiesOf('VocaPlayPage', module)
  .add('VocaPlay', () =>
    <Provider store={store}>
        <MenuProvider>
            <Root>
                <Container style={styles.container}>
                  <VocaPlayPage mode={mode} task={task}
                    vocaDao={vocaDao}
                    taskDao={taskDao}/>
                </Container>
            </Root>
        </MenuProvider>
    </Provider>
  )




