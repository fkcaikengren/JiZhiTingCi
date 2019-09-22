import React from 'react';
import {StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from '../../redux/store'
import _util from '../../common/util'

import TestVocaTranPage from './TestVocaTranPage'
import * as Constant from './common/constant'
import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao'

const styles = StyleSheet.create({
    
  container:{
      flex:1,
      backgroundColor:'#FEFEFE',
  },
  content:{
      padding:10,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      height:'35%'
  },
  phoneticView:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
  },
  wordFont:{
      fontSize:30,
      color:'#202020',
      fontWeight:'600'
  },
});




  
const vocaDao = VocaDao.getInstance()
const vocaTaskDao = VocaTaskDao.getInstance()
vocaDao.open()
.then(realm=>{
  vocaTaskDao.open()
  .then(realm2=>{
    //页面
    storiesOf('TestVocaTranPage', module)
    .add('TestVocaTran', () =>
      <Provider store={store}>
          <MenuProvider>
              <TestVocaTranPage  />
          </MenuProvider>
      </Provider>
    )
  })
})
