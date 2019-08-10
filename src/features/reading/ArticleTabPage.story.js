import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from '../../redux/store'
import ArticleTabPage from './ArticleTabPage'
import * as Constant from './common/constant'


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#FDFDFD',
  }
});

//模拟数据
//词库: CET-4 等
// 文章编号、文章类型


storiesOf('ArticleTabPage', module)
  .add('1-ArticleTab', () =>
    <Provider store={store}>
        <MenuProvider>
            <View style={styles.container}>
                <ArticleTabPage 
                vocaLibName='read' articleCode={3} articleType={Constant.DETAIL_READ}/>
            </View>
        </MenuProvider>
    </Provider>
  )
 