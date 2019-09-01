import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import VocaDao from '../service/VocaDao'
import VocaCard from './VocaCard'

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#FDFDFD',
    }
  });

  //打开数据库
const vocaDao = VocaDao.getInstance()
vocaDao.open()
.then(realm=>{
    storiesOf('VocaCard', module)
    .add('VocaCard', () =>
      <VocaCard  wordInfo={vocaDao.getWordInfo('detail')}/>
    )
})






