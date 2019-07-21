import React, { Component } from 'react';
import {StyleSheet, View, Text,  TouchableHighlight} from 'react-native';
import { Container, Header, Content, Grid, Row, Col, } from 'native-base';
import {PropTypes} from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import VocaGroupDao from '../service/VocaGroupDao'
import {playSound} from '../service/AudioFetch'
import DictCard from './DictCard';
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
    this.state = {wordDict:{}, highLight:false}
    if(!this.props.vocaGroupDao){
      console.log('自建')
      this.vocaGroupDao = new VocaGroupDao()
    }else{
      console.log('props vocaGroupDao')
      this.vocaGroupDao = this.props.vocaGroupDao
    }
  }

  componentDidMount(){
    console.log(this.props.vocaDao);
    //打开数据库，查询单词详情
    const wordDict = this.props.vocaDao.getWordDetail(this.props.word)
    this.setState({wordDict});
     //打开数据库，查询生词本信息
     this.vocaGroupDao.open()
     .then(()=>{
        //判断是否存在默认生词本中
        if(this.vocaGroupDao.isExistInDefault(this.props.word)){
          this.setState({highLight:true})
        }
     })
  }
  
  componentWillUnmount(){
    alert('detailDictPage out, close realm');
    this.vocaGroupDao.close();
  }



  render() {
    const {word, properties} = this.state.wordDict
    return (
      <Container style={styles.container}>
        <Content padder>
          {/* 单词 */}
          <View style={styles.row}>
            <Text style={{fontSize:18,fontWeight:'500',color:'#303030'}}>{word?word:''}</Text>
            <Ionicons name='ios-star' color={this.state.highLight?'#EE4':'#909090'} size={30} 
            style={{marginLeft:20}} 
            onPress={()=>{
              
              if(!this.state.highLight){ //不在默认生词本中
                let groupWord = {
                  word: word,
                  enPhonetic: properties?properties[0].enPhonetic:'',
                  enPronUrl: properties?properties[0].enPronUrl:'',
                  amPhonetic: properties?properties[0].amPhonetic:'',
                  amPronUrl: properties?properties[0].amPronUrl:'',
                  tran: this.props.tran
                }
                this.vocaGroupDao.addWordToDefault(groupWord)
                this.setState({highLight:true})
                alert('添加成功')
              }
              
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
                              <FontAwesome5 name='headphones-alt' color='#E59AAA' size={26} onPress={()=>{
                                  playSound(propInfo.enPronUrl)
                              }}/>
                          </View>
                          <View style={[{marginLeft:20}, styles.row]}>
                            <Text style={styles.phonetic}>{propInfo.amPhonetic}</Text>
                            <FontAwesome5 name='headphones-alt' color='#3F51B5' size={26} onPress={()=>{
                                playSound(propInfo.amPronUrl)
                            }}/>
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
      tran: PropTypes.string.isRquired,
      vocaDao: PropTypes.object.isRequired,
      vocaGroupDao: PropTypes.object.isRequired,
  }

// 组件参数默认属性
  static defaultProps = {
      word:'',
      tran:'',
      vocaDao:null,
      vocaGroupDao: null,
  }
}