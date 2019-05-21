import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text} from 'react-native';
import {
  Container,Button, Icon,
} from "native-base";

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#1890FF',
  }
});

// import HomePage from './src/page/HomePage';
import AppNavigator from './src/navigator/AppNavigator';
import AliIcon from './src/component/AliIcon';
/**
 *Created by Jacy on 19/05/11.
 */
export default class App extends React.Component {
  render(){
    return(
      <Container style={styles.container}>
        <Button style={{backgroundColor:'#1890FF', borderWidth:0, elevation:0, position:'absolute', left:5, top:5,}}>
            <AliIcon name='user-active' size={22} color='#FFF' style={{marginLeft:5}}></AliIcon>
        </Button>
        <AppNavigator/>
      </Container>
    );
  }
}