

import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';



import VocaGroupDao from './service/VocaGroupDao'
import GroupVocaPage from './GroupVocaPage'


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#FDFDFD',
  }
});

VocaGroupDao.getInstance().open()

storiesOf('GroupVocaPage', module)
  .add('GroupVoca', () =>
    <View style={styles.container}>
        <GroupVocaPage />
    </View>
  )
  
 