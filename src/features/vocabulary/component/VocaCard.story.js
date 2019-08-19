import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import VocaCard from './VocaCard'

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#FDFDFD',
    }
  });


storiesOf('VocaCard', module)
  .add('VocaCard', () =>
        <VocaCard  />
  )




