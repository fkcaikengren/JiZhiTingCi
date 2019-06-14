import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';
import {getWordDetail} from '../dao/vocabulary/VocaDao'
import {PropTypes} from 'prop-types';

import DictCard from './DictCard';
import AliIcon from './AliIcon';
const Dimensions = require('Dimensions');
let {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#F0F0F0',
    width:width,
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


  constructor(props){
    super(props);
    this.state = {wordDict:{}}
  }

  componentDidMount(){
    getWordDetail(this.props.word)
    .then(wordDict =>{
        this.setState({wordDict:wordDict})
    })
    .catch(err=>{
      console.log("DetailDictPage: 读取单词信息失败");
      console.log(err)
    })
    
  }
    
  render() {
    const {word, properties} = this.state.wordDict
    return (
      <Container style={styles.container}>
        <Content padder>
          <View style={styles.row}>
            <Text style={{fontSize:18,fontWeight:'500',color:'#303030'}}>{word?word:''}</Text>
          </View>
          {properties &&
            properties.map((propInfo , index)=>{
              return (

                <View key={index}>
                  <Grid>
                    <Row  style={{marginVertical:16}}>
                      <View style={[styles.iconText, {marginLeft:5}]}>
                        <Text style={{color:'#FFF'}}>{propInfo.property}</Text>
                      </View>
                      <View style={[styles.row, ]}>
                          <View style={[styles.row,]}>
                              <Text style={styles.phonetic}>{propInfo.enPhonetic}</Text>
                              <AliIcon name='shengyin' size={26} color='#E59AAA'></AliIcon>
                          </View>
                          <View style={[{marginLeft:20}, styles.row]}>
                              <Text style={styles.phonetic}>{propInfo.amPhonetic}</Text>
                              <AliIcon name='shengyin' size={26} color='#3F51B5'></AliIcon>
                          </View>
                      </View>
                    </Row>
                  </Grid>
                  {propInfo.defs &&
                    propInfo.defs.map((defInfo, index)=>{
                      return (
                        <DictCard key={index} defInfo={defInfo} order={index+1}/>
                      )
                    })
                  }
                </View>
              )
            })
          }
          
            
          
          <View style={{width:'100%', height:16, backgroundColor:'#F0F0F0'}}></View>
        </Content>
      </Container>
    );
  }



  static PropTypes = {
      
      word: PropTypes.string.isRquired,
    
  }

// 组件参数默认属性
  static defaultProps = {
      word:''
  }
}