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

import LearnCardPage from './LearnCardPage'
import * as Constant from './common/constant'
import VocaTaskDao from './service/VocaTaskDao';
import VocaDao from './service/VocaDao'

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#FDFDFD',
    }
  });




  
const vocaDao = VocaDao.getInstance()
const vocaTaskDao = VocaTaskDao.getInstance()
vocaDao.open()
.then(realm=>{
  vocaTaskDao.open()
  .then(realm2=>{
    //页面
    storiesOf('LearnCardPage', module)
    .add('LearnCard', () =>
      <Provider store={store}>
          <MenuProvider>
              <Root>
                  <Container style={styles.container}>
                    <LearnCardPage />
                  </Container>
              </Root>
          </MenuProvider>
      </Provider>
    )
  })
})