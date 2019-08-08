
import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import gstyles from '../../../style'

import ColorRadio from './ColorRadio'

const colors = ['#FFFFFF', '#FFCCFF', '#F7F5D6', '#E4CFA4',
'#BADFC0', '#EFEFEF', '#222222'];

storiesOf('ColorRadio', module)
  .add('ColorRadio', () =>
    <View style={[gstyles.r_center, {marginTop:50,backgroundColor:'#AAA'}]}>
        <ColorRadio 
            colors={colors}
            size={20}
            containerStyle={{width:200,borderWidth:1}}
        />
    </View>
  )




