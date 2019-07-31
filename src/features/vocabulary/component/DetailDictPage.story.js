import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import VocaDao from '../service/VocaDao'
import VocaGroupDao from '../service/VocaGroupDao';
import DetailDictPage from './DetailDictPage';

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#FDFDFD',
    }
  });

//打开数据库
const vocaDao = new VocaDao()
vocaDao.open()
const vocaGroupDao = new VocaGroupDao()
vocaGroupDao.open()


storiesOf('DetailDictPage', module)
  .add('DetailDict', () =>
        <DetailDictPage word='decline' vocaDao={vocaDao} />
  )




