

import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import IndexSectionList from './IndexSectionList'

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#FDFDFD',
  }
});


const sideSections = ['A','B', 'C', 'D', 'E', 'K', 'L', 'M', 'N','O', 'P', 'Q']

const onSectionselect = (section, index) => {
    //跳转到某一项
    console.log(index)  //0, 1, 2, 3
    console.log(section)//A, B, C, D
    // this._list.scrollToIndex({animated: false, index: this.sectionIndex[index], viewPosition:0});
}

storiesOf('IndexSectionList', module)
  .add('IndexSectionList', () =>
    <View style={styles.container}>
            <IndexSectionList
                sections={ sideSections}
                onSectionSelect={onSectionselect}/> 
    </View>
  )
  
 



