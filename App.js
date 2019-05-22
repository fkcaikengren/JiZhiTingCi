import React, {Component} from 'react';
import {Platform, StatusBar, View, StyleSheet, Text} from 'react-native';
import {
  Container,Button, Icon,
} from "native-base";

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FDFDFD',
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
        <AppNavigator/>
      </Container>
    );
  }
}