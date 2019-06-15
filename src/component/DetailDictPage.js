import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';
import {getWordDetail} from '../dao/vocabulary/VocaDao'
import {PropTypes} from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons'


import VocaGroupDao from '../dao/vocabulary/VocaGroupDao'
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
      backgroundColor:'#1890FF',
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
    this.dao = new VocaGroupDao()
  }

  componentDidMount(){
    getWordDetail(this.props.word)
    .then(wordDict =>{
        this.setState({wordDict:wordDict});
        //打开数据库
        this.dao.open()
    })
    .catch(err=>{
      console.log("DetailDictPage: 读取单词信息失败");
      console.log(err)
    })
  }
  
  componentWillUnmount(){
    alert('detailDictPage out, close realm');
    this.dao.close();
  }

  render() {
    const {word, properties} = this.state.wordDict
    return (
      <Container style={styles.container}>
        <Content padder>
          {/* 单词 */}
          <View style={styles.row}>
            <Text style={{fontSize:18,fontWeight:'500',color:'#303030'}}>{word?word:''}</Text>
            <Ionicons name='ios-star' color='#909090' size={30} onPress={()=>{
              alert('add')
              let groupWord = {
                word: word,
                enPhonetic: properties?properties[0].enPhonetic:'',
                enPhoneticUrl: '',
                amPhonetic: properties?properties[0].amPhonetic:'',
                amPhoneticUrl: '',
                tran: 'xxxxxxx'
              }
              this.dao.addWordToDefault(groupWord)
            }}/>
          </View>
          {properties &&
            properties.map((propInfo , index)=>{
              return (
                // 词性
                <View key={index} >
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
                        //释义例句卡片
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



  static propTypes = {
      
      word: PropTypes.string.isRquired,
    
  }

// 组件参数默认属性
  static defaultProps = {
      word:''
  }
}