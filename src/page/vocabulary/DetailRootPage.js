import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';

import AliIcon from '../../component/AliIcon';
import RootCard from '../../component/RootCard';

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#F0F0F0',
  },  
  iconText:{
      width:20,
      height:20,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'green',
      borderRadius:2,
      marginRight: 10,
  },
  row:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
  },
  phonetic:{
      fontSize: 16,
      color: '#101010',
  }
});


export default class DetailRootPage extends Component {
    
  render() {
    return (
      <Container style={styles.container}>
        <Content padder>
          <View style={{width:'100%', height:16, backgroundColor:'#F0F0F0'}}></View>
          <RootCard />
        </Content>
      </Container>
    );
  }
}