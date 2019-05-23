import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';

import DictCard from '../../component/DictCard';
import AliIcon from '../../component/AliIcon';

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


export default class DetailDictPage extends Component {
    
  render() {
    return (
      <Container style={styles.container}>
        <Content padder>
          <Grid>
            <Row style={{marginVertical:16}}>
              <View style={[styles.iconText, {marginLeft:5}]}>
                <Text style={{color:'#FFF'}}>v.</Text>
              </View>
              <View style={[styles.row, ]}>
                  <View style={[styles.row,]}>
                      <Text style={styles.phonetic}>/əˈbɒlɪʃ/</Text>
                      <AliIcon name='shengyin' size={26} color='#E59AAA'></AliIcon>
                  </View>
                  <View style={[{marginLeft:20}, styles.row]}>
                      <Text style={styles.phonetic}>/əˈbɑːlɪʃ/</Text>
                      <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                  </View>
              </View>
            </Row>
          </Grid>
            
          <DictCard/>
          <View style={{width:'100%', height:16, backgroundColor:'#F0F0F0'}}></View>
          <DictCard/>
        </Content>
      </Container>
    );
  }
}