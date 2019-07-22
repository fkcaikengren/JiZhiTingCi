import React from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import {Container,Root,} from "native-base";
import { MenuProvider } from 'react-native-popup-menu'
import {Provider} from 'react-redux';
import {store} from '../../redux/store'

import HomePage from './HomePage';
import HomeHeader from './component/HomeHeader'
import Task from './component/Task'

storiesOf('HomePage', module)
  .add('Home', () =>
    <Provider store={store}>
        <MenuProvider>
            <Root>
                 <HomePage />
            </Root>
        </MenuProvider>
    </Provider>
  )
  .add('Header', ()=> 
    <HomeHeader  offset={new Animated.Value(0)} current={0}>
        
    </HomeHeader>
  )
  .add('Task', ()=>
    <Task tasks={[1,2,3,4]}  />
  )


    